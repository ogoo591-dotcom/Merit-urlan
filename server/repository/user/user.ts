import "server-only";

import { eq } from "drizzle-orm";

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

// Clerk-ээс устгагдсан: захиалга, төлбөр холбоотой тул мөр үлдэнэ. Имэйлийг чөлөөлж ижил gmail-ээр дахин бүртгүүлэх боломжтой болгоно.
export async function softDeleteUser(id: string, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdUser).set({ deletedAt: new Date(), email: null }).where(eq(mdUser.id, id));
}
