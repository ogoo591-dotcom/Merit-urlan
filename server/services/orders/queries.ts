import "server-only";

import * as paymentRepo from "@/server/repository/finance/payment";
import * as orderRepo from "@/server/repository/order/order";
import * as orderItemRepo from "@/server/repository/order/order-item";
import * as statusHistoryRepo from "@/server/repository/order/order-status-history";
import { fromUbDate } from "@/server/shared/date";
import type { Order, OrderStatus } from "@/types/orders";

// Захиалга унших. md_order + мөр, статусын түүх, төлбөрийг (fin_payment) Order хэлбэр рүү угсарна.

async function toOrders(rows: orderRepo.OrderRow[]): Promise<Order[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const [items, history, payments] = await Promise.all([
    orderItemRepo.listItemsByOrderIds(ids),
    statusHistoryRepo.listHistoryByOrderIds(ids),
    paymentRepo.listPaymentsByOrderIds(ids),
  ]);
  return rows.map((row) => {
    // Хамгийн сүүлийн төлбөр (жагсаалт шинэ нь эхэндээ).
    const payment = payments.find((item) => item.orderId === row.id);
    return {
      id: row.id,
      userId: row.userId,
      customer: { name: row.customerName, phone: row.customerPhone },
      address: { district: row.addressDistrict, khoroo: row.addressKhoroo, detail: row.addressDetail },
      note: row.note,
      items: items
        .filter((item) => item.orderId === row.id)
        .map((item) => ({
          id: item.productId ?? "",
          name: item.name,
          image: item.image ?? "/Logo.png",
          price: item.price,
          quantity: item.quantity,
          madeToOrder: item.madeToOrder,
          ...(item.leadDays !== null ? { leadDays: item.leadDays } : {}),
        })),
      total: row.total,
      status: row.status,
      history: history.filter((entry) => entry.orderId === row.id).map((entry) => ({ status: entry.status, at: entry.changedAt.toISOString() })),
      payment: {
        provider: payment?.provider ?? "bank_transfer",
        transactionId: payment?.code ?? "",
        status: !payment || payment.status === "pending" ? "pending" : payment.status === "approved" ? "paid" : "rejected",
      },
      createdAt: row.createdAt.toISOString(),
      ...(row.readyBy ? { readyBy: fromUbDate(row.readyBy) } : {}),
    };
  });
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  return toOrders(await orderRepo.listOrders({ userId }));
}

export async function getAllOrders(status?: OrderStatus): Promise<Order[]> {
  return toOrders(await orderRepo.listOrders({ status }));
}

export async function getOrder(id: number): Promise<Order | null> {
  if (!Number.isInteger(id)) return null;
  const row = await orderRepo.findOrder(id);
  return row ? (await toOrders([row]))[0] : null;
}
