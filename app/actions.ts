"use server";

import { notifyAdmin } from "@/server/modules/notifications/service";

// Client компонентууд lib/data-г шууд импортлохгүй (сервер талын сан) — эдгээр server action-оор дамжина.

export type FeedbackState = {
  sent?: boolean;
  error?: string;
  // Алдаа гарахад React маягтыг цэвэрлэдэг тул бичсэн утгыг буцааж харуулна.
  values?: { name: string; phone: string; interest: string; message: string };
};

// Нүүр хуудасны санал хүсэлтийн маягт: нэвтрэлт шаардахгүй, админы мэдэгдэл болж очно.
export async function sendFeedback(_state: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const field = (name: string, max: number) => String(formData.get(name) ?? "").trim().slice(0, max);
  // Honeypot бөглөгдсөн бол спам бот — амжилттай мэт хариулаад хадгалахгүй.
  if (field("website", 100)) return { sent: true };

  const values = {
    name: field("name", 80),
    phone: field("phone", 20),
    interest: field("interest", 120),
    message: field("message", 2000),
  };
  if (!values.name || !values.message) return { error: "Нэр, мессежээ бөглөнө үү.", values };
  if (!/^\+?[\d\s-]{8,}$/.test(values.phone)) return { error: "Утасны дугаараа зөв оруулна уу.", values };

  try {
    const interest = values.interest ? ` · Сонирхол: ${values.interest}` : "";
    await notifyAdmin({ message: `Санал хүсэлт: ${values.name} (${values.phone})${interest} — ${values.message}` });
  } catch (error) {
    console.error("Санал хүсэлт хадгалахад алдаа", error);
    return { error: "Илгээж чадсангүй. Дахин оролдох эсвэл Messenger-ээр бичнэ үү.", values };
  }
  return { sent: true };
}
