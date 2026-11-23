"use server";

import { auth } from "@clerk/nextjs/server";

import type { PurchaseResult } from "@/components/purchase-button";
import { getCourse } from "@/lib/data/courses";
import { createPayment, hasPendingPayment, isValidPaymentCode } from "@/lib/data/payments";
import { hasAccess } from "@/lib/data/purchases";

// "Төлбөр шилжүүлсэн" дарахад: хүлээгдэж буй төлбөр үүсгэж админд мэдэгдэнэ.
// Админ баталгаажуулмагц сургалт нээгдэнэ (lib/data/payments.ts → approvePayment).
export async function purchaseCourse(courseId: string, code: string): Promise<PurchaseResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Сургалт авахын тулд нэвтэрнэ үү." };
  if (!isValidPaymentCode(code)) return { ok: false, error: "Гүйлгээний утга буруу байна. Цонхыг хаагаад дахин оролдоно уу." };

  const course = await getCourse(courseId);
  if (!course) return { ok: false, error: "Сургалт олдсонгүй." };
  if (await hasAccess(userId, courseId)) return { ok: true };
  if (await hasPendingPayment(userId, "course", courseId)) return { ok: true, pending: true };

  try {
    await createPayment({ code, userId, amount: course.price, courseIds: [courseId], patternIds: [], summary: `Сургалт: ${course.title}` });
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Төлбөр бүртгэхэд алдаа гарлаа." };
  }
  return { ok: true, pending: true };
}
