"use server";

import { auth } from "@clerk/nextjs/server";

import { getAdminUser } from "@/server/auth";
import { countUnread } from "@/server/services/notifications/queries";
import { markRead } from "@/server/services/notifications/service";

// Header: админ эсэх + уншаагүй мэдэгдлийн тоо (админ бол админы мэдэгдлийг ч оруулна).
export async function getViewerStatus(): Promise<{ isAdmin: boolean; unread: number }> {
  const { userId } = await auth();
  if (!userId) return { isAdmin: false, unread: 0 };
  const isAdmin = Boolean(await getAdminUser());
  return { isAdmin, unread: await countUnread({ userId, admin: isAdmin }) };
}

export async function markMyNotificationsRead() {
  const { userId } = await auth();
  if (userId) await markRead({ userId });
}
