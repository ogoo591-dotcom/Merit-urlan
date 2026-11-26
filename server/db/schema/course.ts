import { sql } from "drizzle-orm";
import { boolean, check, index, integer, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";

import { timestamps, visibility } from "../columns";
import { mdProduct } from "./catalog";
import type { CourseLevel } from "../../../types/courses";

export const mdCourse = pgTable(
  "md_course",
  {
    id: text().primaryKey(),
    title: text().notNull(),
    description: text().notNull().default(""),
    price: integer().notNull(),
    // media bucket доторх зам: courses/<courseId>/<uuid>.jpg
    coverImage: text().notNull(),
    level: text().$type<CourseLevel>().notNull().default("beginner"),
    totalDuration: text().notNull().default(""),
    ...visibility,
    ...timestamps,
  },
  () => [check("md_course_price_check", sql`price >= 0`)],
).enableRLS();

export const mdCourseImage = pgTable(
  "md_course_image",
  {
    id: uuid().primaryKey().defaultRandom(),
    courseId: text()
      .notNull()
      .references(() => mdCourse.id, { onDelete: "cascade" }),
    path: text().notNull(),
    position: integer().notNull().default(0),
    ...timestamps,
  },
  (t) => [index().on(t.courseId, t.position)],
).enableRLS();

// Сургалтын хуудасны "Юу сурах вэ" жагсаалт.
export const mdCourseOutcome = pgTable(
  "md_course_outcome",
  {
    id: uuid().primaryKey().defaultRandom(),
    courseId: text()
      .notNull()
      .references(() => mdCourse.id, { onDelete: "cascade" }),
    content: text().notNull(),
    position: integer().notNull().default(0),
    ...timestamps,
  },
  (t) => [index().on(t.courseId, t.position)],
).enableRLS();

// Шүүлтүүр, хайлтын tag.
export const mdCourseTopic = pgTable(
  "md_course_topic",
  {
    id: uuid().primaryKey().defaultRandom(),
    courseId: text()
      .notNull()
      .references(() => mdCourse.id, { onDelete: "cascade" }),
    topic: text().notNull(),
    ...timestamps,
  },
  (t) => [index().on(t.courseId), index().on(t.topic)],
).enableRLS();

export const mdLesson = pgTable(
  "md_lesson",
  {
    id: uuid().primaryKey().defaultRandom(),
    courseId: text()
      .notNull()
      .references(() => mdCourse.id, { onDelete: "cascade" }),
    position: integer().notNull().default(0),
    title: text().notNull(),
    duration: text().notNull().default(""),
    isFree: boolean().notNull().default(false),
    // Bunny Stream үе шатанд video_id болж өөрчлөгдөнө.
    videoUrl: text().notNull().default(""),
    isActive: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [index().on(t.courseId, t.position)],
).enableRLS();

// Сургалтад шаардлагатай материал (Материал хэсгийн бараа).
export const rlCourseMaterial = pgTable(
  "rl_course_material",
  {
    courseId: text()
      .notNull()
      .references(() => mdCourse.id, { onDelete: "cascade" }),
    productId: text()
      .notNull()
      .references(() => mdProduct.id, { onDelete: "cascade" }),
    position: integer().notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.courseId, t.productId] }), index().on(t.productId)],
).enableRLS();
