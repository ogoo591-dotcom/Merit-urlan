import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdOrder } from "@/server/db/schema";
import type { OrderStatus } from "@/types/orders";

// md_order
export type OrderRow = typeof mdOrder.$inferSelect;
export type NewOrder = typeof mdOrder.$inferInsert;

export async function insertOrder(row: NewOrder, db: DbExecutor = getDb()): Promise<OrderRow> {
  const [created] = await db.insert(mdOrder).values(row).returning();
  return created;
}

export function listOrders(filter: { userId?: string; status?: OrderStatus } = {}, db: DbExecutor = getDb()): Promise<OrderRow[]> {
  return db
    .select()
    .from(mdOrder)
    .where(
      and(filter.userId ? eq(mdOrder.userId, filter.userId) : undefined, filter.status ? eq(mdOrder.status, filter.status) : undefined),
    )
    .orderBy(desc(mdOrder.id));
}

export async function findOrder(id: number, db: DbExecutor = getDb()): Promise<OrderRow | null> {
  const [row] = await db.select().from(mdOrder).where(eq(mdOrder.id, id));
  return row ?? null;
}

export async function updateOrder(id: number, values: Partial<NewOrder>, db: DbExecutor = getDb()): Promise<OrderRow | null> {
  const [row] = await db.update(mdOrder).set(values).where(eq(mdOrder.id, id)).returning();
  return row ?? null;
}
