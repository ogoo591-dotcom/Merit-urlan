import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { finPayment, rlPaymentCourse } from "@/server/db/schema";

// rl_payment_course
export type PaymentCourse = typeof rlPaymentCourse.$inferSelect;
export type NewPaymentCourse = typeof rlPaymentCourse.$inferInsert;

export async function insertPaymentCourses(rows: NewPaymentCourse[], db: DbExecutor = getDb()): Promise<void> {
  if (rows.length === 0) return;
  await db.insert(rlPaymentCourse).values(rows);
}

export function listPaymentCoursesByPaymentIds(ids: string[], db: DbExecutor = getDb()): Promise<PaymentCourse[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(rlPaymentCourse).where(inArray(rlPaymentCourse.paymentId, ids));
}

// Хэрэглэгчийн энэ сургалтын төлбөр шалгагдаж (pending) байгаа эсэх.
export async function hasPendingCoursePayment(userId: string, itemId: string, db: DbExecutor = getDb()): Promise<boolean> {
  const rows = await db
    .select({ id: finPayment.id })
    .from(rlPaymentCourse)
    .innerJoin(finPayment, eq(finPayment.id, rlPaymentCourse.paymentId))
    .where(and(eq(finPayment.userId, userId), eq(finPayment.status, "pending"), eq(rlPaymentCourse.courseId, itemId)))
    .limit(1);
  return rows.length > 0;
}
