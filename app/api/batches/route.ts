import { mockBatches } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with real database query when Neon is set up
  // SELECT * FROM batches;
  return NextResponse.json({ batches: mockBatches });
}

export async function POST(request: Request) {
  // TODO: Implement batch creation
  // INSERT INTO batches (...) VALUES (...);
  return NextResponse.json(
    { error: 'Not implemented yet' },
    { status: 501 }
  );
}
