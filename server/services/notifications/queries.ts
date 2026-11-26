import "server-only";

import * as notificationRepo from "@/server/repository/notification/notification";
import type { AppNotification } from "@/types/notifications";

// Мэдэгдэл унших. Илгээх, уншсан болгох нь service.ts.

export function toAppNotification(row: notificationRepo.NotificationRow): AppNotification {
  return {
    id: row.id,
    audience: row.audience,
    ...(row.userId ? { userId: row.userId } : {}),
    message: row.message,
    ...(row.href ? { href: row.href } : {}),
    createdAt: row.createdAt.toISOString(),
    read: row.readAt !== null,
  };
}

export async function getAdminNotifications(): Promise<AppNotification[]> {
  return (await notificationRepo.listNotifications({ admin: true })).map(toAppNotification);
}

export async function getCustomerNotifications(userId: string): Promise<AppNotification[]> {
  return (await notificationRepo.listNotifications({ userId })).map(toAppNotification);
}

export function countUnread(audience: notificationRepo.Audience): Promise<number> {
  return notificationRepo.countUnreadNotifications(audience);
}
