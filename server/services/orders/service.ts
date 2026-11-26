import "server-only";

import { formatShortDate } from "@/lib/format";
import * as productRepo from "@/server/repository/catalog/product";
import * as productImageRepo from "@/server/repository/catalog/product-image";
import * as orderRepo from "@/server/repository/order/order";
import * as orderItemRepo from "@/server/repository/order/order-item";
import * as statusHistoryRepo from "@/server/repository/order/order-status-history";
import { transaction, type DbExecutor } from "@/server/repository/transaction";
import { fromUbDate, toUbDate } from "@/server/shared/date";
import { notifyCustomer } from "@/server/services/notifications/service";
import { orderStatusLabel, type CartInput, type Order, type OrderLine, type OrderStatus } from "@/types/orders";

// Захиалга. Захиалга + төлбөрийг нэг transaction-д үүсгэх нь payments/service.ts → submitCheckout.

// Сагсыг одоогийн үнэ, үлдэгдэлтэй тулгана (төлбөрөөс өмнө, мөн захиалга үүсгэх transaction дотор дахин).
export async function validateCart(cart: CartInput, db?: DbExecutor) {
  const ids = [...new Set(cart.map((entry) => entry.id))];
  const [products, images] = await Promise.all([productRepo.findProductsByIds(ids, db), productImageRepo.listImagesByProductIds(ids, db)]);
  const errors: string[] = [];
  const lines: OrderLine[] = [];

  for (const entry of cart) {
    const product = products.find((item) => item.id === entry.id);
    if (!product) {
      errors.push("Сагсанд байгаа зарим бараа зарагдахаа больсон байна.");
      continue;
    }
    if (!Number.isInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > product.stock) {
      errors.push(
        product.stock === 0
          ? `"${product.name}" дууссан байна.`
          : `"${product.name}" — хамгийн ихдээ ${product.stock} ширхэг захиалах боломжтой.`,
      );
      continue;
    }
    lines.push({
      id: product.id,
      name: product.name,
      image: images.find((image) => image.productId === product.id)?.path ?? "/Logo.png",
      price: product.price,
      quantity: entry.quantity,
      madeToOrder: product.availability === "made_to_order",
      ...(product.leadDays !== null ? { leadDays: product.leadDays } : {}),
    });
  }

  return { lines, total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0), errors };
}

// Үнэ, үлдэгдлийг дахин шалгаж захиалга үүсгээд үлдэгдэл хасна. Дуудагч transaction (tx) нээсэн байх ёстой.
export async function createOrder(
  input: { userId: string; customer: Order["customer"]; address: Order["address"]; note: string; cart: CartInput },
  tx: DbExecutor,
): Promise<Order> {
  const { lines, total, errors } = await validateCart(input.cart, tx);
  if (errors.length || !lines.length) throw new Error(errors[0] ?? "Сагс хоосон байна.");

  const now = new Date();
  const leadDays = Math.max(0, ...lines.filter((line) => line.madeToOrder).map((line) => line.leadDays ?? 0));
  const readyBy = leadDays ? toUbDate(new Date(now.getTime() + leadDays * 86_400_000)) : null;
  const order = await orderRepo.insertOrder(
    {
      userId: input.userId,
      customerName: input.customer.name,
      customerPhone: input.customer.phone,
      addressDistrict: input.address.district,
      addressKhoroo: input.address.khoroo,
      addressDetail: input.address.detail,
      note: input.note,
      total,
      status: "received",
      readyBy,
    },
    tx,
  );
  await orderItemRepo.insertOrderItems(
    lines.map((line) => ({
      orderId: order.id,
      productId: line.id,
      name: line.name,
      image: line.image,
      price: line.price,
      quantity: line.quantity,
      madeToOrder: line.madeToOrder,
      leadDays: line.leadDays ?? null,
    })),
    tx,
  );
  await statusHistoryRepo.insertStatusHistory({ orderId: order.id, status: "received" }, tx);
  // Зэрэг захиалгад үлдэгдэл хүрэлцэхгүй болвол бүх transaction буцна.
  for (const line of lines) {
    if (!(await productRepo.decreaseStock(line.id, line.quantity, tx))) throw new Error(`"${line.name}" үлдэгдэл хүрэлцэхгүй байна.`);
  }

  return {
    id: order.id,
    userId: order.userId,
    customer: input.customer,
    address: input.address,
    note: input.note,
    items: lines,
    total,
    status: "received",
    history: [{ status: "received", at: order.createdAt.toISOString() }],
    payment: { provider: "bank_transfer", transactionId: "", status: "pending" },
    createdAt: order.createdAt.toISOString(),
    ...(readyBy ? { readyBy: fromUbDate(readyBy) } : {}),
  };
}

// Статус солигдох бүрд захиалагчид мэдэгдэл очно.
export async function updateOrderStatus(id: number, status: OrderStatus, changedBy: string | null = null) {
  const order = await transaction(async (tx) => {
    const found = await orderRepo.findOrder(id, tx);
    if (!found || found.status === status) return null;
    await statusHistoryRepo.insertStatusHistory({ orderId: id, status, changedBy }, tx);
    return orderRepo.updateOrder(id, { status }, tx);
  });
  if (order) {
    await notifyCustomer(order.userId, {
      message: `Таны захиалга #${order.id}: ${orderStatusLabel(status)}`,
      href: "/account/orders",
    });
  }
}

// Админ "Бэлэн болох огноо" сонгоход захиалагчид мэдэгдэнэ. readyBy нь ISO мөр.
export async function setOrderReadyDate(id: number, readyBy: string) {
  const order = await orderRepo.updateOrder(id, { readyBy: toUbDate(new Date(readyBy)) });
  if (order) {
    await notifyCustomer(order.userId, {
      message: `Таны захиалга #${order.id} ${formatShortDate(readyBy)}-нд бэлэн болно`,
      href: "/account/orders",
    });
  }
}
