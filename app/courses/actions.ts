"use server";

import { auth } from "@clerk/nextjs/server";

import type { PurchaseResult } from "@/components/purchase-button";
import { getCourse } from "@/lib/data/courses";
import { hasAccess, recordPurchase } from "@/lib/data/purchases";
import { formatPrice } from "@/lib/format";
import { wait } from "@/lib/mock/store";
import { notifyAdmin } from "@/lib/notify";

// Mock QPay: сервер талд 2 секунд "төлбөр шалгаад" амжилттай гэж тооцно.
// Жинхэнэ QPay холбоход энд invoice-ийн төлөвийг QPay API-аас шалгаж байж худалдан авалтыг бүртгэнэ.
export async function purchaseCourse(courseId: string): Promise<PurchaseResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Сургалт авахын тулд нэвтэрнэ үү." };

  const course = await getCourse(courseId);
  if (!course) return { ok: false, error: "Сургалт олдсонгүй." };
  if (await hasAccess(userId, courseId)) return { ok: true };

  await wait(2000);
  await recordPurchase({
    kind: "course",
    itemId: courseId,
    userId,
    price: course.price,
    transactionId: `TX-MOCK-${Date.now().toString(36).toUpperCase()}`,
  });
  await notifyAdmin({ message: `Сургалт зарагдлаа: ${course.title} — ${formatPrice(course.price)}`, href: "/admin/courses" });
  return { ok: true };
}
