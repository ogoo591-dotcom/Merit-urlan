"use server";

import { auth } from "@clerk/nextjs/server";

import { getCourse } from "@/server/services/courses/queries";
import { validateCart } from "@/server/services/orders/service";
import { hasPendingPayment } from "@/server/services/payments/queries";
import { isValidPaymentCode, submitCheckout } from "@/server/services/payments/service";
import { hasAccess } from "@/server/services/purchases/queries";
import type { CartInput, Order } from "@/types/orders";

const cleanCart = (cart: CartInput): CartInput =>
  (Array.isArray(cart) ? cart : [])
    .slice(0, 50)
    .map((item) => ({ id: String(item.id).slice(0, 100), quantity: Math.floor(Number(item.quantity)) }));

const cleanCourses = (courses: string[] | undefined) =>
  [...new Set((Array.isArray(courses) ? courses : []).slice(0, 20).map((id) => String(id).slice(0, 100)))];

export type CourseCheckLine = { id: string; title: string; price: number };

// Сагсанд байгаа сургалтуудыг шалгана: байгаа эсэх, одоогийн үнэ, аль хэдийн авсан эсэх.
async function checkCourses(courseIds: string[], userId: string | null) {
  const lines: CourseCheckLine[] = [];
  const errors: string[] = [];
  for (const id of courseIds) {
    const course = await getCourse(id);
    if (!course) {
      errors.push("Сагсанд байгаа зарим сургалт олдсонгүй.");
      continue;
    }
    if (await hasAccess(userId, id)) {
      errors.push(`"${course.title}" сургалтыг та аль хэдийн авсан байна — сагснаас хасна уу.`);
      continue;
    }
    if (await hasPendingPayment(userId, "course", id)) {
      errors.push(`"${course.title}" сургалтын төлбөр шалгагдаж байна — сагснаас хасна уу.`);
      continue;
    }
    lines.push({ id, title: course.title, price: course.price });
  }
  return { lines, errors, total: lines.reduce((sum, line) => sum + line.price, 0) };
}

// Бараа + сургалтыг нэг дор шалгана (төлбөрөөс өмнө).
export async function checkCart(cart: CartInput, courses: string[] = []) {
  const { userId } = await auth();
  const [products, courseCheck] = await Promise.all([validateCart(cleanCart(cart)), checkCourses(cleanCourses(courses), userId)]);
  return {
    lines: products.lines,
    courseLines: courseCheck.lines,
    errors: [...products.errors, ...courseCheck.errors],
    total: products.total + courseCheck.total,
  };
}

export type PlaceOrderResult = { ok: true; code: string; orderId?: number } | { ok: false; error: string };

// "Төлбөр шилжүүлсэн" дарахад: үнэ, үлдэгдлийг дахин тулгаж захиалга (үлдэгдэл нөөцөлнө) + хүлээгдэж буй төлбөрийг нэг transaction-д үүсгэнэ.
// Админ /admin/payments-д баталгаажуулмагц захиалга төлөгдөж, сургалт нээгдэнэ (server/services/payments/service.ts).
export async function placeOrder(input: {
  code: string;
  customer: Order["customer"];
  address: Order["address"];
  note: string;
  cart: CartInput;
  courses?: string[];
}): Promise<PlaceOrderResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Захиалахын тулд нэвтэрнэ үү." };
  if (!isValidPaymentCode(input.code)) return { ok: false, error: "Гүйлгээний утга буруу байна. Цонхыг хаагаад дахин оролдоно уу." };

  const customer = { name: String(input.customer?.name ?? "").trim().slice(0, 120), phone: String(input.customer?.phone ?? "").trim().slice(0, 20) };
  const address = {
    district: String(input.address?.district ?? "").trim().slice(0, 60),
    khoroo: String(input.address?.khoroo ?? "").trim().slice(0, 20),
    detail: String(input.address?.detail ?? "").trim().slice(0, 400),
  };
  const cart = cleanCart(input.cart);
  const needsDelivery = cart.length > 0;
  if (!customer.name || !/^[0-9+\s-]{8,}$/.test(customer.phone) || (needsDelivery && (!address.district || !address.detail))) {
    return {
      ok: false,
      error: needsDelivery ? "Нэр, утас (8+ оронтой), хүргэлтийн хаягаа бүрэн бөглөнө үү." : "Нэр, утсаа (8+ оронтой) бөглөнө үү.",
    };
  }

  const [check, courseCheck] = await Promise.all([validateCart(cart), checkCourses(cleanCourses(input.courses), userId)]);
  const errors = [...check.errors, ...courseCheck.errors];
  if (errors.length || (!check.lines.length && !courseCheck.lines.length)) return { ok: false, error: errors[0] ?? "Сагс хоосон байна." };

  try {
    const { order } = await submitCheckout({
      code: input.code,
      userId,
      customer,
      address,
      note: String(input.note ?? "").trim().slice(0, 1000),
      cart: check.lines.length ? cart : [],
      courses: courseCheck.lines,
    });
    return { ok: true, code: input.code, orderId: order?.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Захиалга үүсгэхэд алдаа гарлаа." };
  }
}
