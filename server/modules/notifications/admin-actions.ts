"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/server/auth";
import { markRead, setNotificationRead } from "@/server/modules/notifications/service";

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
