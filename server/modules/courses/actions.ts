"use server";

import { getCourses } from "@/server/modules/courses/queries";
import type { DrawerCourse } from "@/types/courses";

// "☰ Бүгд" drawer-ийн "Сургалт" хэсэг: бүх сургалтын товч мэдээлэл (видео линкгүй).
export async function getDrawerCourses(): Promise<DrawerCourse[]> {
  return (await getCourses()).map((course) => ({
    id: course.id,
    title: course.title,
    cover: course.cover.src,
    price: course.price,
    lessonCount: course.lessonCount,
    freeLessonCount: course.freeLessonCount,
  }));
}
