import "server-only";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdUser } from "@/server/db/schema";

// md_user
export type User = typeof mdUser.$inferSelect;
export type NewUser = typeof mdUser.$inferInsert;

// Clerk-ээс ирсэн мэдээллээр нэмэх эсвэл шинэчлэх.
export async function upsertUser(row: NewUser, db: DbExecutor = getDb()): Promise<void> {
  // undefined талбарыг drizzle алгасдаг — Clerk-ийн мэдээлэлгүй үед хуучин утга хэвээр үлдэнэ.
  const set = { email: row.email, name: row.name, phone: row.phone, imageUrl: row.imageUrl, deletedAt: null };
  await db.insert(mdUser).values(row).onConflictDoUpdate({ target: mdUser.id, set });
}
