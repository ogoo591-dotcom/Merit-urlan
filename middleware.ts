import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Сайтыг хэн ч нэвтрэлгүй үзнэ. Зөвхөн захиалга, хувийн хуудас, админд нэвтрэлт шаардана.
const isProtectedRoute = createRouteMatcher(["/checkout(.*)", "/account(.*)", "/admin(.*)", "/courses/enroll(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
