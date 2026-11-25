"use server";

import { auth } from "@clerk/nextjs/server";

import type { PurchaseResult } from "@/components/purchase-button";
import { createPayment, hasPendingPayment, isValidPaymentCode } from "@/lib/data/payments";
import { getPattern } from "@/lib/data/patterns";
import { hasPatternAccess } from "@/server/modules/purchases/queries";

// "Төлбөр шилжүүлсэн" дарахад: хүлээгдэж буй төлбөр үүсгэж админд мэдэгдэнэ.
// Админ баталгаажуулмагц схем нээгдэнэ (lib/data/payments.ts → approvePayment).
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
