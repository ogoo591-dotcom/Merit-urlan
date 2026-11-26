import "server-only";

import { and, asc, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdProduct } from "@/server/db/schema";
import type { ProductType } from "@/types/catalog";

// md_product
export type Product = typeof mdProduct.$inferSelect;
export type NewProduct = typeof mdProduct.$inferInsert;

const visible = and(isNull(mdProduct.deletedAt), eq(mdProduct.isActive, true));

export async function insertProducts(rows: NewProduct[], db: DbExecutor = getDb()): Promise<Product[]> {
  if (rows.length === 0) return [];
  return db.insert(mdProduct).values(rows).returning();
}

export function countProducts(db: DbExecutor = getDb()): Promise<number> {
  return db.$count(mdProduct);
}

// Шинэ нь эхэндээ (mock-ийн unshift дараалалтай ижил).
export function listProducts(filter: { type?: ProductType } = {}, db: DbExecutor = getDb()): Promise<Product[]> {
  return db
    .select()
    .from(mdProduct)
    .where(and(visible, filter.type ? eq(mdProduct.type, filter.type) : undefined))
    .orderBy(desc(mdProduct.createdAt), asc(mdProduct.id));
}

export async function findProduct(id: string, db: DbExecutor = getDb()): Promise<Product | null> {
  const [row] = await db.select().from(mdProduct).where(and(eq(mdProduct.id, id), visible));
  return row ?? null;
}

export function findProductsByIds(ids: string[], db: DbExecutor = getDb()): Promise<Product[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(mdProduct).where(and(inArray(mdProduct.id, ids), visible));
}

// Устгасан бараа ч гэсэн id-г эзэлсэн хэвээр (давхардлыг шалгахад).
export async function productIdExists(id: string, db: DbExecutor = getDb()): Promise<boolean> {
  return (await db.$count(mdProduct, eq(mdProduct.id, id))) > 0;
}

export async function updateProduct(id: string, values: Partial<NewProduct>, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdProduct).set(values).where(eq(mdProduct.id, id));
}

export async function softDeleteProduct(id: string, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdProduct).set({ deletedAt: new Date() }).where(eq(mdProduct.id, id));
}

// Хүрэлцэх үед л хасна (зэрэг захиалгаас хамгаална). Хассан бол true.
export async function decreaseStock(id: string, quantity: number, db: DbExecutor = getDb()): Promise<boolean> {
  const rows = await db
    .update(mdProduct)
    .set({ stock: sql`${mdProduct.stock} - ${quantity}` })
    .where(and(eq(mdProduct.id, id), gte(mdProduct.stock, quantity)))
    .returning({ id: mdProduct.id });
  return rows.length > 0;
}

export async function increaseStock(id: string, quantity: number, db: DbExecutor = getDb()): Promise<void> {
  await db
    .update(mdProduct)
    .set({ stock: sql`${mdProduct.stock} + ${quantity}` })
    .where(eq(mdProduct.id, id));
}
