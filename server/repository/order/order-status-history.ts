import "server-only";

import { asc, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdOrderStatusHistory } from "@/server/db/schema";

// md_order_status_history
export type OrderStatusHistory = typeof mdOrderStatusHistory.$inferSelect;
export type NewOrderStatusHistory = typeof mdOrderStatusHistory.$inferInsert;

export async function insertStatusHistory(row: NewOrderStatusHistory, db: DbExecutor = getDb()): Promise<void> {
  await db.insert(mdOrderStatusHistory).values(row);
}

export function listHistoryByOrderIds(ids: number[], db: DbExecutor = getDb()): Promise<OrderStatusHistory[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db
    .select()
    .from(mdOrderStatusHistory)
    .where(inArray(mdOrderStatusHistory.orderId, ids))
    .orderBy(asc(mdOrderStatusHistory.changedAt));
}
