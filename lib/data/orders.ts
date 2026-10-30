import "server-only";

import { formatPrice, formatReadyDate, formatShortDate } from "@/lib/format";
import { readDb, updateDb, type Db } from "@/lib/mock/db";
import { notifyAdmin, notifyCustomer } from "@/lib/notify";
import { orderStatusLabel, type CartInput, type Order, type OrderLine, type OrderStatus } from "@/lib/orders";

// Захиалга. Одоогоор mock сан, дараа нь Supabase (place_order RPC г.м.) руу солино.

export type { CartInput, Order, OrderLine, OrderStatus } from "@/lib/orders";

const firstOrderId = 1023;

function checkCart(db: Db, cart: CartInput) {
  const errors: string[] = [];
  const lines: OrderLine[] = [];

  for (const entry of cart) {
    const product = db.products.find((item) => item.id === entry.id);
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
      image: product.images[0] ?? "/Logo.png",
      price: product.price,
      quantity: entry.quantity,
      madeToOrder: product.availability === "made_to_order",
      leadDays: product.leadDays,
    });
  }

  return { lines, total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0), errors };
}

// Сагсыг одоогийн үнэ, үлдэгдэлтэй тулгана (төлбөрөөс өмнө).
export async function validateCart(cart: CartInput) {
  return checkCart(await readDb(), cart);
}

// Үнэ, үлдэгдлийг серверт дахин шалгаж, нэг дор (atomic) захиалга үүсгээд үлдэгдэл хасна.
export async function createOrder(input: {
  userId: string;
  customer: Order["customer"];
  address: Order["address"];
  note: string;
  cart: CartInput;
  payment: Order["payment"];
}): Promise<Order> {
  const order = await updateDb((db) => {
    const { lines, total, errors } = checkCart(db, input.cart);
    if (errors.length || !lines.length) throw new Error(errors[0] ?? "Сагс хоосон байна.");

    const now = new Date();
    const leadDays = Math.max(0, ...lines.filter((line) => line.madeToOrder).map((line) => line.leadDays ?? 0));
    const created: Order = {
      id: Math.max(firstOrderId - 1, ...db.orders.map((item) => item.id)) + 1,
      userId: input.userId,
      customer: input.customer,
      address: input.address,
      note: input.note,
      items: lines,
      total,
      status: "received",
      history: [{ status: "received", at: now.toISOString() }],
      payment: input.payment,
      createdAt: now.toISOString(),
      readyBy: leadDays ? new Date(now.getTime() + leadDays * 86_400_000).toISOString() : undefined,
    };

    db.orders.unshift(created);
    for (const line of lines) {
      const product = db.products.find((item) => item.id === line.id);
      if (product) product.stock = Math.max(0, product.stock - line.quantity);
    }
    return created;
  });

  await notifyAdmin({ message: `Шинэ захиалга #${order.id} — ${formatPrice(order.total)}`, href: `/admin/orders/${order.id}` });
  return order;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  return (await readDb()).orders.filter((order) => order.userId === userId);
}

export async function getAllOrders(status?: OrderStatus): Promise<Order[]> {
  return (await readDb()).orders.filter((order) => !status || order.status === status);
}

export async function getOrder(id: number): Promise<Order | null> {
  return (await readDb()).orders.find((order) => order.id === id) ?? null;
}

// Статус солигдох бүрд захиалагчид мэдэгдэл очно.
export async function updateOrderStatus(id: number, status: OrderStatus) {
  const order = await updateDb((db) => {
    const found = db.orders.find((item) => item.id === id);
    if (!found || found.status === status) return null;
    found.status = status;
    found.history.push({ status, at: new Date().toISOString() });
    return found;
  });
  if (order) {
    await notifyCustomer(order.userId, {
      message: `Таны захиалга #${order.id}: ${orderStatusLabel(status)}`,
      href: "/account/orders",
    });
  }
}

// Админ "Бэлэн болох огноо" сонгоход захиалагчид мэдэгдэнэ.
export async function setOrderReadyDate(id: number, readyBy: string) {
  const order = await updateDb((db) => {
    const found = db.orders.find((item) => item.id === id);
    if (found) found.readyBy = readyBy;
    return found;
  });
  if (order) {
    await notifyCustomer(order.userId, {
      message: `Таны захиалга #${order.id} ${formatShortDate(readyBy)}-нд бэлэн болно`,
      href: "/account/orders",
    });
  }
}

export { formatReadyDate };
