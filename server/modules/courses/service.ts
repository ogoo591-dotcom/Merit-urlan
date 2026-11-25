import "server-only";

import { updateDb } from "@/server/mock/db";
import type { Course } from "@/types/courses";

// Сургалт засах (админ).

export async function saveCourse(course: Course, originalId?: string) {
  await updateDb((db) => {
    const index = db.courses.findIndex((item) => item.id === (originalId ?? course.id));
    const clash = db.courses.some((item, itemIndex) => item.id === course.id && itemIndex !== index);
    if (clash) throw new Error("Энэ ID-тай сургалт аль хэдийн байна.");
    if (index === -1) db.courses.push(course);
    else db.courses[index] = course;
  });
}

export async function deleteCourse(id: string) {
  await updateDb((db) => {
    db.courses = db.courses.filter((item) => item.id !== id);
  });
}
