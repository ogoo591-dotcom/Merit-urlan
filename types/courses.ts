// Сургалтын төрлүүд (client, server хоёуланд). Client руу дамжих зүйл videoUrl-гүй; Course нь зөвхөн админ форм болон серверт.

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type LessonInfo = { id: string; title: string; duration: string; isFree: boolean };

export type Lesson = LessonInfo & { videoUrl: string };

// Сан дахь бүтэн сургалт (видео линктэй).
export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImage: string;
  images?: string[];
  level: CourseLevel;
  totalDuration: string;
  topics: string[];
  outcomes: string[];
  lessons: Lesson[];
};

export type CourseSummary = {
  id: string;
  title: string;
  description: string;
  price: number;
  cover: { src: string };
  // Нүүр зураг + нэмэлт зургууд (сургалтын хуудасны gallery).
  images: string[];
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

export type DrawerCourse = { id: string; title: string; cover: string; price: number; lessonCount: number; freeLessonCount: number };

export function formatCoursePrice(value: number) {
  return `${value.toLocaleString("en-US")}₮`;
}
