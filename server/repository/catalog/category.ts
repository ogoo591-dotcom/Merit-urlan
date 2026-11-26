import "server-only";

import { asc } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdCategory } from "@/server/db/schema";

// md_category
export type Category = typeof mdCategory.$inferSelect;
export type NewCategory = typeof mdCategory.$inferInsert;

export async function insertCategories(rows: NewCategory[], db: DbExecutor = getDb()): Promise<Category[]> {
  if (rows.length === 0) return [];
  return db.insert(mdCategory).values(rows).returning();
}

// Ангиллын мод жижиг тул бүгдийг нэг дор уншина.
export function listCategories(db: DbExecutor = getDb()): Promise<Category[]> {
  return db.select().from(mdCategory).orderBy(asc(mdCategory.position));
}
