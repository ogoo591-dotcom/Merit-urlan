import "server-only";

import { readDb } from "@/server/mock/db";
import { buildListing, type ListingFilters } from "@/server/listing";
import { hasAccess } from "@/server/modules/purchases/queries";
import { levelLabels, type Course, type CourseDetail, type CourseSummary } from "@/types/courses";

// Сургалтын өгөгдөл. Client руу дамжих бүх зүйл videoUrl-гүй байна;
// видео линкийг зөвхөн getLessonVideo() эрх шалгасны дараа буцаана.

function toSummary(course: Course): CourseSummary {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    price: course.price,
    cover: { src: course.coverImage },
    images: [course.coverImage, ...(course.images ?? []).filter((src) => src !== course.coverImage)],
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

const topicLabels: Record<string, string> = { kids: "Хүүхэд", "new-year": "Шинэ жил", "scarf-hat": "Ороолт малгай" };

// Сургалтын жагсаалтын хуудас: зүүн самбарын ангилал нь сургалтын багц бүр (?package=<id>), түвшингүй.
export async function getCourseCatalog(filters: Omit<ListingFilters, "levels">) {
  const courses = (await readDb()).courses.map(toSummary);
  return buildListing(courses, filters, {
    categoriesOf: (course) => [course.id],
    categoryLabel: (id) => courses.find((course) => course.id === id)?.title ?? id,
    levelLabels: {},
    textOf: (course) => `${course.title} ${course.description} ${course.topics.map((topic) => topicLabels[topic] ?? topic).join(" ")}`,
    nameOf: (course) => course.title,
  });
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

export async function getCourseForAdmin(id: string): Promise<Course | null> {
  return (await readDb()).courses.find((item) => item.id === id) ?? null;
}
