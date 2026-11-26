"use server";

import { redirect } from "next/navigation";

import { runAdminAction, runAdminForm } from "@/server/shared/admin-action";
import { lines, money, slugify, text } from "@/server/shared/form";
import { uploadImages } from "@/server/shared/upload";
import { deleteCourse, saveCourse } from "@/server/services/courses/service";
import { getCourseForAdmin } from "@/server/services/courses/queries";
import type { Course, CourseLevel } from "@/types/courses";
import type { FormState } from "@/types/forms";

function isVideoUrl(value: string) {
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function parseLessons(raw: string): Course["lessons"] | null {
  try {
    return (JSON.parse(raw) as Array<Record<string, unknown>>).map((lesson, index) => ({
      id: String(lesson.id || `l${Date.now().toString(36)}${index}`).slice(0, 40),
      title: String(lesson.title ?? "").trim().slice(0, 160),
      duration: String(lesson.duration ?? "").trim().slice(0, 30),
      videoUrl: String(lesson.videoUrl ?? "").trim().slice(0, 500),
      isFree: Boolean(lesson.isFree),
    }));
  } catch {
    return null;
  }
}

export async function saveCourseAction(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await runAdminForm(async () => {
    const originalId = text(formData, "originalId", 100) || undefined;
    const id = originalId ?? slugify(text(formData, "id", 60), "course");
    const title = text(formData, "title", 120);
    const level = text(formData, "level") as CourseLevel;
    const price = money(formData, "price");

    if (!title) return "Сургалтын нэрийг оруулна уу.";
    if (!["beginner", "intermediate", "advanced"].includes(level)) return "Түвшин буруу байна.";
    if (!Number.isFinite(price) || price < 0) return "Үнэ буруу байна.";

    const lessons = parseLessons(text(formData, "lessons", 100_000));
    if (!lessons) return "Хичээлийн мэдээлэл буруу байна.";
    if (!lessons.length) return "Дор хаяж нэг хичээл нэмнэ үү.";
    const invalid = lessons.findIndex((lesson) => !lesson.title || !isVideoUrl(lesson.videoUrl));
    if (invalid !== -1) return `${invalid + 1}-р хичээлийн нэр, видео линкийг (https://...) зөв оруулна уу.`;

    const [uploadedCover] = await uploadImages([formData.get("cover") ?? ""], "courses");
    const coverImage = uploadedCover ?? text(formData, "currentCover", 500);
    if (!coverImage) return "Нүүр зураг оруулна уу.";

    await saveCourse(
      {
        id,
        title,
        description: text(formData, "description", 2000),
        price,
        coverImage,
        // Нэмэлт зургийг админ форм засахгүй тул хуучнаараа үлдээнэ.
        images: originalId ? (await getCourseForAdmin(originalId))?.images : undefined,
        level,
        totalDuration: text(formData, "totalDuration", 40),
        topics: text(formData, "topics")
          .split(",")
          .map((topic) => topic.trim().toLowerCase())
          .filter(Boolean),
        outcomes: lines(text(formData, "outcomes", 4000)),
        lessons,
      },
      originalId,
    );
  });
  if (result) return result;
  redirect("/admin/courses?saved=1");
}

export async function deleteCourseAction(formData: FormData) {
  await runAdminAction(() => deleteCourse(String(formData.get("id"))), "/");
  redirect("/admin/courses?deleted=1");
}
