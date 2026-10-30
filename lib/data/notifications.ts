import "server-only";

import { readDb, updateDb, type DbNotification } from "@/lib/mock/db";

// Мэдэгдэл унших. Илгээх нь lib/notify.ts.

export type { DbNotification as AppNotification } from "@/lib/mock/db";

const isFor = (notification: DbNotification, audience: { admin?: boolean; userId?: string | null }) =>
  (audience.admin && notification.audience === "admin") ||
  (Boolean(audience.userId) && notification.audience === "customer" && notification.userId === audience.userId);

export async function getAdminNotifications(): Promise<DbNotification[]> {
  return (await readDb()).notifications.filter((item) => item.audience === "admin");
}

export async function getCustomerNotifications(userId: string): Promise<DbNotification[]> {
  return (await readDb()).notifications.filter((item) => isFor(item, { userId }));
}

export async function countUnread(audience: { admin?: boolean; userId?: string | null }): Promise<number> {
  return (await readDb()).notifications.filter((item) => !item.read && isFor(item, audience)).length;
}

export async function markRead(audience: { admin?: boolean; userId?: string | null }, ids?: string[]) {
  await updateDb((db) => {
    for (const item of db.notifications) {
      if (isFor(item, audience) && (!ids || ids.includes(item.id))) item.read = true;
    }
  });
}

export async function setNotificationRead(id: string, read: boolean) {
  await updateDb((db) => {
    const item = db.notifications.find((entry) => entry.id === id);
    if (item) item.read = read;
  });
}
