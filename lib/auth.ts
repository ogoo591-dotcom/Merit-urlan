import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import { getSupabase } from "@/lib/supabase";

// Админ эрхийг Clerk Dashboard → Users → хэрэглэгч → Metadata → Public metadata
// хэсэгт {"role": "admin"} гэж бичиж олгоно.
export async function getAdminUser() {
  const user = await currentUser();
  return user?.publicMetadata?.role === "admin" ? user : null;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("FORBIDDEN");
  return user;
}

// Админ хуудас, action бүр сангийн клиентийг заавал үүгээр авна.
export async function getAdminSupabase() {
  await requireAdmin();
  return getSupabase();
}

export async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHENTICATED");
  return userId;
}
