import "server-only";

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { serverEnv } from "@/server/env";
import * as schema from "@/server/db/schema";

export type Db = PostgresJsDatabase<typeof schema>;

// Dev-ийн hot reload бүрт шинэ connection pool үүсэхээс сэргийлж globalThis-д хадгална.
const globalForDb = globalThis as unknown as { meritDb?: Db };

// Supabase transaction pooler (6543) prepared statement дэмждэггүй тул prepare: false.
export function getDb(): Db {
  if (globalForDb.meritDb) return globalForDb.meritDb;
  const client = postgres(serverEnv().DATABASE_URL, { prepare: false, max: 5, idle_timeout: 20 });
  const db = drizzle({ client, schema });
  globalForDb.meritDb = db;
  return db;
}
