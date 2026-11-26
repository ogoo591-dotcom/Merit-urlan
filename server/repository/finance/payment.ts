import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { finPayment } from "@/server/db/schema";
import type { PaymentStatus } from "@/types/payments";

// fin_payment
export type PaymentRow = typeof finPayment.$inferSelect;
export type NewPayment = typeof finPayment.$inferInsert;

export async function insertPayment(row: NewPayment, db: DbExecutor = getDb()): Promise<PaymentRow> {
  const [created] = await db.insert(finPayment).values(row).returning();
  return created;
}

export function listPayments(filter: { status?: PaymentStatus; userId?: string } = {}, db: DbExecutor = getDb()): Promise<PaymentRow[]> {
  return db
    .select()
    .from(finPayment)
    .where(
      and(
        filter.status ? eq(finPayment.status, filter.status) : undefined,
        filter.userId ? eq(finPayment.userId, filter.userId) : undefined,
      ),
    )
    .orderBy(desc(finPayment.createdAt));
}

export function listPaymentsByOrderIds(ids: number[], db: DbExecutor = getDb()): Promise<PaymentRow[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(finPayment).where(inArray(finPayment.orderId, ids)).orderBy(desc(finPayment.createdAt));
}

export async function paymentCodeExists(code: string, db: DbExecutor = getDb()): Promise<boolean> {
  return (await db.$count(finPayment, eq(finPayment.code, code))) > 0;
}

export function countPaymentsByStatus(status: PaymentStatus, db: DbExecutor = getDb()): Promise<number> {
  return db.$count(finPayment, eq(finPayment.status, status));
}

// Зөвхөн pending төлөвтэйг шинэчилнэ (давхар баталгаажуулахаас хамгаална). Шинэчлэгдээгүй бол null.
export async function updatePendingPayment(id: string, values: Partial<NewPayment>, db: DbExecutor = getDb()): Promise<PaymentRow | null> {
  const [row] = await db
    .update(finPayment)
    .set(values)
    .where(and(eq(finPayment.id, id), eq(finPayment.status, "pending")))
    .returning();
  return row ?? null;
}
