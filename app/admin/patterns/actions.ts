"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { deletePattern, getPatternForAdmin, savePattern } from "@/lib/data/patterns";
import { saveImageUpload, savePatternPdf } from "@/lib/data/uploads";
import type { PatternLevel, PatternType } from "@/lib/mock/patterns";

export type FormState = { error?: string };

const text = (formData: FormData, name: string, max = 300) => String(formData.get(name) ?? "").trim().slice(0, max);

export async function savePatternAction(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const originalId = text(formData, "originalId", 100) || undefined;
  const id =
    originalId ??
    (text(formData, "id", 60)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
      `pattern-${Date.now().toString(36)}`);
  const existing = originalId ? await getPatternForAdmin(originalId) : null;
  const name = text(formData, "name", 120);
  const type = text(formData, "type") as PatternType;
  const level = text(formData, "level") as PatternLevel;
  const price = Math.round(Number(formData.get("price")));
  const pages = Math.floor(Number(formData.get("pages")));

  if (!name) return { error: "Схемийн нэрийг оруулна уу." };
  if (!["toy", "clothes", "home", "accessory"].includes(type)) return { error: "Төрөл буруу байна." };
  if (!["beginner", "intermediate", "advanced"].includes(level)) return { error: "Түвшин буруу байна." };
  if (!Number.isFinite(price) || price < 0) return { error: "Үнэ буруу байна." };

  // "Нэр | material-id" мөр бүрт.
  const materials = text(formData, "materials", 4000)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [materialName, materialId] = line.split("|").map((part) => part.trim());
      return materialId ? { name: materialName, materialId } : { name: materialName };
    });

  let coverImage = existing?.coverImage ?? "";
  let previews = formData.getAll("keepPreviews").map(String);
  let pdfPath = existing?.pdfPath ?? "";
  try {
    const cover = formData.get("cover");
    if (cover instanceof File && cover.size > 0) coverImage = await saveImageUpload(cover);
    for (const file of formData.getAll("previews")) {
      if (file instanceof File && file.size > 0) previews.push(await saveImageUpload(file));
    }
    const pdf = formData.get("pdf");
    if (pdf instanceof File && pdf.size > 0) pdfPath = await savePatternPdf(id, pdf);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Файл хадгалахад алдаа гарлаа." };
  }
  previews = previews.slice(0, 4);
  if (!coverImage) return { error: "Нүүр зураг оруулна уу." };
  if (!pdfPath) return { error: "Схемийн PDF файлыг оруулна уу." };

  try {
    await savePattern(
      {
        id,
        name,
        description: text(formData, "description", 2000),
        price,
        coverImage,
        previews,
        type,
        level,
        materials,
        size: text(formData, "size", 80),
        sourceLanguage: text(formData, "sourceLanguage", 40) || "Англи",
        pages: Number.isInteger(pages) && pages > 0 ? pages : 1,
        createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
        pdfPath,
      },
      originalId,
    );
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Хадгалахад алдаа гарлаа." };
  }
  revalidatePath("/", "layout");
  redirect("/admin/patterns?saved=1");
}

export async function deletePatternAction(formData: FormData) {
  await requireAdmin();
  await deletePattern(String(formData.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin/patterns?deleted=1");
}
