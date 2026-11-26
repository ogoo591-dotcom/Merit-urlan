import { sql } from "drizzle-orm";
import { boolean, index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { timestamps, visibility } from "../columns";

// Clerk-ийн хэрэглэгчийн хуулбар (webhook + захиалга/төлбөр үүсгэхэд upsert). Нэвтрэлт, админ эрх Clerk-д үлдэнэ.
// is_active = false: админ хаасан (Clerk ban-тай хамт) — захиалга, төлбөр хийхийг хориглоно. Webhook хөндөхгүй.
// deleted_at: Clerk-ээс устсан. Имэйл зөвхөн устаагүй хэрэглэгчдийн дунд давтагдахгүй (ижил gmail-ээр дахин бүртгүүлж болно).
export const mdUser = pgTable(
  "md_user",
  {
    id: text().primaryKey(),
    email: text().notNull(),
    name: text(),
    imageUrl: text().notNull().default(""),
    ...visibility,
    ...timestamps,
  },
  (t) => [uniqueIndex("md_user_email_active_uq").on(t.email).where(sql`${t.deletedAt} is null`)],
).enableRLS();

// Хэрэглэгчийн өөрөө бөглөдөг профайл (Clerk webhook хөндөхгүй). Анхны захиалга эсвэл /account/profile-д бөглөнө.
export const mdPerson = pgTable("md_person", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .notNull()
    .unique("md_person_user_id_unique")
    .references(() => mdUser.id, { onDelete: "cascade" }),
  lastName: text().notNull().default(""),
  firstName: text().notNull().default(""),
  // Хүргэлтийн холбоо барих утас (Clerk-ийн нэвтрэх утаснаас өөр байж болно).
  phone: text().notNull().default(""),
  ...timestamps,
}).enableRLS();

// Хүргэлтийн хаяг. Хүн бүрт нэг л үндсэн хаяг (partial unique index).
export const mdAddress = pgTable(
  "md_address",
  {
    id: uuid().primaryKey().defaultRandom(),
    personId: uuid()
      .notNull()
      .references(() => mdPerson.id, { onDelete: "cascade" }),
    district: text().notNull(),
    khoroo: text().notNull().default(""),
    detail: text().notNull(),
    isDefault: boolean().notNull().default(false),
    ...timestamps,
  },
  (t) => [
    index().on(t.personId),
    uniqueIndex("md_address_person_default_uq").on(t.personId).where(sql`${t.isDefault}`),
  ],
).enableRLS();
