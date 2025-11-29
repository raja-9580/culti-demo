import { mockBatches } from '@/lib/mock-data';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Use real database if configured, otherwise fall back to mock data
    if (sql) {
      const batches = await sql`
        SELECT 
          b.*,
          f.farm_name,
          s.substrate_name,
          st.strain_code,
          m.mushroom_name
        FROM "cultivator-db".batch b
        LEFT JOIN "cultivator-db".farm f ON b.farm_id = f.farm_id
        LEFT JOIN "cultivator-db".substrate s ON b.substrate_id = s.substrate_id
        LEFT JOIN "cultivator-db".strain st ON b.strain_code = st.strain_code
        LEFT JOIN "cultivator-db".mushroom m ON st.mushroom_id = m.mushroom_id
        ORDER BY b.prepared_date DESC, b.batch_sequence DESC
      `;

      console.log(`✅ Fetched ${batches.length} batches from database`);
      console.log('Batch rows:', batches);
      return NextResponse.json({ batches });
    } else {
      console.warn('⚠️ Using mock data - DATABASE_URL not configured');
      return NextResponse.json({ batches: mockBatches });
    }
  } catch (error: any) {
    console.error('❌ Database query failed, falling back to mock data:', error?.message);
    return NextResponse.json({ batches: mockBatches });
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
