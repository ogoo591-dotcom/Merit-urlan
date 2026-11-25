import "server-only";

import { readDb } from "@/server/mock/db";
import type { Payment } from "@/types/payments";

// Төлбөр унших.

export async function getPayments(status?: Payment["status"]): Promise<Payment[]> {
  return (await readDb()).payments.filter((item) => !status || item.status === status);
}

export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  return (await readDb()).payments.filter((item) => item.userId === userId);
}

export async function countPendingPayments(): Promise<number> {
  return (await getPayments("pending")).length;
}

// Энэ сургалт/схемийн төлбөр админы шалгалтад хүлээгдэж байгаа эсэх.
export async function hasPendingPayment(userId: string | null, kind: "course" | "pattern", itemId: string) {
  if (!userId) return false;
  return (await getPayments("pending")).some(
    (item) => item.userId === userId && (kind === "course" ? item.courseIds : item.patternIds).includes(itemId),
  );
}
