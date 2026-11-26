import "server-only";

import { asc, eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdCourseImage } from "@/server/db/schema";

// md_course_image
export type CourseImage = typeof mdCourseImage.$inferSelect;
export type NewCourseImage = typeof mdCourseImage.$inferInsert;

export async function insertCourseImages(rows: NewCourseImage[], db: DbExecutor = getDb()): Promise<CourseImage[]> {
  if (rows.length === 0) return [];
  return db.insert(mdCourseImage).values(rows).returning();
}

export function listCourseImagesByCourseIds(ids: string[], db: DbExecutor = getDb()): Promise<CourseImage[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(mdCourseImage).where(inArray(mdCourseImage.courseId, ids)).orderBy(asc(mdCourseImage.position));
}

export async function deleteCourseImagesByCourse(courseId: string, db: DbExecutor = getDb()): Promise<void> {
  await db.delete(mdCourseImage).where(eq(mdCourseImage.courseId, courseId));
}
