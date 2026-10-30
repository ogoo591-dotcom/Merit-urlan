// Хичээл үзэж дууссан тэмдэглэл (mock: localStorage). Нууц мэдээлэл биш тул client талд хадгална.
import { readTable, writeTable } from "@/lib/mock/store";

const table = "course-progress";

type ProgressTable = Record<string, string[]>;

const key = (userId: string | null | undefined, courseId: string) => `${userId ?? "guest"}:${courseId}`;

export async function getCompletedLessons(userId: string | null | undefined, courseId: string): Promise<string[]> {
  return readTable<ProgressTable>(table, {})[key(userId, courseId)] ?? [];
}

export async function setLessonCompleted(userId: string | null | undefined, courseId: string, lessonId: string, done: boolean) {
  const progress = readTable<ProgressTable>(table, {});
  const current = new Set(progress[key(userId, courseId)] ?? []);
  if (done) current.add(lessonId);
  else current.delete(lessonId);
  writeTable(table, { ...progress, [key(userId, courseId)]: [...current] });
}
