import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timestamps, visibility } from "../columns";
import { mdProduct } from "./catalog";
import type { PatternLevel, PatternType } from "../../../types/patterns";

export const mdPattern = pgTable(
  "md_pattern",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    description: text().notNull().default(""),
    // 0 бол үнэгүй: нэвтрэлт, төлбөргүйгээр үзнэ.
    price: integer().notNull().default(0),
    // media bucket (public): patterns/<patternId>/<uuid>.jpg — зөвхөн бүтээлийн зураг.
    coverImage: text().notNull(),
    type: text().$type<PatternType>().notNull(),
    level: text().$type<PatternLevel>().notNull().default("beginner"),
    size: text().notNull().default(""),
    sourceLanguage: text().notNull().default(""),
    credit: text(),
    // private bucket: patterns/<patternId>/<uuid>.pdf — эрх шалгасны дараа сервер дамжуулна.
    filePath: text().notNull(),
    ...visibility,
    ...timestamps,
  },
  () => [check("md_pattern_price_check", sql`price >= 0`)],
).enableRLS();

// Схемд хэрэгтэй материал. Дэлгүүрт байгаа бол product_id-аар холбоно.
export const mdPatternMaterial = pgTable(
  "md_pattern_material",
  {
    id: uuid().primaryKey().defaultRandom(),
    patternId: text()
      .notNull()
      .references(() => mdPattern.id, { onDelete: "cascade" }),
    name: text().notNull(),
    productId: text().references(() => mdProduct.id, { onDelete: "set null" }),
    position: integer().notNull().default(0),
    ...timestamps,
  },
  (t) => [index().on(t.patternId, t.position), index().on(t.productId)],
).enableRLS();
