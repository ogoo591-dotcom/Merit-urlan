import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { isAdminUser } from "@/lib/admin-access";

// Сайтыг хэн ч нэвтрэлгүй үзнэ. Зөвхөн захиалга, хувийн хуудас, админд нэвтрэлт шаардана.
const isProtectedRoute = createRouteMatcher(["/checkout(.*)", "/account(.*)", "/admin(.*)", "/courses/enroll(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isProtectedRoute(request)) return;
  const { userId } = await auth.protect();

  // Админ: publicMetadata.role === "admin" эсвэл ADMIN_EMAILS. Хуудас, action бүр дахин шалгана.
  if (isAdminRoute(request)) {
    const user = await (await clerkClient()).users.getUser(userId);
    if (!isAdminUser(user)) return NextResponse.redirect(new URL("/", request.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
