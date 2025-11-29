import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
    try {
        if (!sql) {
            return NextResponse.json(
                { error: 'Database connection not configured' },
                { status: 500 }
            );
        }

        // Query with schema-qualified table name
        console.log('🧪 Querying "cultivator-db".batch with schema qualification');
        const batches = await sql`SELECT * FROM "cultivator-db".batch LIMIT 10`;
        
        console.log(`✅ Found ${batches.length} batches`);
        if (batches.length > 0) {
            console.log('📦 First batch:', batches[0]);
        }

        return NextResponse.json({
            success: true,
            message: 'Connected to cultivator-db schema',
            count: batches.length,
            data: batches
        });

    } catch (error: any) {
        console.error('❌ Database query failed:', error);
        return NextResponse.json(
            {
                error: 'Database query failed',
                details: error?.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
