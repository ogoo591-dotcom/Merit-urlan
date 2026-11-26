import "server-only";

import { asc } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdBrand } from "@/server/db/schema";

// md_brand
export type Brand = typeof mdBrand.$inferSelect;
export type NewBrand = typeof mdBrand.$inferInsert;

export async function insertBrands(rows: NewBrand[], db: DbExecutor = getDb()): Promise<Brand[]> {
  if (rows.length === 0) return [];
  return db.insert(mdBrand).values(rows).returning();
}

export function listBrands(db: DbExecutor = getDb()): Promise<Brand[]> {
  return db.select().from(mdBrand).orderBy(asc(mdBrand.name));
}

// Нэрээр олох, байхгүй бол нэмэх.
export async function upsertBrandByName(name: string, db: DbExecutor = getDb()): Promise<Brand> {
  const [row] = await db
    .insert(mdBrand)
    .values({ name })
    .onConflictDoUpdate({ target: mdBrand.name, set: { name } })
    .returning();
  return row;
}
