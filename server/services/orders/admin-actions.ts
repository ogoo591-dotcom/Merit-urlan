"use server";

import { runAdminAction } from "@/server/shared/admin-action";
import { setOrderReadyDate, updateOrderStatus } from "@/server/services/orders/service";
import { orderStatuses, type OrderStatus } from "@/types/orders";

export async function changeOrderStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as OrderStatus;
  if (!Number.isInteger(id) || !orderStatuses.some((item) => item.key === status)) return;
  await runAdminAction((adminId) => updateOrderStatus(id, status, adminId));
}

export async function changeReadyDate(formData: FormData) {
  const id = Number(formData.get("id"));
  const date = String(formData.get("readyBy") ?? "");
  if (!Number.isInteger(id) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  // Сонгосон өдрийн Улаанбаатарын цагаар 12:00.
  await runAdminAction(() => setOrderReadyDate(id, new Date(`${date}T12:00:00+08:00`).toISOString()));
}
