import "server-only";

import { eq } from "drizzle-orm";

import { getDb, type DbExecutor } from "@/server/db/client";
import { mdUser } from "@/server/db/schema";

// md_user
export type User = typeof mdUser.$inferSelect;
export type NewUser = typeof mdUser.$inferInsert;

// Clerk-ээс ирсэн мэдээллээр нэмэх эсвэл шинэчлэх. is_active-ийг хөндөхгүй (админы шийдвэр).
export async function upsertUser(row: Omit<NewUser, "isActive">, db: DbExecutor = getDb()): Promise<User> {
  const set = { email: row.email, name: row.name, imageUrl: row.imageUrl, deletedAt: null };
  const [user] = await db.insert(mdUser).values(row).onConflictDoUpdate({ target: mdUser.id, set }).returning();
  return user;
}

export async function setUserActive(id: string, isActive: boolean, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdUser).set({ isActive }).where(eq(mdUser.id, id));
}

// Clerk-ээс устгагдсан: захиалга, төлбөр холбоотой тул мөр үлдэнэ.
export async function softDeleteUser(id: string, db: DbExecutor = getDb()): Promise<void> {
  await db.update(mdUser).set({ deletedAt: new Date() }).where(eq(mdUser.id, id));
}
