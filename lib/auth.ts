import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import { isAdminUser } from "@/lib/admin-access";

export async function getAdminUser() {
  const user = await currentUser();
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
