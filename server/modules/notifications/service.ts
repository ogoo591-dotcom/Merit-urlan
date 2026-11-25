import "server-only";

import { updateDb } from "@/server/mock/db";
import { isFor } from "@/server/modules/notifications/queries";
import type { AppNotification } from "@/types/notifications";

// Мэдэгдэл илгээх цэг. Одоогоор: сайт доторх мэдэгдэл (mock сан) + console.log.
// Telegram bot эсвэл имэйл нэмэхдээ доорх deliver() функцын дотор бичнэ — дуудаж буй газруудыг өөрчлөх шаардлагагүй.

type Message = { message: string; href?: string };

async function deliver(notification: AppNotification) {
  const target = notification.audience === "admin" ? "Админд" : `Хэрэглэгчид (${notification.userId})`;
  console.log(`[Мэдэгдэл → ${target}] ${notification.message}`);

  // TODO: Telegram — админд:
  //   await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
  //     method: "POST", headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID, text: notification.message }),
  //   });
  // TODO: Имэйл — хэрэглэгчид (Resend г.м.): Clerk-ээс userId-ийн имэйлийг аваад илгээнэ.
}

async function store(notification: Omit<AppNotification, "id" | "createdAt" | "read">) {
  const saved: AppNotification = { ...notification, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false };
  await updateDb((db) => {
    db.notifications.unshift(saved);
    db.notifications = db.notifications.slice(0, 500);
  });
  await deliver(saved).catch((error) => console.error("Мэдэгдэл илгээхэд алдаа", error));
}

export async function notifyAdmin({ message, href }: Message) {
  await store({ audience: "admin", message, href });
}

export async function notifyCustomer(userId: string, { message, href }: Message) {
  await store({ audience: "customer", userId, message, href });
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
