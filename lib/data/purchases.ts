import "server-only";

import { readDb, updateDb, type DbPurchase } from "@/lib/mock/db";

// Сургалт, схемийн худалдан авалт. Одоогоор mock сан (серверт), дараа нь Supabase-ийн purchases хүснэгт рүү солино.
// Эрхийг зөвхөн сервер шалгана — client руу видео линк, PDF зам дамжихгүй.

export type { DbPurchase as Purchase } from "@/lib/mock/db";

async function purchasedIds(userId: string | null, kind: DbPurchase["kind"]) {
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

export async function recordPurchase(input: Omit<DbPurchase, "id" | "createdAt">) {
  await updateDb((db) => {
    if (db.purchases.some((item) => item.userId === input.userId && item.kind === input.kind && item.itemId === input.itemId)) return;
    db.purchases.push({ ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  });
}

export async function getAllPurchases(): Promise<DbPurchase[]> {
  return (await readDb()).purchases;
}
