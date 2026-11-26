import "server-only";

import * as userCourseRepo from "@/server/repository/access/user-course";
import * as userPatternRepo from "@/server/repository/access/user-pattern";
import type { Purchase } from "@/types/purchases";

// Сургалт, схем үзэх эрх (rl_user_course, rl_user_pattern).
// Эрхийг зөвхөн сервер шалгана — client руу видео линк, PDF зам дамжихгүй.

export async function getPurchasedCourseIds(userId: string | null): Promise<string[]> {
  if (!userId) return [];
  return (await userCourseRepo.listUserCourses({ userId })).map((row) => row.courseId);
}

export async function getPurchasedPatternIds(userId: string | null): Promise<string[]> {
  if (!userId) return [];
  return (await userPatternRepo.listUserPatterns({ userId })).map((row) => row.patternId);
}

export async function hasAccess(userId: string | null, courseId: string) {
  return userId ? userCourseRepo.hasUserCourse(userId, courseId) : false;
}

export async function hasPatternAccess(userId: string | null, patternId: string) {
  return userId ? userPatternRepo.hasUserPattern(userId, patternId) : false;
}

// Админы тайлан (борлуулалтын тоо, сарын орлого).
export async function getAllPurchases(): Promise<Purchase[]> {
  const [courses, patterns] = await Promise.all([userCourseRepo.listUserCourses(), userPatternRepo.listUserPatterns()]);
  const toPurchase = (kind: Purchase["kind"], itemId: string, row: (typeof courses)[number] | (typeof patterns)[number]): Purchase => ({
    id: `${kind}:${row.userId}:${itemId}`,
    kind,
    itemId,
    userId: row.userId,
    price: row.price,
    transactionId: row.paymentId ?? "",
    createdAt: row.createdAt.toISOString(),
  });
  return [
    ...courses.map((row) => toPurchase("course", row.courseId, row)),
    ...patterns.map((row) => toPurchase("pattern", row.patternId, row)),
  ];
}
