import "server-only";

import { buildListing, type ListingFilters } from "@/server/listing";
import * as courseRepo from "@/server/repository/course/course";
import * as courseImageRepo from "@/server/repository/course/course-image";
import * as courseOutcomeRepo from "@/server/repository/course/course-outcome";
import * as courseTopicRepo from "@/server/repository/course/course-topic";
import * as lessonRepo from "@/server/repository/course/lesson";
import { isUuid } from "@/server/shared/uuid";
import { hasAccess } from "@/server/services/purchases/queries";
import { levelLabels, type Course, type CourseDetail, type CourseSummary } from "@/types/courses";

// Сургалтын өгөгдөл. Client руу дамжих бүх зүйл videoUrl-гүй байна;
// видео линкийг зөвхөн getLessonVideo() эрх шалгасны дараа буцаана.

// md_course + зураг, үр дүн, сэдэв, хичээлийг Course хэлбэр рүү угсарна.
async function toCourses(rows: courseRepo.Course[]): Promise<Course[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const [images, outcomes, topics, lessons] = await Promise.all([
    courseImageRepo.listCourseImagesByCourseIds(ids),
    courseOutcomeRepo.listCourseOutcomesByCourseIds(ids),
    courseTopicRepo.listCourseTopicsByCourseIds(ids),
    lessonRepo.listLessonsByCourseIds(ids),
  ]);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    coverImage: row.coverImage,
    images: images.filter((image) => image.courseId === row.id).map((image) => image.path),
    level: row.level,
    totalDuration: row.totalDuration,
    topics: topics.filter((topic) => topic.courseId === row.id).map((topic) => topic.topic),
    outcomes: outcomes.filter((outcome) => outcome.courseId === row.id).map((outcome) => outcome.content),
    lessons: lessons
      .filter((lesson) => lesson.courseId === row.id)
      .map(({ id, title, duration, isFree, videoUrl }) => ({ id, title, duration, isFree, videoUrl })),
  }));
}

const loadCourses = async () => toCourses(await courseRepo.listCourses());

async function loadCourse(id: string): Promise<Course | null> {
  const row = await courseRepo.findCourse(id);
  return row ? (await toCourses([row]))[0] : null;
}

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
  return (await loadCourses())
    .filter((course) => (!filter.level || course.level === filter.level) && (!filter.topic || course.topics.includes(filter.topic)))
    .map(toSummary);
}

const topicLabels: Record<string, string> = { kids: "Хүүхэд", "new-year": "Шинэ жил", "scarf-hat": "Ороолт малгай" };

// Сургалтын жагсаалтын хуудас: зүүн самбарын ангилал нь сургалтын багц бүр (?package=<id>), түвшингүй.
export async function getCourseCatalog(filters: Omit<ListingFilters, "levels">) {
  const courses = (await loadCourses()).map(toSummary);
  return buildListing(courses, filters, {
    categoriesOf: (course) => [course.id],
    categoryLabel: (id) => courses.find((course) => course.id === id)?.title ?? id,
    levelLabels: {},
    textOf: (course) => `${course.title} ${course.description} ${course.topics.map((topic) => topicLabels[topic] ?? topic).join(" ")}`,
    nameOf: (course) => course.title,
  });
}

export async function getCourse(id: string): Promise<CourseDetail | null> {
  const course = await loadCourse(id);
  if (!course) return null;
  return {
    ...toSummary(course),
    lessons: course.lessons.map(({ id: lessonId, title, duration, isFree }) => ({ id: lessonId, title, duration, isFree })),
  };
}

// Үнэгүй хичээл эсвэл худалдаж авсан хэрэглэгчид л видео линкийг буцаана. Бусад үед null.
export async function getLessonVideo(courseId: string, lessonId: string, userId: string | null): Promise<string | null> {
  if (!isUuid(lessonId)) return null;
  const lesson = await lessonRepo.findLesson(courseId, lessonId);
  if (!lesson) return null;
  if (lesson.isFree || (await hasAccess(userId, courseId))) return lesson.videoUrl;
  return null;
}

export async function getCourseForAdmin(id: string): Promise<Course | null> {
  return loadCourse(id);
}
