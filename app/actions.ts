"use server";

import { auth } from "@clerk/nextjs/server";

import { getCourse } from "@/lib/data/courses";
import { countUnread, markRead } from "@/lib/data/notifications";
import { createOrder, validateCart } from "@/lib/data/orders";
import { searchProducts } from "@/lib/data/products";
import { hasAccess, recordPurchase } from "@/lib/data/purchases";
import { formatPrice } from "@/lib/format";
import { notifyAdmin } from "@/lib/notify";
import { getAdminUser } from "@/lib/auth";
import { wait } from "@/lib/mock/store";
import type { CartInput, Order } from "@/lib/orders";

// Client компонентууд lib/data-г шууд импортлохгүй (сервер талын сан) — эдгээр server action-оор дамжина.

const cleanCart = (cart: CartInput): CartInput =>
  (Array.isArray(cart) ? cart : [])
    .slice(0, 50)
    .map((item) => ({ id: String(item.id).slice(0, 100), quantity: Math.floor(Number(item.quantity)) }));

export type FeedbackState = {
  sent?: boolean;
  error?: string;
  // Алдаа гарахад React маягтыг цэвэрлэдэг тул бичсэн утгыг буцааж харуулна.
  values?: { name: string; phone: string; interest: string; message: string };
};

// Нүүр хуудасны санал хүсэлтийн маягт: нэвтрэлт шаардахгүй, админы мэдэгдэл болж очно.
export async function sendFeedback(_state: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const field = (name: string, max: number) => String(formData.get(name) ?? "").trim().slice(0, max);
  // Honeypot бөглөгдсөн бол спам бот — амжилттай мэт хариулаад хадгалахгүй.
  if (field("website", 100)) return { sent: true };

  const values = {
    name: field("name", 80),
    phone: field("phone", 20),
    interest: field("interest", 120),
    message: field("message", 2000),
  };
  if (!values.name || !values.message) return { error: "Нэр, мессежээ бөглөнө үү.", values };
  if (!/^\+?[\d\s-]{8,}$/.test(values.phone)) return { error: "Утасны дугаараа зөв оруулна уу.", values };

  try {
    const interest = values.interest ? ` · Сонирхол: ${values.interest}` : "";
    await notifyAdmin({ message: `Санал хүсэлт: ${values.name} (${values.phone})${interest} — ${values.message}` });
  } catch (error) {
    console.error("Санал хүсэлт хадгалахад алдаа", error);
    return { error: "Илгээж чадсангүй. Дахин оролдох эсвэл Messenger-ээр бичнэ үү.", values };
  }
  return { sent: true };
}

export async function searchCatalog(query: string) {
  return searchProducts(String(query));
}

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

export type PlaceOrderResult = { ok: true; orderId?: number; courseIds: string[] } | { ok: false; error: string };

// Mock QPay: сервер талд 2 секунд "төлбөр шалгаад" захиалга үүсгэнэ. Жинхэнэ QPay-д invoice төлөгдсөнийг энд шалгана.
// Бараа байвал хүргэлтийн захиалга үүснэ, сургалт байвал худалдан авалт бүртгэгдэж хичээл шууд нээгдэнэ.
export async function placeOrder(input: {
  customer: Order["customer"];
  address: Order["address"];
  note: string;
  cart: CartInput;
  courses?: string[];
}): Promise<PlaceOrderResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Захиалахын тулд нэвтэрнэ үү." };

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

  await wait(2000);
  const transactionId = `TX-MOCK-${Date.now().toString(36).toUpperCase()}`;
  let orderId: number | undefined;
  try {
    if (check.lines.length) {
      const order = await createOrder({
        userId,
        customer,
        address,
        note: String(input.note ?? "").trim().slice(0, 1000),
        cart,
        payment: { provider: "qpay", transactionId },
      });
      orderId = order.id;
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Захиалга үүсгэхэд алдаа гарлаа." };
  }

  for (const course of courseCheck.lines) {
    await recordPurchase({ kind: "course", itemId: course.id, userId, price: course.price, transactionId });
    await notifyAdmin({ message: `Сургалт зарагдлаа: ${course.title} — ${formatPrice(course.price)}`, href: "/admin/courses" });
  }
  return { ok: true, orderId, courseIds: courseCheck.lines.map((line) => line.id) };
}

// Header: админ эсэх + уншаагүй мэдэгдлийн тоо (админ бол админы мэдэгдлийг ч оруулна).
export async function getViewerStatus(): Promise<{ isAdmin: boolean; unread: number }> {
  const { userId } = await auth();
  if (!userId) return { isAdmin: false, unread: 0 };
  const isAdmin = Boolean(await getAdminUser());
  return { isAdmin, unread: await countUnread({ userId, admin: isAdmin }) };
}

export async function markMyNotificationsRead() {
  const { userId } = await auth();
  if (userId) await markRead({ userId });
}
