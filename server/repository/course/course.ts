import "server-only";

import { and, asc, eq, isNull } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdCourse } from "@/server/db/schema";

// md_course
export type Course = typeof mdCourse.$inferSelect;
export type NewCourse = typeof mdCourse.$inferInsert;

const visible = and(isNull(mdCourse.deletedAt), eq(mdCourse.isActive, true));

export async function insertCourses(rows: NewCourse[], db: DbExecutor = getDb()): Promise<Course[]> {
  if (rows.length === 0) return [];
  return db.insert(mdCourse).values(rows).returning();
}

export function listCourses(db: DbExecutor = getDb()): Promise<Course[]> {
  return db.select().from(mdCourse).where(visible).orderBy(asc(mdCourse.createdAt), asc(mdCourse.id));
}

export async function findCourse(id: string, db: DbExecutor = getDb()): Promise<Course | null> {
  const [row] = await db.select().from(mdCourse).where(and(eq(mdCourse.id, id), visible));
  return row ?? null;
}

export async function courseIdExists(id: string, db: DbExecutor = getDb()): Promise<boolean> {
  return (await db.$count(mdCourse, eq(mdCourse.id, id))) > 0;
}

export async function updateCourse(id: string, values: Partial<NewCourse>, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdCourse).set(values).where(eq(mdCourse.id, id));
}

export async function softDeleteCourse(id: string, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdCourse).set({ deletedAt: new Date() }).where(eq(mdCourse.id, id));
}
