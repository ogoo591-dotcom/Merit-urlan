"use server";

import { auth } from "@clerk/nextjs/server";

import { getCourse } from "@/server/modules/courses/queries";
import { hasPendingPayment } from "@/server/modules/payments/queries";
import { createPayment, isValidPaymentCode } from "@/server/modules/payments/service";
import { getPattern } from "@/server/modules/patterns/queries";
import { hasAccess, hasPatternAccess } from "@/server/modules/purchases/queries";
import type { PurchaseResult } from "@/types/payments";

// "Төлбөр шилжүүлсэн" дарахад: хүлээгдэж буй төлбөр үүсгэж админд мэдэгдэнэ.
// Админ баталгаажуулмагц сургалт нээгдэнэ (service.ts → approvePayment).
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

// "Төлбөр шилжүүлсэн" дарахад: хүлээгдэж буй төлбөр үүсгэж админд мэдэгдэнэ.
// Админ баталгаажуулмагц схем нээгдэнэ (service.ts → approvePayment).
export async function purchasePattern(patternId: string, code: string): Promise<PurchaseResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Схем авахын тулд нэвтэрнэ үү." };
  if (!isValidPaymentCode(code)) return { ok: false, error: "Гүйлгээний утга буруу байна. Цонхыг хаагаад дахин оролдоно уу." };

  const pattern = await getPattern(patternId);
  if (!pattern) return { ok: false, error: "Схем олдсонгүй." };
  // Үнэгүй схемд төлбөр бүртгэхгүй: хэн ч шууд үзнэ.
  if (pattern.isFree || (await hasPatternAccess(userId, patternId))) return { ok: true };
  if (await hasPendingPayment(userId, "pattern", patternId)) return { ok: true, pending: true };

  try {
    await createPayment({ code, userId, amount: pattern.price, courseIds: [], patternIds: [patternId], summary: `Схем: ${pattern.name}` });
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Төлбөр бүртгэхэд алдаа гарлаа." };
  }
  return { ok: true, pending: true };
}
