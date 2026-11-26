import "server-only";

import * as courseRepo from "@/server/repository/course/course";
import * as courseImageRepo from "@/server/repository/course/course-image";
import * as courseOutcomeRepo from "@/server/repository/course/course-outcome";
import * as courseTopicRepo from "@/server/repository/course/course-topic";
import * as lessonRepo from "@/server/repository/course/lesson";
import { transaction } from "@/server/repository/transaction";
import { isUuid } from "@/server/shared/uuid";
import type { Course } from "@/types/courses";

// Сургалт засах (админ).

export async function saveCourse(course: Course, originalId?: string) {
  await transaction(async (tx) => {
    const id = originalId ?? course.id;
    const values = {
      title: course.title,
      description: course.description,
      price: course.price,
      coverImage: course.coverImage,
      level: course.level,
      totalDuration: course.totalDuration,
    };
    if (originalId) {
      await courseRepo.updateCourse(id, values, tx);
    } else {
      if (await courseRepo.courseIdExists(id, tx)) throw new Error("Энэ ID-тай сургалт аль хэдийн байна.");
      await courseRepo.insertCourses([{ id, ...values }], tx);
    }

    await courseImageRepo.deleteCourseImagesByCourse(id, tx);
    await courseImageRepo.insertCourseImages((course.images ?? []).map((path, position) => ({ courseId: id, path, position })), tx);
    await courseOutcomeRepo.deleteCourseOutcomesByCourse(id, tx);
    await courseOutcomeRepo.insertCourseOutcomes(course.outcomes.map((content, position) => ({ courseId: id, content, position })), tx);
    await courseTopicRepo.deleteCourseTopicsByCourse(id, tx);
    await courseTopicRepo.insertCourseTopics(course.topics.map((topic) => ({ courseId: id, topic })), tx);

    // Хуучин хичээлийн id-г хадгална (хэрэглэгчийн үзсэн явц, холбоос эвдрэхгүй); шинэ мөрийг нэмж, хасагдсаныг устгана.
    const existing = new Set((await lessonRepo.listLessonsByCourseIds([id], tx)).map((lesson) => lesson.id));
    const keep: string[] = [];
    for (const [index, lesson] of course.lessons.entries()) {
      const fields = { position: index + 1, title: lesson.title, duration: lesson.duration, isFree: lesson.isFree, videoUrl: lesson.videoUrl };
      if (isUuid(lesson.id) && existing.has(lesson.id)) {
        await lessonRepo.updateLesson(lesson.id, fields, tx);
        keep.push(lesson.id);
      } else {
        const [created] = await lessonRepo.insertLessons([{ courseId: id, ...fields }], tx);
        keep.push(created.id);
      }
    }
    await lessonRepo.deleteLessonsExcept(id, keep, tx);
  });
}

// Худалдан авалтын эрх эвдрэхгүйн тулд мөрийг устгахгүй, deleted_at тэмдэглэнэ.
export async function deleteCourse(id: string) {
  await courseRepo.softDeleteCourse(id);
}
