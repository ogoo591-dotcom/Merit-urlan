import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  unique,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

import { timestamps, visibility } from "../columns";
import type { Availability, ColorKey, Origin, ProductType } from "../../../types/catalog";

// parent_id байвал дэд ангилал. Бараа хамгийн нарийн түвшний ангиллыг заана.
export const mdCategory = pgTable(
  "md_category",
  {
    id: uuid().primaryKey().defaultRandom(),
    parentId: uuid().references((): AnyPgColumn => mdCategory.id, { onDelete: "restrict" }),
    type: text().$type<ProductType>().notNull(),
    slug: text().notNull(),
    name: text().notNull(),
    position: integer().notNull().default(0),
    isActive: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [
    unique("md_category_type_parent_id_slug_unique").on(t.type, t.parentId, t.slug).nullsNotDistinct(),
    index().on(t.parentId),
  ],
).enableRLS();

export const mdBrand = pgTable("md_brand", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull().unique(),
  isActive: boolean().notNull().default(true),
  ...timestamps,
}).enableRLS();

export const mdColor = pgTable("md_color", {
  key: text().$type<ColorKey>().primaryKey(),
  label: text().notNull(),
  hex: text().notNull(),
  position: integer().notNull().default(0),
  isActive: boolean().notNull().default(true),
  ...timestamps,
}).enableRLS();

// Бараа ба материал (type-аар ялгана). id нь URL-ийн slug.
export const mdProduct = pgTable(
  "md_product",
  {
    id: text().primaryKey(),
    type: text().$type<ProductType>().notNull(),
    categoryId: uuid()
      .notNull()
      .references(() => mdCategory.id, { onDelete: "restrict" }),
    brandId: uuid().references(() => mdBrand.id, { onDelete: "set null" }),
    name: text().notNull(),
    description: text().notNull().default(""),
    price: integer().notNull(),
    stock: integer().notNull().default(0),
    availability: text().$type<Availability>().notNull().default("ready"),
    leadDays: integer(),
    origin: text().$type<Origin>(),
    ...visibility,
    ...timestamps,
  },
  (t) => [
    check("md_product_price_check", sql`price >= 0`),
    // Зэрэг захиалахад сүүлийн ширхэгийг давхар зарахаас DB өөрөө хамгаална.
    check("md_product_stock_check", sql`stock >= 0`),
    index().on(t.type, t.categoryId),
    index().on(t.brandId),
  ],
).enableRLS();

export const mdProductImage = pgTable(
  "md_product_image",
  {
    id: uuid().primaryKey().defaultRandom(),
    productId: text()
      .notNull()
      .references(() => mdProduct.id, { onDelete: "cascade" }),
    // media bucket доторх зам: products/<productId>/<uuid>.webp
    path: text().notNull(),
    position: integer().notNull().default(0),
    ...timestamps,
  },
  (t) => [index().on(t.productId, t.position)],
).enableRLS();

export const rlProductColor = pgTable(
  "rl_product_color",
  {
    productId: text()
      .notNull()
      .references(() => mdProduct.id, { onDelete: "cascade" }),
    colorKey: text()
      .$type<ColorKey>()
      .notNull()
      .references(() => mdColor.key, { onDelete: "restrict", onUpdate: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.colorKey] }), index().on(t.colorKey)],
).enableRLS();
