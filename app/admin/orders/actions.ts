"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { setOrderReadyDate, updateOrderStatus } from "@/lib/data/orders";
import { orderStatuses, type OrderStatus } from "@/lib/orders";

export async function changeOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as OrderStatus;
  if (!Number.isInteger(id) || !orderStatuses.some((item) => item.key === status)) return;
  await updateOrderStatus(id, status);
  revalidatePath("/admin", "layout");
}

export async function changeReadyDate(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const date = String(formData.get("readyBy") ?? "");
  if (!Number.isInteger(id) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  // Сонгосон өдрийн Улаанбаатарын цагаар 12:00.
  await setOrderReadyDate(id, new Date(`${date}T12:00:00+08:00`).toISOString());
  revalidatePath("/admin", "layout");
}
