import "server-only";

import { readDb } from "@/server/mock/db";
import type { AppNotification } from "@/types/notifications";

// Мэдэгдэл унших. Илгээх, уншсан болгох нь service.ts.

export const isFor = (notification: AppNotification, audience: { admin?: boolean; userId?: string | null }) =>
  (audience.admin && notification.audience === "admin") ||
  (Boolean(audience.userId) && notification.audience === "customer" && notification.userId === audience.userId);

export async function getAdminNotifications(): Promise<AppNotification[]> {
  return (await readDb()).notifications.filter((item) => item.audience === "admin");
}

export async function getCustomerNotifications(userId: string): Promise<AppNotification[]> {
  return (await readDb()).notifications.filter((item) => isFor(item, { userId }));
}

export async function countUnread(audience: { admin?: boolean; userId?: string | null }): Promise<number> {
  return (await readDb()).notifications.filter((item) => !item.read && isFor(item, audience)).length;
}
