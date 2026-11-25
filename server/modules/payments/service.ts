import "server-only";

import { formatPrice } from "@/lib/format";
import { updateDb } from "@/server/mock/db";
import { notifyAdmin, notifyCustomer } from "@/server/modules/notifications/service";
import { paymentCodePattern, type Payment } from "@/types/payments";

// Дансаар шилжүүлсэн төлбөр (урсгалын тайлбар: types/payments.ts). Одоогоор mock сан, дараа нь Supabase-ийн payments хүснэгт.

export function isValidPaymentCode(code: unknown): code is string {
  return typeof code === "string" && paymentCodePattern.test(code);
}

// "Төлбөр шилжүүлсэн" дарахад: хүлээгдэж буй төлбөр үүсгэж админд мэдэгдэнэ.
export async function createPayment(input: Omit<Payment, "id" | "status" | "createdAt">): Promise<Payment> {
  const payment = await updateDb((db) => {
    if (db.payments.some((item) => item.code === input.code)) throw new Error("Энэ гүйлгээний утга аль хэдийн бүртгэгдсэн байна. Дахин оролдоно уу.");
    const created: Payment = { ...input, id: crypto.randomUUID(), status: "pending", createdAt: new Date().toISOString() };
    db.payments.unshift(created);
    return created;
  });
  await notifyAdmin({
    message: `Төлбөр шалгах: ${payment.code} — ${formatPrice(payment.amount)} (${payment.summary})`,
    href: "/admin/payments",
  });
  return payment;
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
