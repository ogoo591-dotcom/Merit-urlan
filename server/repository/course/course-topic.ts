import "server-only";

import { asc, eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdCourseTopic } from "@/server/db/schema";

// md_course_topic
export type CourseTopic = typeof mdCourseTopic.$inferSelect;
export type NewCourseTopic = typeof mdCourseTopic.$inferInsert;

export async function insertCourseTopics(rows: NewCourseTopic[], db: DbExecutor = getDb()): Promise<CourseTopic[]> {
  if (rows.length === 0) return [];
  return db.insert(mdCourseTopic).values(rows).returning();
}

export function listCourseTopicsByCourseIds(ids: string[], db: DbExecutor = getDb()): Promise<CourseTopic[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(mdCourseTopic).where(inArray(mdCourseTopic.courseId, ids)).orderBy(asc(mdCourseTopic.createdAt));
}

export async function deleteCourseTopicsByCourse(courseId: string, db: DbExecutor = getDb()): Promise<void> {
  await db.delete(mdCourseTopic).where(eq(mdCourseTopic.courseId, courseId));
}
