import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { finPayment, rlPaymentPattern } from "@/server/db/schema";

// rl_payment_pattern
export type PaymentPattern = typeof rlPaymentPattern.$inferSelect;
export type NewPaymentPattern = typeof rlPaymentPattern.$inferInsert;

export async function insertPaymentPatterns(rows: NewPaymentPattern[], db: DbExecutor = getDb()): Promise<void> {
  if (rows.length === 0) return;
  await db.insert(rlPaymentPattern).values(rows);
}

export function listPaymentPatternsByPaymentIds(ids: string[], db: DbExecutor = getDb()): Promise<PaymentPattern[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(rlPaymentPattern).where(inArray(rlPaymentPattern.paymentId, ids));
}

// Хэрэглэгчийн энэ схемийн төлбөр шалгагдаж (pending) байгаа эсэх.
export async function hasPendingPatternPayment(userId: string, itemId: string, db: DbExecutor = getDb()): Promise<boolean> {
  const rows = await db
    .select({ id: finPayment.id })
    .from(rlPaymentPattern)
    .innerJoin(finPayment, eq(finPayment.id, rlPaymentPattern.paymentId))
    .where(and(eq(finPayment.userId, userId), eq(finPayment.status, "pending"), eq(rlPaymentPattern.patternId, itemId)))
    .limit(1);
  return rows.length > 0;
}
