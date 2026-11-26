import "server-only";

import { and, eq } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { rlUserPattern } from "@/server/db/schema";

// rl_user_pattern
export type UserPattern = typeof rlUserPattern.$inferSelect;
export type NewUserPattern = typeof rlUserPattern.$inferInsert;

// Аль хэдийн эрхтэй бол алгасна.
export async function grantUserPatterns(rows: NewUserPattern[], db: DbExecutor = getDb()): Promise<void> {
  if (rows.length === 0) return;
  await db.insert(rlUserPattern).values(rows).onConflictDoNothing();
}

export function listUserPatterns(filter: { userId?: string } = {}, db: DbExecutor = getDb()): Promise<UserPattern[]> {
  return db
    .select()
    .from(rlUserPattern)
    .where(filter.userId ? eq(rlUserPattern.userId, filter.userId) : undefined);
}

export async function hasUserPattern(userId: string, patternId: string, db: DbExecutor = getDb()): Promise<boolean> {
  return (await db.$count(rlUserPattern, and(eq(rlUserPattern.userId, userId), eq(rlUserPattern.patternId, patternId)))) > 0;
}
