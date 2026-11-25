import "server-only";

import { readDb } from "@/server/mock/db";
import type { Purchase } from "@/types/purchases";

// Сургалт, схемийн худалдан авалт. Одоогоор mock сан (серверт), дараа нь Supabase-ийн purchases хүснэгт рүү солино.
// Эрхийг зөвхөн сервер шалгана — client руу видео линк, PDF зам дамжихгүй.

async function purchasedIds(userId: string | null, kind: Purchase["kind"]) {
  if (!userId) return [];
  return (await readDb()).purchases.filter((item) => item.userId === userId && item.kind === kind).map((item) => item.itemId);
}

export const getPurchasedCourseIds = (userId: string | null) => purchasedIds(userId, "course");
export const getPurchasedPatternIds = (userId: string | null) => purchasedIds(userId, "pattern");

export async function hasAccess(userId: string | null, courseId: string) {
  return (await getPurchasedCourseIds(userId)).includes(courseId);
}

export async function hasPatternAccess(userId: string | null, patternId: string) {
  return (await getPurchasedPatternIds(userId)).includes(patternId);
}

export async function getAllPurchases(): Promise<Purchase[]> {
  return (await readDb()).purchases;
}
