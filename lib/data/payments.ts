import "server-only";

import { formatPrice } from "@/lib/format";
import { readDb, updateDb, type DbPayment } from "@/server/mock/db";
import { notifyAdmin, notifyCustomer } from "@/lib/notify";
import { paymentCodePattern } from "@/lib/payments";

// Дансаар шилжүүлсэн төлбөр (урсгалын тайлбар: lib/payments.ts). Одоогоор mock сан, дараа нь Supabase-ийн payments хүснэгт.

export type { DbPayment as Payment } from "@/server/mock/db";

export function isValidPaymentCode(code: unknown): code is string {
  return typeof code === "string" && paymentCodePattern.test(code);
}

// "Төлбөр шилжүүлсэн" дарахад: хүлээгдэж буй төлбөр үүсгэж админд мэдэгдэнэ.
export async function createPayment(input: Omit<DbPayment, "id" | "status" | "createdAt">): Promise<DbPayment> {
  const payment = await updateDb((db) => {
    if (db.payments.some((item) => item.code === input.code)) throw new Error("Энэ гүйлгээний утга аль хэдийн бүртгэгдсэн байна. Дахин оролдоно уу.");
    const created: DbPayment = { ...input, id: crypto.randomUUID(), status: "pending", createdAt: new Date().toISOString() };
    db.payments.unshift(created);
    return created;
  });
  await notifyAdmin({
    message: `Төлбөр шалгах: ${payment.code} — ${formatPrice(payment.amount)} (${payment.summary})`,
    href: "/admin/payments",
  });
  return payment;
}

export async function getPayments(status?: DbPayment["status"]): Promise<DbPayment[]> {
  return (await readDb()).payments.filter((item) => !status || item.status === status);
}

export async function getPaymentsByUser(userId: string): Promise<DbPayment[]> {
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

// Админ баталгаажуулахад: захиалга төлөгдсөн, сургалт/схем нээгдэнэ, хэрэглэгчид мэдэгдэнэ.
export async function approvePayment(id: string) {
  const payment = await updateDb((db) => {
    const found = db.payments.find((item) => item.id === id);
    if (!found || found.status !== "pending") return null;
    found.status = "approved";
    found.reviewedAt = new Date().toISOString();

    const order = found.orderId ? db.orders.find((item) => item.id === found.orderId) : undefined;
    if (order) order.payment.status = "paid";

    const grants = [
      ...found.courseIds.map((itemId) => ({ kind: "course" as const, itemId, price: db.courses.find((item) => item.id === itemId)?.price ?? 0 })),
      ...found.patternIds.map((itemId) => ({ kind: "pattern" as const, itemId, price: db.patterns.find((item) => item.id === itemId)?.price ?? 0 })),
    ];
    for (const grant of grants) {
      if (db.purchases.some((item) => item.userId === found.userId && item.kind === grant.kind && item.itemId === grant.itemId)) continue;
      db.purchases.push({ ...grant, id: crypto.randomUUID(), userId: found.userId, transactionId: found.code, createdAt: found.reviewedAt });
    }
    return found;
  });
  if (!payment) return;

  // Ганц сургалт/схем бол шууд тэр рүү, бусад үед "Миний захиалгууд" руу.
  const href =
    !payment.orderId && payment.courseIds.length === 1 && !payment.patternIds.length
      ? `/courses/${payment.courseIds[0]}/learn`
      : !payment.orderId && payment.patternIds.length === 1 && !payment.courseIds.length
        ? `/patterns/${payment.patternIds[0]}/view`
        : "/account/orders";
  await notifyCustomer(payment.userId, { message: `Төлбөр баталгаажлаа (${payment.code}): ${payment.summary}`, href });
}

// Төлбөр орж ирээгүй бол: захиалгын нөөцөлсөн үлдэгдлийг буцааж, хэрэглэгчид мэдэгдэнэ.
export async function rejectPayment(id: string) {
  const payment = await updateDb((db) => {
    const found = db.payments.find((item) => item.id === id);
    if (!found || found.status !== "pending") return null;
    found.status = "rejected";
    found.reviewedAt = new Date().toISOString();

    const order = found.orderId ? db.orders.find((item) => item.id === found.orderId) : undefined;
    if (order && order.payment.status !== "rejected") {
      order.payment.status = "rejected";
      for (const line of order.items) {
        const product = db.products.find((item) => item.id === line.id);
        if (product) product.stock += line.quantity;
      }
    }
    return found;
  });
  if (!payment) return;
  await notifyCustomer(payment.userId, {
    message: `Төлбөр баталгаажсангүй (${payment.code}). Шилжүүлэг орж ирээгүй байна — асуух зүйл байвал Messenger-ээр холбогдоно уу.`,
    href: "/account/orders",
  });
}
