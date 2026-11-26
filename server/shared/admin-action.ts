import "server-only";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/server/auth";
import { errorMessage } from "@/server/shared/form";
import type { FormState } from "@/types/forms";

// Админы маягтын action: эрх шалгаж, алдааг FormState болгож, амжилттай бол cache шинэчилнэ.
// handler нь алдааны текст (string) буцаавал маягтад харуулна; redirect хийх бол handler-ийн дараа дуудна.
export async function runAdminForm(
  handler: () => Promise<string | void>,
  options: { revalidate?: string; fallbackError?: string } = {},
): Promise<FormState | null> {
  await requireAdmin();
  try {
    const error = await handler();
    if (error) return { error };
  } catch (error) {
    return { error: errorMessage(error, options.fallbackError ?? "Хадгалахад алдаа гарлаа.") };
  }
  revalidatePath(options.revalidate ?? "/", "layout");
  return null;
}

// Энгийн админ товч (статус солих, устгах г.м.): эрх шалгаад үйлдэл хийж cache шинэчилнэ.
// handler-т админы Clerk id (dev bypass үед null) ирнэ — хэн өөрчилснийг тэмдэглэхэд.
export async function runAdminAction(handler: (adminId: string | null) => Promise<unknown>, revalidate = "/admin") {
  const admin = await requireAdmin();
  await handler(admin.id ?? null);
  revalidatePath(revalidate, "layout");
}
