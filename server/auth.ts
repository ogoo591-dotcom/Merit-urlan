import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import { adminAuthBypassed, isAdminUser } from "@/server/admin-access";

type AdminUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

// ТҮР: bypass үед нэвтрээгүй ч админ layout ажиллах орлуулагч хэрэглэгч.
const devAdmin = { fullName: "Dev админ", primaryEmailAddress: null } as unknown as AdminUser;

export async function getAdminUser() {
  const user = await currentUser();
  if (adminAuthBypassed()) return user ?? devAdmin;
  return isAdminUser(user) ? user : null;
}

// Админы бүх хуудас, server action бүрийн эхэнд дуудна (middleware-ээс гадна давхар хамгаалалт).
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("FORBIDDEN");
  return user;
}

export async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHENTICATED");
  return userId;
}
