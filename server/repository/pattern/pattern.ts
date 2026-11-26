import "server-only";

import { and, asc, eq, isNull } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdPattern } from "@/server/db/schema";

// md_pattern
export type Pattern = typeof mdPattern.$inferSelect;
export type NewPattern = typeof mdPattern.$inferInsert;

const visible = and(isNull(mdPattern.deletedAt), eq(mdPattern.isActive, true));

export async function insertPatterns(rows: NewPattern[], db: DbExecutor = getDb()): Promise<Pattern[]> {
  if (rows.length === 0) return [];
  return db.insert(mdPattern).values(rows).returning();
}

export function listPatterns(db: DbExecutor = getDb()): Promise<Pattern[]> {
  return db.select().from(mdPattern).where(visible).orderBy(asc(mdPattern.createdAt), asc(mdPattern.id));
}

export async function findPattern(id: string, db: DbExecutor = getDb()): Promise<Pattern | null> {
  const [row] = await db.select().from(mdPattern).where(and(eq(mdPattern.id, id), visible));
  return row ?? null;
}

export async function patternIdExists(id: string, db: DbExecutor = getDb()): Promise<boolean> {
  return (await db.$count(mdPattern, eq(mdPattern.id, id))) > 0;
}

export async function updatePattern(id: string, values: Partial<NewPattern>, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdPattern).set(values).where(eq(mdPattern.id, id));
}

export async function softDeletePattern(id: string, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdPattern).set({ deletedAt: new Date() }).where(eq(mdPattern.id, id));
}
