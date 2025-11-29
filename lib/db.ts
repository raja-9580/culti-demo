// Database client for Neon serverless PostgreSQL
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Database queries will fail.');
}

// Create SQL client
export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Helper to execute queries
export async function query<T = any>(sqlQuery: string, params?: any[]): Promise<T[]> {
  if (!sql) {
    throw new Error('Database connection not configured. Set DATABASE_URL in .env');
  }

  try {
    const result = params
      ? await sql(sqlQuery, params)
      : await sql(sqlQuery);

    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default { sql, query };
