import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { adminAuthBypassed, isAdminClaims } from "@/server/admin-access";

// Сайтыг хэн ч нэвтрэлгүй үзнэ. Зөвхөн захиалга, хувийн хуудас, админд нэвтрэлт шаардана.
const isProtectedRoute = createRouteMatcher(["/checkout(.*)", "/account(.*)", "/admin(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request) && adminAuthBypassed()) return;
  if (!isProtectedRoute(request)) return;
  const { sessionClaims } = await auth.protect();

  // Админ: session token-ий metadata.role === "admin". Хуудас, action бүр дахин шалгана.
  if (isAdminRoute(request) && !isAdminClaims(sessionClaims)) return NextResponse.redirect(new URL("/", request.url));
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
