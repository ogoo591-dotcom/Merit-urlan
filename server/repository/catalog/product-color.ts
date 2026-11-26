import "server-only";

import { eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { rlProductColor } from "@/server/db/schema";

// rl_product_color
export type ProductColor = typeof rlProductColor.$inferSelect;
export type NewProductColor = typeof rlProductColor.$inferInsert;

export async function insertProductColors(rows: NewProductColor[], db: DbExecutor = getDb()): Promise<ProductColor[]> {
  if (rows.length === 0) return [];
  return db.insert(rlProductColor).values(rows).returning();
}

export function listColorsByProductIds(ids: string[], db: DbExecutor = getDb()): Promise<ProductColor[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(rlProductColor).where(inArray(rlProductColor.productId, ids));
}

export async function deleteColorsByProduct(productId: string, db: DbExecutor = getDb()): Promise<void> {
  await db.delete(rlProductColor).where(eq(rlProductColor.productId, productId));
}
