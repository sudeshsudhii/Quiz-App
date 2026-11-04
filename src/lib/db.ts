import { Pool } from 'pg';

/**
 * Postgres connection (e.g. Supabase). When DATABASE_URL is not set the app
 * falls back to JSON files in the data directory, so local use needs no setup.
 */
const g = globalThis as unknown as { __pgPool?: Pool };

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!g.__pgPool) {
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    // Remove sslmode from the URL: pg would let it override the ssl option below.
    const cleaned = url.replace(/([?&])sslmode=[^&]*&?/, '$1').replace(/[?&]$/, '');
    g.__pgPool = new Pool({
      connectionString: cleaned,
      max: 5,
      ssl: local ? false : { rejectUnauthorized: false },
    });
  }
  return g.__pgPool;
}
