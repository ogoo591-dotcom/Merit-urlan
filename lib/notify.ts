import "server-only";

import { updateDb, type DbNotification } from "@/lib/mock/db";

// Мэдэгдэл илгээх цэг. Одоогоор: сайт доторх мэдэгдэл (mock сан) + console.log.
// Telegram bot эсвэл имэйл нэмэхдээ доорх deliver() функцын дотор бичнэ — дуудаж буй газруудыг өөрчлөх шаардлагагүй.

type Message = { message: string; href?: string };

async function deliver(notification: DbNotification) {
  const target = notification.audience === "admin" ? "Админд" : `Хэрэглэгчид (${notification.userId})`;
  console.log(`[Мэдэгдэл → ${target}] ${notification.message}`);

  // TODO: Telegram — админд:
  //   await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
  //     method: "POST", headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID, text: notification.message }),
  //   });
  // TODO: Имэйл — хэрэглэгчид (Resend г.м.): Clerk-ээс userId-ийн имэйлийг аваад илгээнэ.
}

async function store(notification: Omit<DbNotification, "id" | "createdAt" | "read">) {
  const saved: DbNotification = { ...notification, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false };
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
