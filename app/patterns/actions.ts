"use server";

import { auth } from "@clerk/nextjs/server";

import type { PurchaseResult } from "@/components/purchase-button";
import { getPattern } from "@/lib/data/patterns";
import { hasPatternAccess, recordPurchase } from "@/lib/data/purchases";
import { formatPrice } from "@/lib/format";
import { wait } from "@/lib/mock/store";
import { notifyAdmin } from "@/lib/notify";

// Mock QPay: сервер талд 2 секунд "төлбөр шалгаад" амжилттай гэж тооцно.
// Жинхэнэ QPay холбоход энд invoice-ийн төлөвийг QPay API-аас шалгаж байж худалдан авалтыг бүртгэнэ.
export async function purchasePattern(patternId: string): Promise<PurchaseResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Схем авахын тулд нэвтэрнэ үү." };

  const pattern = await getPattern(patternId);
  if (!pattern) return { ok: false, error: "Схем олдсонгүй." };
  if (await hasPatternAccess(userId, patternId)) return { ok: true };

  await wait(2000);
  await recordPurchase({
    kind: "pattern",
    itemId: patternId,
    userId,
    price: pattern.price,
    transactionId: `TX-MOCK-${Date.now().toString(36).toUpperCase()}`,
  });
  await notifyAdmin({ message: `Схем зарагдлаа: ${pattern.name} — ${formatPrice(pattern.price)}`, href: "/admin/patterns" });
  return { ok: true };
}
