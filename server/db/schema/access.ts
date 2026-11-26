import { index, integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { mdCourse } from "./course";
import { finPayment } from "./finance";
import { mdPattern } from "./pattern";
import { mdUser } from "./user";

// Сургалт үзэх эрх. payment_id хоосон бол админ гараар олгосон.
export const rlUserCourse = pgTable(
  "rl_user_course",
  {
    userId: text()
      .notNull()
      .references(() => mdUser.id, { onDelete: "cascade" }),
    courseId: text()
      .notNull()
      .references(() => mdCourse.id, { onDelete: "restrict" }),
    price: integer().notNull().default(0),
    paymentId: uuid().references(() => finPayment.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] }), index().on(t.courseId)],
).enableRLS();

// Төлбөртэй схем үзэх, татах эрх (үнэгүй схемд эрх хэрэггүй).
export const rlUserPattern = pgTable(
  "rl_user_pattern",
  {
    userId: text()
      .notNull()
      .references(() => mdUser.id, { onDelete: "cascade" }),
    patternId: text()
      .notNull()
      .references(() => mdPattern.id, { onDelete: "restrict" }),
    price: integer().notNull().default(0),
    paymentId: uuid().references(() => finPayment.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.patternId] }), index().on(t.patternId)],
).enableRLS();
