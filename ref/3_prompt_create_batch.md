You are an expert Next.js + TypeScript + Neon Postgres engineer. Extend the existing **Cultivator** app to implement the **Batch creation flow** end-to-end.

## Context
- Tech stack is already set up: Next.js App Router, TypeScript, Tailwind, Neon (`lib/db.ts` with a working connection), and existing pages for Dashboard / Batches / Baglets.
- Database is Neon Postgres with these key tables/views already created:
  - `mushroom`, `strain_vendor`, `strain`
  - `substrate`, `medium`, `supplement`, `substrate_medium`, `substrate_supplement`
  - `batch`, `baglet`, `baglet_status_log`
  - Views: `v_strain_full`, `v_substrate_full` (they already join mushroom/strain/vendor and substrate/medium/supplements with all human-readable fields)
- ID formats are already final and MUST be preserved:
  - `batch.batch_id` like: `FPR-24092025-B01`
  - `baglet.baglet_id` like: `FPR-24092025-B01-GN1-NVD-M01-001`
  - Farm code is `FPR` for now.
- Business rules:
  - **Batch sequence** restarts at 1 for every **prepared_date** per farm (1,2,3,… for that date).
  - **Baglet sequence** starts at 1 for each batch and increments (001, 002, …).
  - Initial baglet status for newly created baglets = `'Planned'`.
  - We NEVER auto-generate IDs differently from the existing format.

## What to build

### 1. API: GET helpers for dropdowns
Create **API endpoints** that read from the views (not raw joins):

- `GET /api/strains`
  - Query: `SELECT * FROM v_strain_full ORDER BY mushroom_name, strain_code;`
  - Return a JSON array of options with fields that are good for the UI:
    - `strain_code`, `mushroom_code`, `mushroom_name`, `strain_vendor_id`, `vendor_name`, plus any descriptive label.
- `GET /api/substrates`
  - Query: `SELECT * FROM v_substrate_full ORDER BY substrate_name;`
  - Return a JSON array of options with:
    - `substrate_id`, `substrate_name`, and embedded `mediums` / `supplements` JSON from the view.
- These endpoints should be implemented in **Next.js Route Handlers** under `app/api/strains/route.ts` and `app/api/substrates/route.ts` using the existing Neon client from `lib/db.ts`.
- They are read-only and must be safe for serverless (no global connection pooling problems).

### 2. API: POST /api/batches – create batch + baglets + status logs
Implement `POST /api/batches` as a **single transaction** that:

**Input JSON body (from the Create Batch form):**
- `farm_id` (for now assume `"FPR"` can be defaulted server-side if not provided).
- `prepared_date` (ISO date string). Default behaviour:
  - If client does not send, use **today** in UTC.
  - Client UI should allow selecting a past date (for back-entry).
- `strain_code` (e.g. `"GN1"` or whatever is used in `strain` table).
- `substrate_id` (e.g. `"SUB001"`).
- `baglet_count` (integer, MUST be > 0).

**Server-side validation rules:**
- If `baglet_count <= 0`, return `400` with a clear error message.
- Ensure `strain_code` exists in `strain` and `substrate_id` exists in `substrate` (fail with 400 if not found).
- Trim and normalize date string and convert to `DATE` for `prepared_date`.

**Batch sequence calculation:**
- For the given `farm_id` + `prepared_date`, compute next `batch_sequence`:
  - Query: `SELECT COALESCE(MAX(batch_sequence),0) + 1 AS next_seq FROM batch WHERE farm_id = $1 AND prepared_date = $2;`
- Format `batch_id` exactly like the existing data: `FPR-24092025-B01`
  - Date part = `ddmmyyyy` from `prepared_date`.
  - Sequence part = `B` + two-digit batch sequence (`01`, `02`, etc).
- Insert into `batch` with:
  - `batch_id`, `farm_id`, `prepared_date`, `batch_sequence`
  - `substrate_id`, `strain_code`
  - `baglet_count`
  - `logged_by` (for now allow a string from request like `created_by`, or leave null with TODO).
  - `logged_timestamp = now()` and `is_deleted = FALSE`.

**Baglet generation + status logging:**
- After batch insert, generate exactly `baglet_count` baglets in code, with:
  - `baglet_sequence` from 1 to `baglet_count`
  - Sequence string = 3-digit zero-padded (`001`, `002`, …).
  - `baglet_id` using the final agreed format, e.g.:
    `FPR-24092025-B01-GN1-NVD-M01-001`
    (Use farm code + batch_id + strain + substrate code pieces exactly like the real data; if needed, query `strain` and `substrate` to get parts like `GN1`, `NVD`, `M01` in the transaction before building IDs.)
- Insert all rows into `baglet`:
  - Fields: `baglet_id`, `batch_id`, `baglet_sequence`, `current_status = 'Planned'`,
    `status_updated_at = now()`, `latest_weight_g`, `latest_temp_c`, `latest_humidity_pct` null,
    `contamination_flag = FALSE`, `logged_by`, `logged_timestamp = now()`, `is_deleted = FALSE`.
- Insert one row into `baglet_status_log` per baglet with:
  - `baglet_id`
  - `status` (or `new_status`) = `'Planned'`
  - `previous_status` = NULL
  - `status_timestamp = now()` (as `TIMESTAMPTZ`)
  - `logged_by` same as batch
  - `logged_timestamp = now()`, `is_deleted = FALSE`.
- Use a single transaction so either everything succeeds, or nothing is committed.

**Response:**
- On success return `201` with JSON:
  - `batch_id`, `baglet_count`, `created_baglet_ids: []`
  - Maybe echo human-friendly info about mushroom/strain/substrate for confirmation.

### 3. Frontend: Create Batch UI (Batches page)
On `/batches` page, implement a **Create Batch** drawer or modal with this behaviour:

- Trigger from primary button: “Create batch”.
- Fields:
  - `Mushroom strain` – dropdown populated from `GET /api/strains` using `v_strain_full`:
    - Label shows something like `"Golden Oyster – GN1 (Nuvedo Labs)"`.
    - Value stored = `strain_code` only.
  - `Substrate` – dropdown from `GET /api/substrates` using `v_substrate_full`:
    - Label shows e.g. `"SUB001 – 100% Mush Pellets (with mediums/supplements summary)"`.
    - Value stored = `substrate_id`.
  - `Prepared date` – date picker:
    - Default = **today**.
    - Allow choosing any past date (no future validation for now).
  - `Baglet count` – numeric input:
    - Must be integer > 0; show validation error otherwise.
- When user submits:
  - Disable submit button and show loading.
  - Call `POST /api/batches` with JSON body `{ prepared_date, strain_code, substrate_id, baglet_count, farm_id? }`.
  - On success:
    - Close modal.
    - Show a toast/snackbar “Batch X created with Y baglets”.
    - Refresh the batch list (either re-fetch from `/api/batches` or optimistic update).


