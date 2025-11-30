
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    if (!sql) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const batchesData = await sql`
      SELECT 
        b.batch_id,
        b.farm_id,
        b.prepared_date,
        b.batch_sequence,
        b.substrate_id,
        b.strain_code,
        b.baglet_count,
        b.logged_timestamp,
        f.farm_name,
        s.substrate_name,
        st.strain_code,
        m.mushroom_name
      FROM batch b
      LEFT JOIN farm f ON b.farm_id = f.farm_id
      LEFT JOIN substrate s ON b.substrate_id = s.substrate_id
      LEFT JOIN strain st ON b.strain_code = st.strain_code
      LEFT JOIN mushroom m ON st.mushroom_id = m.mushroom_id
      WHERE b.is_deleted = FALSE
      ORDER BY b.prepared_date DESC, b.batch_sequence DESC
    `;

    // Map DB rows to Batch interface
    // Note: DB doesn't have status yet, defaulting to 'Planned'
    const batches = batchesData.map((row) => ({
      id: row.batch_id,
      mushroomType: row.mushroom_name,
      substrateCode: row.substrate_id,
      substrateDescription: row.substrate_name,
      plannedBagletCount: row.baglet_count,
      actualBagletCount: row.baglet_count, // Placeholder
      status: 'Planned', // Default status
      createdDate: row.logged_timestamp,
      preparedDate: row.prepared_date,
    }));

    console.log(`✅ Fetched ${batches.length} batches from database`);
    return NextResponse.json({ batches });

  } catch (error: any) {
    console.error('❌ Database query failed:', error?.message);
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // TODO: Implement batch creation
  // INSERT INTO batches (...) VALUES (...);
  return NextResponse.json(
    { error: 'Not implemented yet' },
    { status: 501 }
  );
}
