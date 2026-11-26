import "server-only";

import * as paymentRepo from "@/server/repository/finance/payment";
import * as paymentCourseRepo from "@/server/repository/finance/payment-course";
import * as paymentPatternRepo from "@/server/repository/finance/payment-pattern";
import type { Payment } from "@/types/payments";

// Төлбөр унших. fin_payment + нээгдэх сургалт/схемийг Payment хэлбэр рүү угсарна.

async function toPayments(rows: paymentRepo.PaymentRow[]): Promise<Payment[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const [courses, patterns] = await Promise.all([
    paymentCourseRepo.listPaymentCoursesByPaymentIds(ids),
    paymentPatternRepo.listPaymentPatternsByPaymentIds(ids),
  ]);
  return rows.map((row) => ({
    id: row.id,
    code: row.code,
    userId: row.userId,
    ...(row.customerName ? { customer: { name: row.customerName, phone: row.customerPhone ?? "" } } : {}),
    amount: row.amount,
    status: row.status,
    ...(row.orderId !== null ? { orderId: row.orderId } : {}),
    courseIds: courses.filter((item) => item.paymentId === row.id).map((item) => item.courseId),
    patternIds: patterns.filter((item) => item.paymentId === row.id).map((item) => item.patternId),
    summary: row.summary,
    createdAt: row.createdAt.toISOString(),
    ...(row.reviewedAt ? { reviewedAt: row.reviewedAt.toISOString() } : {}),
  }));
}

export async function getPayments(status?: Payment["status"]): Promise<Payment[]> {
  return toPayments(await paymentRepo.listPayments({ status }));
}

export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  return toPayments(await paymentRepo.listPayments({ userId }));
}

export function countPendingPayments(): Promise<number> {
  return paymentRepo.countPaymentsByStatus("pending");
}

// Энэ сургалт/схемийн төлбөр админы шалгалтад хүлээгдэж байгаа эсэх.
export async function hasPendingPayment(userId: string | null, kind: "course" | "pattern", itemId: string) {
  if (!userId) return false;
  return kind === "course"
    ? paymentCourseRepo.hasPendingCoursePayment(userId, itemId)
    : paymentPatternRepo.hasPendingPatternPayment(userId, itemId);
}
