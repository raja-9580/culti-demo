import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    if (!sql) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const bagletsData = await sql`
      SELECT
        bg.baglet_id,
        bg.batch_id,
        bg.current_status,
        bg.status_updated_at,
        bg.latest_weight_g,
        bg.latest_temp_c,
        bg.latest_humidity_pct
      FROM baglet bg
      WHERE bg.is_deleted = FALSE
    `;

    const baglets = bagletsData.map((row) => ({
      id: row.baglet_id,
      batchId: row.batch_id,
      status: row.current_status,
      lastStatusChange: row.status_updated_at,
      metrics: row.latest_temp_c ? {
        temperature: parseFloat(row.latest_temp_c),
        humidity: parseFloat(row.latest_humidity_pct) || 0,
        co2Level: 0,
        lightLevel: 0,
        recordedAt: row.status_updated_at,
      } : undefined,
    }));

    console.log(`✅ Fetched ${baglets.length} baglets from database`);
    return NextResponse.json({ baglets });

  } catch (error: any) {
    console.error('❌ Database query failed:', error?.message);
    return NextResponse.json({ error: 'Failed to fetch baglets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // TODO: Implement baglet creation
  // INSERT INTO baglets (...) VALUES (...);
  return NextResponse.json(
    { error: 'Not implemented yet' },
    { status: 501 }
  );
}
