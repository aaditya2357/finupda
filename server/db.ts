import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Check for database URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create postgres client
const queryClient = postgres(process.env.DATABASE_URL);

// Create drizzle client with schema
export const db = drizzle(queryClient, { schema });