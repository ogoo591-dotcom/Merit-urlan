import "server-only";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdColor } from "@/server/db/schema";

// md_color
export type Color = typeof mdColor.$inferSelect;
export type NewColor = typeof mdColor.$inferInsert;

export async function insertColors(rows: NewColor[], db: DbExecutor = getDb()): Promise<Color[]> {
  if (rows.length === 0) return [];
  return db.insert(mdColor).values(rows).returning();
}
