import { sql } from "drizzle-orm";
import { boolean, check, date, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "../columns";
import { mdProduct } from "./catalog";
import { mdUser } from "./user";
import type { OrderStatus } from "../../../types/orders";

// Нэр, утас, хаягийг захиалга хийх үеийнхээр хуулж хадгална (профайл өөрчлөгдсөн ч хүргэлтийн мэдээлэл хэвээр).
export const mdOrder = pgTable(
  "md_order",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1001 }),
    userId: text()
      .notNull()
      .references(() => mdUser.id, { onDelete: "restrict" }),
    customerName: text().notNull(),
    customerPhone: text().notNull(),
    addressDistrict: text().notNull(),
    addressKhoroo: text().notNull().default(""),
    addressDetail: text().notNull(),
    note: text().notNull().default(""),
    total: integer().notNull(),
    status: text().$type<OrderStatus>().notNull().default("received"),
    readyBy: date({ mode: "string" }),
    ...timestamps,
  },
  (t) => [
    check("md_order_total_check", sql`total >= 0`),
    index().on(t.userId),
    index().on(t.status, t.createdAt),
  ],
).enableRLS();

// Барааны нэр, зураг, үнэ, сонголтыг захиалга хийх үеийнхээр хуулна — дараа нь бараа өөрчлөгдсөн ч захиалга хэвээр.
export const mdOrderItem = pgTable(
  "md_order_item",
  {
    id: uuid().primaryKey().defaultRandom(),
    orderId: integer()
      .notNull()
      .references(() => mdOrder.id, { onDelete: "cascade" }),
    productId: text().references(() => mdProduct.id, { onDelete: "set null" }),
    name: text().notNull(),
    image: text(),
    price: integer().notNull(),
    quantity: integer().notNull(),
    madeToOrder: boolean().notNull().default(false),
    leadDays: integer(),
    // Даалингийн сонголт (өнгө, хээ, хэмжээ, бичээс, бэлгийн боодол г.м.).
    options: jsonb().$type<Record<string, string | number | boolean>>(),
    ...timestamps,
  },
  (t) => [
    check("md_order_item_price_check", sql`price >= 0`),
    check("md_order_item_quantity_check", sql`quantity > 0`),
    index().on(t.orderId),
    index().on(t.productId),
  ],
).enableRLS();

export const mdOrderStatusHistory = pgTable(
  "md_order_status_history",
  {
    id: uuid().primaryKey().defaultRandom(),
    orderId: integer()
      .notNull()
      .references(() => mdOrder.id, { onDelete: "cascade" }),
    status: text().$type<OrderStatus>().notNull(),
    changedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    // Статус өөрчилсөн админы Clerk id (систем өөрчилсөн бол хоосон).
    changedBy: text(),
  },
  (t) => [index().on(t.orderId, t.changedAt)],
).enableRLS();
