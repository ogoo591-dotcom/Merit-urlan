"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { deleteCourse, saveCourse } from "@/lib/data/courses";
import { saveImageUpload } from "@/lib/data/uploads";
import type { DbCourse } from "@/lib/mock/db";
import type { CourseLevel } from "@/lib/mock/courses";

export type FormState = { error?: string };

const text = (formData: FormData, name: string, max = 300) => String(formData.get(name) ?? "").trim().slice(0, max);
const lines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function isVideoUrl(value: string) {
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export async function saveCourseAction(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const originalId = text(formData, "originalId", 100) || undefined;
  const id =
    originalId ??
    (text(formData, "id", 60)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
      `course-${Date.now().toString(36)}`);
  const title = text(formData, "title", 120);
  const level = text(formData, "level") as CourseLevel;
  const price = Math.round(Number(formData.get("price")));

  if (!title) return { error: "Сургалтын нэрийг оруулна уу." };
  if (!["beginner", "intermediate", "advanced"].includes(level)) return { error: "Түвшин буруу байна." };
  if (!Number.isFinite(price) || price < 0) return { error: "Үнэ буруу байна." };

  let lessons: DbCourse["lessons"];
  try {
    const raw = JSON.parse(text(formData, "lessons", 100_000)) as Array<Record<string, unknown>>;
    lessons = raw.map((lesson, index) => ({
      id: String(lesson.id || `l${Date.now().toString(36)}${index}`).slice(0, 40),
      title: String(lesson.title ?? "").trim().slice(0, 160),
      duration: String(lesson.duration ?? "").trim().slice(0, 30),
      videoUrl: String(lesson.videoUrl ?? "").trim().slice(0, 500),
      isFree: Boolean(lesson.isFree),
    }));
  } catch {
    return { error: "Хичээлийн мэдээлэл буруу байна." };
  }
  if (!lessons.length) return { error: "Дор хаяж нэг хичээл нэмнэ үү." };
  const invalid = lessons.findIndex((lesson) => !lesson.title || !isVideoUrl(lesson.videoUrl));
  if (invalid !== -1) return { error: `${invalid + 1}-р хичээлийн нэр, видео линкийг (https://...) зөв оруулна уу.` };

  let coverImage = text(formData, "currentCover", 500);
  const cover = formData.get("cover");
  try {
    if (cover instanceof File && cover.size > 0) coverImage = await saveImageUpload(cover);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Зураг хадгалахад алдаа гарлаа." };
  }
  if (!coverImage) return { error: "Нүүр зураг оруулна уу." };

  try {
    await saveCourse(
      {
        id,
        title,
        description: text(formData, "description", 2000),
        price,
        coverImage,
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
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Хадгалахад алдаа гарлаа." };
  }
  revalidatePath("/", "layout");
  redirect("/admin/courses?saved=1");
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  await deleteCourse(String(formData.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin/courses?deleted=1");
}
