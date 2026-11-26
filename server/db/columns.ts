// Хүснэгтүүдийн нийтлэг багана. Schema файлууд drizzle-kit-ээр (Next-ээс гадна) уншигддаг тул "server-only" import хийхгүй.
import { boolean, timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// is_active = false: түр нуусан. deleted_at: админ устгасан (холбоотой захиалга, эрх эвдрэхгүйн тулд мөр үлдэнэ).
export const visibility = {
  isActive: boolean().notNull().default(true),
  deletedAt: timestamp({ withTimezone: true }),
};
