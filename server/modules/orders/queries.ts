import "server-only";

import { readDb } from "@/server/mock/db";
import type { Order, OrderStatus } from "@/types/orders";

// Захиалга унших.

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  return (await readDb()).orders.filter((order) => order.userId === userId);
}

export async function getAllOrders(status?: OrderStatus): Promise<Order[]> {
  return (await readDb()).orders.filter((order) => !status || order.status === status);
}

export async function getOrder(id: number): Promise<Order | null> {
  return (await readDb()).orders.find((order) => order.id === id) ?? null;
}
