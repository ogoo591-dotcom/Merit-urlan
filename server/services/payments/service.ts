import "server-only";

import { formatPrice } from "@/lib/format";
import * as paymentRepo from "@/server/repository/finance/payment";
import * as paymentCourseRepo from "@/server/repository/finance/payment-course";
import * as paymentPatternRepo from "@/server/repository/finance/payment-pattern";
import * as orderItemRepo from "@/server/repository/order/order-item";
import * as productRepo from "@/server/repository/catalog/product";
import { transaction, type DbExecutor } from "@/server/repository/transaction";
import { notifyAdmin, notifyCustomer } from "@/server/services/notifications/service";
import { createOrder } from "@/server/services/orders/service";
import { grantAccess } from "@/server/services/purchases/service";
import { ensureActiveUser } from "@/server/services/users/service";
import { paymentCodePattern, type Payment } from "@/types/payments";
import type { CartInput, Order } from "@/types/orders";

// Дансаар шилжүүлсэн төлбөр (урсгалын тайлбар: types/payments.ts). QPay холбоход submit*-ийн оронд invoice үүсгэж,
// callback-аас approvePayment()-ийг дуудна.

type Item = { id: string; price: number };
type PaymentInput = {
  code: string;
  userId: string;
  customer?: Payment["customer"];
  amount: number;
  orderId?: number;
  courses: Item[];
  patterns: Item[];
  summary: string;
};

export function isValidPaymentCode(code: unknown): code is string {
  return typeof code === "string" && paymentCodePattern.test(code);
}

// Хүлээгдэж буй төлбөр + нээгдэх сургалт/схемийг бүртгэнэ (дуудагчийн transaction дотор).
async function recordPayment(input: PaymentInput, tx: DbExecutor) {
  if (await paymentRepo.paymentCodeExists(input.code, tx)) {
    throw new Error("Энэ гүйлгээний утга аль хэдийн бүртгэгдсэн байна. Дахин оролдоно уу.");
  }
  const payment = await paymentRepo.insertPayment(
    {
      code: input.code,
      userId: input.userId,
      orderId: input.orderId ?? null,
      amount: input.amount,
      summary: input.summary,
      customerName: input.customer?.name ?? null,
      customerPhone: input.customer?.phone ?? null,
    },
    tx,
  );
  await paymentCourseRepo.insertPaymentCourses(
    input.courses.map((item) => ({ paymentId: payment.id, courseId: item.id, price: item.price })),
    tx,
  );
  await paymentPatternRepo.insertPaymentPatterns(
    input.patterns.map((item) => ({ paymentId: payment.id, patternId: item.id, price: item.price })),
    tx,
  );
  return payment;
}

const notifyNewPayment = (payment: paymentRepo.PaymentRow) =>
  notifyAdmin({
    message: `Төлбөр шалгах: ${payment.code} — ${formatPrice(payment.amount)} (${payment.summary})`,
    href: "/admin/payments",
  });

// Сургалт/схем дангаар нь авах: хүлээгдэж буй төлбөр үүсгэж админд мэдэгдэнэ.
export async function createPayment(input: PaymentInput) {
  await ensureActiveUser(input.userId);
  const payment = await transaction((tx) => recordPayment(input, tx));
  await notifyNewPayment(payment);
  return payment;
}

// Checkout: бараа (захиалга + үлдэгдэл нөөцлөх) ба сургалтын төлбөрийг нэг transaction-д үүсгэнэ.
export async function submitCheckout(input: {
  code: string;
  userId: string;
  customer: Order["customer"];
  address: Order["address"];
  note: string;
  cart: CartInput;
  courses: Array<Item & { title: string }>;
}) {
  await ensureActiveUser(input.userId);
  const { order, payment } = await transaction(async (tx) => {
    const created = input.cart.length
      ? await createOrder({ userId: input.userId, customer: input.customer, address: input.address, note: input.note, cart: input.cart }, tx)
      : undefined;
    const recorded = await recordPayment(
      {
        code: input.code,
        userId: input.userId,
        customer: input.customer,
        amount: (created?.total ?? 0) + input.courses.reduce((sum, item) => sum + item.price, 0),
        orderId: created?.id,
        courses: input.courses,
        patterns: [],
        summary: [created ? `Захиалга #${created.id}` : "", ...input.courses.map((item) => item.title)].filter(Boolean).join(", "),
      },
      tx,
    );
    return { order: created, payment: recorded };
  });
  await notifyNewPayment(payment);
  return { order, payment };
}

// Админ баталгаажуулахад: төлбөр approved, сургалт/схем нээгдэнэ, хэрэглэгчид мэдэгдэнэ (бүгд нэг transaction).
export async function approvePayment(id: string, reviewedBy: string | null = null) {
  const result = await transaction(async (tx) => {
    const now = new Date();
    const payment = await paymentRepo.updatePendingPayment(id, { status: "approved", reviewedAt: now, reviewedBy, paidAt: now }, tx);
    if (!payment) return null;
    const [courses, patterns] = await Promise.all([
      paymentCourseRepo.listPaymentCoursesByPaymentIds([id], tx),
      paymentPatternRepo.listPaymentPatternsByPaymentIds([id], tx),
    ]);
    await grantAccess(
      {
        userId: payment.userId,
        paymentId: payment.id,
        courses: courses.map((item) => ({ itemId: item.courseId, price: item.price })),
        patterns: patterns.map((item) => ({ itemId: item.patternId, price: item.price })),
      },
      tx,
    );
    return { payment, courseIds: courses.map((item) => item.courseId), patternIds: patterns.map((item) => item.patternId) };
  });
  if (!result) return;

  // Ганц сургалт/схем бол шууд тэр рүү, бусад үед "Миний захиалгууд" руу.
  const { payment, courseIds, patternIds } = result;
  const href =
    !payment.orderId && courseIds.length === 1 && !patternIds.length
      ? `/courses/${courseIds[0]}/learn`
      : !payment.orderId && patternIds.length === 1 && !courseIds.length
        ? `/patterns/${patternIds[0]}/view`
        : "/account/orders";
  await notifyCustomer(payment.userId, { message: `Төлбөр баталгаажлаа (${payment.code}): ${payment.summary}`, href });
}

// Төлбөр орж ирээгүй бол: захиалгын нөөцөлсөн үлдэгдлийг буцааж, хэрэглэгчид мэдэгдэнэ.
export async function rejectPayment(id: string, reviewedBy: string | null = null) {
  const payment = await transaction(async (tx) => {
    const rejected = await paymentRepo.updatePendingPayment(id, { status: "rejected", reviewedAt: new Date(), reviewedBy }, tx);
    if (rejected?.orderId) {
      for (const item of await orderItemRepo.listItemsByOrder(rejected.orderId, tx)) {
        if (item.productId) await productRepo.increaseStock(item.productId, item.quantity, tx);
      }
    }
    return rejected;
  });
  if (!payment) return;
  await notifyCustomer(payment.userId, {
    message: `Төлбөр баталгаажсангүй (${payment.code}). Шилжүүлэг орж ирээгүй байна — асуух зүйл байвал Messenger-ээр холбогдоно уу.`,
    href: "/account/orders",
  });
}
