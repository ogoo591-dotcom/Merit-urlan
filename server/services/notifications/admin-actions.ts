"use server";

import { runAdminAction } from "@/server/shared/admin-action";
import { markRead, setNotificationRead } from "@/server/services/notifications/service";

export async function toggleNotificationRead(formData: FormData) {
  await runAdminAction(() => setNotificationRead(String(formData.get("id")), formData.get("read") === "true"));
}

export async function markAllAdminNotificationsRead() {
  await runAdminAction(() => markRead({ admin: true }));
}
