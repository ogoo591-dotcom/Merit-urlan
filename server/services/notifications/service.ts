import "server-only";

import * as notificationRepo from "@/server/repository/notification/notification";
import type { DbExecutor } from "@/server/repository/transaction";
import { toAppNotification } from "@/server/services/notifications/queries";
import type { AppNotification } from "@/types/notifications";

// Мэдэгдэл илгээх цэг. Одоогоор: сайт доторх мэдэгдэл (md_notification) + console.log.
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

async function store(row: notificationRepo.NewNotification, db?: DbExecutor) {
  const saved = toAppNotification(await notificationRepo.insertNotification(row, db));
  await deliver(saved).catch((error) => console.error("Мэдэгдэл илгээхэд алдаа", error));
}

export async function notifyAdmin({ message, href }: Message, db?: DbExecutor) {
  await store({ audience: "admin", message, href }, db);
}

export async function notifyCustomer(userId: string, { message, href }: Message, db?: DbExecutor) {
  await store({ audience: "customer", userId, message, href }, db);
}

export async function markRead(audience: notificationRepo.Audience, ids?: string[]) {
  await notificationRepo.markNotificationsRead(audience, ids);
}

export async function setNotificationRead(id: string, read: boolean) {
  await notificationRepo.setNotificationReadAt(id, read ? new Date() : null);
}
