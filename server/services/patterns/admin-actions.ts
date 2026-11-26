"use server";

import { redirect } from "next/navigation";

import { runAdminAction, runAdminForm } from "@/server/shared/admin-action";
import { lines, money, slugify, text } from "@/server/shared/form";
import { uploadImages } from "@/server/shared/upload";
import { savePatternFile } from "@/server/storage/pattern-files";
import { deletePattern, savePattern } from "@/server/services/patterns/service";
import { getPatternForAdmin } from "@/server/services/patterns/queries";
import type { FormState } from "@/types/forms";
import type { PatternLevel, PatternType } from "@/types/patterns";

export async function savePatternAction(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await runAdminForm(
    async () => {
      const originalId = text(formData, "originalId", 100) || undefined;
      const id = originalId ?? slugify(text(formData, "id", 60), "pattern");
      const existing = originalId ? await getPatternForAdmin(originalId) : null;
      const name = text(formData, "name", 120);
      const type = text(formData, "type") as PatternType;
      const level = text(formData, "level") as PatternLevel;
      const price = money(formData, "price");

      if (!name) return "Схемийн нэрийг оруулна уу.";
      if (!["toy", "clothes", "home", "accessory"].includes(type)) return "Төрөл буруу байна.";
      if (!["beginner", "intermediate", "advanced"].includes(level)) return "Түвшин буруу байна.";
      if (!Number.isFinite(price) || price < 0) return "Үнэ буруу байна.";

      // "Нэр | material-id" мөр бүрт.
      const materials = lines(text(formData, "materials", 4000)).map((line) => {
        const [materialName, materialId] = line.split("|").map((part) => part.trim());
        return materialId ? { name: materialName, materialId } : { name: materialName };
      });

      const [uploadedCover] = await uploadImages([formData.get("cover") ?? ""], "patterns");
      const coverImage = uploadedCover ?? existing?.coverImage ?? "";
      const file = formData.get("file");
      const filePath = file instanceof File && file.size > 0 ? await savePatternFile(id, file) : (existing?.filePath ?? "");
      if (!coverImage) return "Нүүр зураг оруулна уу.";
      if (!filePath) return "Бүтэн схемийн файлыг оруулна уу.";

      const credit = text(formData, "credit", 80);
      await savePattern(
        {
          id,
          name,
          description: text(formData, "description", 2000),
          price,
          coverImage,
          type,
          level,
          materials,
          size: text(formData, "size", 80),
          sourceLanguage: text(formData, "sourceLanguage", 40) || "Англи",
          ...(credit ? { credit } : {}),
          createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
          filePath,
        },
        originalId,
      );
    },
    { fallbackError: "Файл хадгалахад алдаа гарлаа." },
  );
  if (result) return result;
  redirect("/admin/patterns?saved=1");
}

export async function deletePatternAction(formData: FormData) {
  await runAdminAction(() => deletePattern(String(formData.get("id"))), "/");
  redirect("/admin/patterns?deleted=1");
}
