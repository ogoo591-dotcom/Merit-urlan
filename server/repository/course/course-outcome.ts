import "server-only";

import { asc, eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdCourseOutcome } from "@/server/db/schema";

// md_course_outcome
export type CourseOutcome = typeof mdCourseOutcome.$inferSelect;
export type NewCourseOutcome = typeof mdCourseOutcome.$inferInsert;

export async function insertCourseOutcomes(rows: NewCourseOutcome[], db: DbExecutor = getDb()): Promise<CourseOutcome[]> {
  if (rows.length === 0) return [];
  return db.insert(mdCourseOutcome).values(rows).returning();
}

export function listCourseOutcomesByCourseIds(ids: string[], db: DbExecutor = getDb()): Promise<CourseOutcome[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(mdCourseOutcome).where(inArray(mdCourseOutcome.courseId, ids)).orderBy(asc(mdCourseOutcome.position));
}

export async function deleteCourseOutcomesByCourse(courseId: string, db: DbExecutor = getDb()): Promise<void> {
  await db.delete(mdCourseOutcome).where(eq(mdCourseOutcome.courseId, courseId));
}
