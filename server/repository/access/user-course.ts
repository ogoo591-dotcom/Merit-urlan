import "server-only";

import { and, eq } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { rlUserCourse } from "@/server/db/schema";

// rl_user_course
export type UserCourse = typeof rlUserCourse.$inferSelect;
export type NewUserCourse = typeof rlUserCourse.$inferInsert;

// Аль хэдийн эрхтэй бол алгасна.
export async function grantUserCourses(rows: NewUserCourse[], db: DbExecutor = getDb()): Promise<void> {
  if (rows.length === 0) return;
  await db.insert(rlUserCourse).values(rows).onConflictDoNothing();
}

export function listUserCourses(filter: { userId?: string } = {}, db: DbExecutor = getDb()): Promise<UserCourse[]> {
  return db
    .select()
    .from(rlUserCourse)
    .where(filter.userId ? eq(rlUserCourse.userId, filter.userId) : undefined);
}

export async function hasUserCourse(userId: string, courseId: string, db: DbExecutor = getDb()): Promise<boolean> {
  return (await db.$count(rlUserCourse, and(eq(rlUserCourse.userId, userId), eq(rlUserCourse.courseId, courseId)))) > 0;
}
