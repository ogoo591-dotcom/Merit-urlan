"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { markRead, setNotificationRead } from "@/lib/data/notifications";

export async function toggleNotificationRead(formData: FormData) {
  await requireAdmin();
  await setNotificationRead(String(formData.get("id")), formData.get("read") === "true");
  revalidatePath("/admin", "layout");
}

export async function markAllAdminNotificationsRead() {
  await requireAdmin();
  await markRead({ admin: true });
  revalidatePath("/admin", "layout");
}
