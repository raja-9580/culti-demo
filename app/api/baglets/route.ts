import { mockBaglets } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with real database query when Neon is set up
  // SELECT * FROM baglets;
  return NextResponse.json({ baglets: mockBaglets });
}

export async function POST(request: Request) {
  // TODO: Implement baglet creation
  // INSERT INTO baglets (...) VALUES (...);
  return NextResponse.json(
    { error: 'Not implemented yet' },
    { status: 501 }
  );
}
