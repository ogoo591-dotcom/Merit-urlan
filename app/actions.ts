"use server";

import { auth } from "@clerk/nextjs/server";

import { countUnread, markRead } from "@/lib/data/notifications";
import { createOrder, validateCart } from "@/lib/data/orders";
import { searchProducts } from "@/lib/data/products";
import { getAdminUser } from "@/lib/auth";
import { wait } from "@/lib/mock/store";
import type { CartInput, Order } from "@/lib/orders";

// Client компонентууд lib/data-г шууд импортлохгүй (сервер талын сан) — эдгээр server action-оор дамжина.

const cleanCart = (cart: CartInput): CartInput =>
  (Array.isArray(cart) ? cart : [])
    .slice(0, 50)
    .map((item) => ({ id: String(item.id).slice(0, 100), quantity: Math.floor(Number(item.quantity)) }));

export async function searchCatalog(query: string) {
  return searchProducts(String(query));
}

export async function checkCart(cart: CartInput) {
  return validateCart(cleanCart(cart));
}

export type PlaceOrderResult = { ok: true; orderId: number } | { ok: false; error: string };

// Mock QPay: сервер талд 2 секунд "төлбөр шалгаад" захиалга үүсгэнэ. Жинхэнэ QPay-д invoice төлөгдсөнийг энд шалгана.
export async function placeOrder(input: {
  customer: Order["customer"];
  address: Order["address"];
  note: string;
  cart: CartInput;
}): Promise<PlaceOrderResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Захиалахын тулд нэвтэрнэ үү." };

  const customer = { name: String(input.customer?.name ?? "").trim().slice(0, 120), phone: String(input.customer?.phone ?? "").trim().slice(0, 20) };
  const address = {
    district: String(input.address?.district ?? "").trim().slice(0, 60),
    khoroo: String(input.address?.khoroo ?? "").trim().slice(0, 20),
    detail: String(input.address?.detail ?? "").trim().slice(0, 400),
  };
  if (!customer.name || !/^[0-9+\s-]{8,}$/.test(customer.phone) || !address.district || !address.detail) {
    return { ok: false, error: "Нэр, утас (8+ оронтой), хүргэлтийн хаягаа бүрэн бөглөнө үү." };
  }

  const cart = cleanCart(input.cart);
  const check = await validateCart(cart);
  if (check.errors.length || !check.lines.length) return { ok: false, error: check.errors[0] ?? "Сагс хоосон байна." };

  await wait(2000);
  try {
    const order = await createOrder({
      userId,
      customer,
      address,
      note: String(input.note ?? "").trim().slice(0, 1000),
      cart,
      payment: { provider: "qpay", transactionId: `TX-MOCK-${Date.now().toString(36).toUpperCase()}` },
    });
    return { ok: true, orderId: order.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Захиалга үүсгэхэд алдаа гарлаа." };
  }
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
