import "server-only";

import { asc, eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdOrderItem } from "@/server/db/schema";

// md_order_item
export type OrderItem = typeof mdOrderItem.$inferSelect;
export type NewOrderItem = typeof mdOrderItem.$inferInsert;

export async function insertOrderItems(rows: NewOrderItem[], db: DbExecutor = getDb()): Promise<OrderItem[]> {
  if (rows.length === 0) return [];
  return db.insert(mdOrderItem).values(rows).returning();
}

export function listItemsByOrderIds(ids: number[], db: DbExecutor = getDb()): Promise<OrderItem[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(mdOrderItem).where(inArray(mdOrderItem.orderId, ids)).orderBy(asc(mdOrderItem.createdAt));
}

export function listItemsByOrder(orderId: number, db: DbExecutor = getDb()): Promise<OrderItem[]> {
  return db.select().from(mdOrderItem).where(eq(mdOrderItem.orderId, orderId));
}
