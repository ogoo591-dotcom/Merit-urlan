import "server-only";

import { asc, eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdProductImage } from "@/server/db/schema";

// md_product_image
export type ProductImage = typeof mdProductImage.$inferSelect;
export type NewProductImage = typeof mdProductImage.$inferInsert;

export async function insertProductImages(rows: NewProductImage[], db: DbExecutor = getDb()): Promise<ProductImage[]> {
  if (rows.length === 0) return [];
  return db.insert(mdProductImage).values(rows).returning();
}

export function listImagesByProductIds(ids: string[], db: DbExecutor = getDb()): Promise<ProductImage[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(mdProductImage).where(inArray(mdProductImage.productId, ids)).orderBy(asc(mdProductImage.position));
}

export async function deleteImagesByProduct(productId: string, db: DbExecutor = getDb()): Promise<void> {
  await db.delete(mdProductImage).where(eq(mdProductImage.productId, productId));
}
