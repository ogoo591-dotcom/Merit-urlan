import "server-only";

import { asc, eq, inArray } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdPatternMaterial } from "@/server/db/schema";

// md_pattern_material
export type PatternMaterial = typeof mdPatternMaterial.$inferSelect;
export type NewPatternMaterial = typeof mdPatternMaterial.$inferInsert;

export async function insertPatternMaterials(rows: NewPatternMaterial[], db: DbExecutor = getDb()): Promise<PatternMaterial[]> {
  if (rows.length === 0) return [];
  return db.insert(mdPatternMaterial).values(rows).returning();
}

export function listMaterialsByPatternIds(ids: string[], db: DbExecutor = getDb()): Promise<PatternMaterial[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return db
    .select()
    .from(mdPatternMaterial)
    .where(inArray(mdPatternMaterial.patternId, ids))
    .orderBy(asc(mdPatternMaterial.position));
}

export async function deleteMaterialsByPattern(patternId: string, db: DbExecutor = getDb()): Promise<void> {
  await db.delete(mdPatternMaterial).where(eq(mdPatternMaterial.patternId, patternId));
}
