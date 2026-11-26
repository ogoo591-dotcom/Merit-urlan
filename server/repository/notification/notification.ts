import "server-only";

import { and, desc, eq, inArray, isNull, or, type SQL } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdNotification } from "@/server/db/schema";

// md_notification
export type NotificationRow = typeof mdNotification.$inferSelect;
export type NewNotification = typeof mdNotification.$inferInsert;

// admin: админы мэдэгдэл, userId: тухайн хэрэглэгчийн мэдэгдэл (хоёуланг нь өгвөл аль аль нь).
export type Audience = { admin?: boolean; userId?: string | null };

function audienceFilter({ admin, userId }: Audience): SQL {
  const parts = [
    admin ? eq(mdNotification.audience, "admin") : undefined,
    userId ? and(eq(mdNotification.audience, "customer"), eq(mdNotification.userId, userId)) : undefined,
  ].filter((part): part is SQL => !!part);
  // Хэнд ч хамаарахгүй бол юу ч олдохгүй нөхцөл.
  return parts.length ? or(...parts)! : eq(mdNotification.id, "00000000-0000-0000-0000-000000000000");
}

export async function insertNotification(row: NewNotification, db: DbExecutor = getDb()): Promise<NotificationRow> {
  const [created] = await db.insert(mdNotification).values(row).returning();
  return created;
}

export function listNotifications(audience: Audience, db: DbExecutor = getDb()): Promise<NotificationRow[]> {
  return db.select().from(mdNotification).where(audienceFilter(audience)).orderBy(desc(mdNotification.createdAt)).limit(500);
}

export function countUnreadNotifications(audience: Audience, db: DbExecutor = getDb()): Promise<number> {
  return db.$count(mdNotification, and(audienceFilter(audience), isNull(mdNotification.readAt)));
}

export async function markNotificationsRead(audience: Audience, ids?: string[], db: DbExecutor = getDb()): Promise<void> {
  await db
    .update(mdNotification)
    .set({ readAt: new Date() })
    .where(and(audienceFilter(audience), isNull(mdNotification.readAt), ids ? inArray(mdNotification.id, ids) : undefined));
}

export async function setNotificationReadAt(id: string, readAt: Date | null, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdNotification).set({ readAt }).where(eq(mdNotification.id, id));
}
