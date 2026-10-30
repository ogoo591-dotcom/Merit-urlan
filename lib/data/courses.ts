import "server-only";

import { hasAccess } from "@/lib/data/purchases";
import { readDb, updateDb, type DbCourse } from "@/lib/mock/db";
import type { CourseLevel } from "@/lib/mock/courses";

// Сургалтын өгөгдөл. Client руу дамжих бүх зүйл videoUrl-гүй байна;
// видео линкийг зөвхөн getLessonVideo() эрх шалгасны дараа буцаана.

export type { CourseLevel } from "@/lib/mock/courses";

export type LessonInfo = { id: string; title: string; duration: string; isFree: boolean };

export type CourseSummary = {
  id: string;
  title: string;
  description: string;
  price: number;
  cover: { src: string };
  level: CourseLevel;
  levelLabel: string;
  totalDuration: string;
  topics: string[];
  outcomes: string[];
  lessonCount: number;
  freeLessonCount: number;
};

export type CourseDetail = CourseSummary & { lessons: LessonInfo[] };

export const levelLabels: Record<CourseLevel, string> = {
  beginner: "Анхан шат",
  intermediate: "Дунд шат",
  advanced: "Ахисан шат",
};

function toSummary(course: DbCourse): CourseSummary {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    price: course.price,
    cover: { src: course.coverImage },
    level: course.level,
    levelLabel: levelLabels[course.level],
    totalDuration: course.totalDuration,
    topics: course.topics,
    outcomes: course.outcomes,
    lessonCount: course.lessons.length,
    freeLessonCount: course.lessons.filter((lesson) => lesson.isFree).length,
  };
}

export async function getCourses(filter: { level?: string; topic?: string } = {}): Promise<CourseSummary[]> {
  return (await readDb()).courses
    .filter((course) => (!filter.level || course.level === filter.level) && (!filter.topic || course.topics.includes(filter.topic)))
    .map(toSummary);
}

export async function getCourse(id: string): Promise<CourseDetail | null> {
  const course = (await readDb()).courses.find((item) => item.id === id);
  if (!course) return null;
  return {
    ...toSummary(course),
    lessons: course.lessons.map(({ id: lessonId, title, duration, isFree }) => ({ id: lessonId, title, duration, isFree })),
  };
}

// Үнэгүй хичээл эсвэл худалдаж авсан хэрэглэгчид л видео линкийг буцаана. Бусад үед null.
export async function getLessonVideo(courseId: string, lessonId: string, userId: string | null): Promise<string | null> {
  const lesson = (await readDb()).courses.find((course) => course.id === courseId)?.lessons.find((item) => item.id === lessonId);
  if (!lesson) return null;
  if (lesson.isFree || (await hasAccess(userId, courseId))) return lesson.videoUrl;
  return null;
}

export function formatCoursePrice(value: number) {
  return `${value.toLocaleString("en-US")}₮`;
}

// ---- Админ (видео линктэй бүтэн өгөгдөл — зөвхөн админ хуудсанд) ----

export async function getCourseForAdmin(id: string): Promise<DbCourse | null> {
  return (await readDb()).courses.find((item) => item.id === id) ?? null;
}

export async function saveCourse(course: DbCourse, originalId?: string) {
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
