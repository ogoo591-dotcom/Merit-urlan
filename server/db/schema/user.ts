import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { timestamps } from "../columns";

// Clerk-ийн хэрэглэгчийн хуулбар (webhook + захиалга/төлбөр үүсгэхэд upsert). Нэвтрэлт, админ эрх Clerk-д үлдэнэ.
export const mdUser = pgTable("md_user", {
  id: text().primaryKey(),
  email: text().unique(),
  name: text(),
  phone: text(),
  imageUrl: text(),
  deletedAt: timestamp({ withTimezone: true }),
  ...timestamps,
}).enableRLS();
