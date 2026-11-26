import "server-only";

import { and, asc, eq, inArray, notInArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdLesson } from "@/server/db/schema";

// md_lesson
export type Lesson = typeof mdLesson.$inferSelect;
export type NewLesson = typeof mdLesson.$inferInsert;

export async function insertLessons(rows: NewLesson[], db: DbExecutor = getDb()): Promise<Lesson[]> {
  if (rows.length === 0) return [];
  return db.insert(mdLesson).values(rows).returning();
}

export function listLessonsByCourseIds(ids: string[], db: DbExecutor = getDb()): Promise<Lesson[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db
    .select()
    .from(mdLesson)
    .where(and(inArray(mdLesson.courseId, ids), eq(mdLesson.isActive, true)))
    .orderBy(asc(mdLesson.position));
}

export async function findLesson(courseId: string, lessonId: string, db: DbExecutor = getDb()): Promise<Lesson | null> {
  const [row] = await db
    .select()
    .from(mdLesson)
    .where(and(eq(mdLesson.courseId, courseId), eq(mdLesson.id, lessonId), eq(mdLesson.isActive, true)));
  return row ?? null;
}

export async function updateLesson(id: string, values: Partial<NewLesson>, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdLesson).set(values).where(eq(mdLesson.id, id));
}

// keepIds-д ороогүй хичээлүүдийг устгана.
export async function deleteLessonsExcept(courseId: string, keepIds: string[], db: DbExecutor = getDb()): Promise<void> {
  await db
    .delete(mdLesson)
    .where(and(eq(mdLesson.courseId, courseId), keepIds.length ? notInArray(mdLesson.id, keepIds) : undefined));
}
