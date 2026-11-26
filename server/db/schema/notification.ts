import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { mdUser } from "./user";
import type { AppNotification } from "../../../types/notifications";

export const mdNotification = pgTable(
  "md_notification",
  {
    id: uuid().primaryKey().defaultRandom(),
    audience: text().$type<AppNotification["audience"]>().notNull(),
    userId: text().references(() => mdUser.id, { onDelete: "cascade" }),
    message: text().notNull(),
    href: text(),
    // Хоосон бол уншаагүй.
    readAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.audience, t.userId, t.createdAt)],
).enableRLS();
