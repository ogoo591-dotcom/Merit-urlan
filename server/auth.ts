import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import { adminAuthBypassed, isAdminClaims } from "@/server/admin-access";

type AdminUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

// ТҮР: bypass үед нэвтрээгүй ч админ layout ажиллах орлуулагч хэрэглэгч.
const devAdmin = { fullName: "Dev админ", primaryEmailAddress: null } as unknown as AdminUser;

// Session token-оос уншина (Clerk API дуудахгүй) — header, action бүрд хурдан.
export async function isAdmin() {
  if (adminAuthBypassed()) return true;
  const { sessionClaims } = await auth();
  return isAdminClaims(sessionClaims);
}

// Админ layout: нэр, зураг харуулахад Clerk-ийн хэрэглэгч хэрэгтэй.
export async function getAdminUser() {
  if (!(await isAdmin())) return null;
  const user = await currentUser();
  return user ?? (adminAuthBypassed() ? devAdmin : null);
}

// Админы бүх хуудас, server action бүрийн эхэнд дуудна (middleware-ээс гадна давхар хамгаалалт).
// id: хэн өөрчилснийг тэмдэглэхэд (dev bypass-д нэвтрээгүй бол null).
export async function requireAdmin(): Promise<{ id: string | null }> {
  const { userId } = await auth();
  if (!(await isAdmin())) throw new Error("FORBIDDEN");
  return { id: userId };
}

export async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHENTICATED");
  return userId;
}
