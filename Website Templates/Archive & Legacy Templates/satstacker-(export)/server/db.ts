import pg from 'pg';

let dbPool: pg.Pool | null = null;

/**
 * Returns a configured PostgreSQL Pool instance.
 * Implements lazy initialization to avoid crashing on launch if environment variables are not yet present.
 */
export function getDbPool(): pg.Pool {
  if (!dbPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn(
        "DATABASE_URL key is not set. Standard persistence operations will bypass/warn to avoid crash."
      );
      // Initialize with dummy values so that simple instantiations do not block dev startup
      dbPool = new pg.Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '',
        database: 'satstacker'
      });
    } else {
      dbPool = new pg.Pool({
        connectionString,
        ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
          ? false 
          : { rejectUnauthorized: false }
      });
    }
  }
  return dbPool;
}
