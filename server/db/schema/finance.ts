import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "../columns";
import { mdCourse } from "./course";
import { mdOrder } from "./order";
import { mdPattern } from "./pattern";
import { mdUser } from "./user";
import type { PaymentStatus } from "../../../types/payments";

// Дансаар шилжүүлэх (админ баталгаажуулна) эсвэл QPay invoice (callback автоматаар баталгаажуулна).
export const finPayment = pgTable(
  "fin_payment",
  {
    id: uuid().primaryKey().defaultRandom(),
    // Гүйлгээний утга MU-XXXXXX — банкны хуулгатай тулгана.
    code: text().notNull().unique(),
    userId: text()
      .notNull()
      .references(() => mdUser.id, { onDelete: "restrict" }),
    orderId: integer().references(() => mdOrder.id, { onDelete: "restrict" }),
    amount: integer().notNull(),
    status: text().$type<PaymentStatus>().notNull().default("pending"),
    provider: text().$type<"bank_transfer" | "qpay">().notNull().default("bank_transfer"),
    providerInvoiceId: text().unique("fin_payment_provider_invoice_id_unique"),
    providerPaymentId: text(),
    paidAt: timestamp({ withTimezone: true }),
    // Админ, хэрэглэгчид харагдах товч тайлбар ("Захиалга #1023, Хүүхдийн багц").
    summary: text().notNull().default(""),
    customerName: text(),
    customerPhone: text(),
    reviewedAt: timestamp({ withTimezone: true }),
    reviewedBy: text(),
    ...timestamps,
  },
  (t) => [
    check("fin_payment_amount_check", sql`amount >= 0`),
    index().on(t.status, t.createdAt),
    index().on(t.userId),
    index().on(t.orderId),
  ],
).enableRLS();

// Төлбөр баталгаажихад нээгдэх сургалт.
export const rlPaymentCourse = pgTable(
  "rl_payment_course",
  {
    paymentId: uuid()
      .notNull()
      .references(() => finPayment.id, { onDelete: "cascade" }),
    courseId: text()
      .notNull()
      .references(() => mdCourse.id, { onDelete: "restrict" }),
    price: integer().notNull(),
  },
  (t) => [primaryKey({ columns: [t.paymentId, t.courseId] }), index().on(t.courseId)],
).enableRLS();

// Төлбөр баталгаажихад нээгдэх схем.
export const rlPaymentPattern = pgTable(
  "rl_payment_pattern",
  {
    paymentId: uuid()
      .notNull()
      .references(() => finPayment.id, { onDelete: "cascade" }),
    patternId: text()
      .notNull()
      .references(() => mdPattern.id, { onDelete: "restrict" }),
    price: integer().notNull(),
  },
  (t) => [primaryKey({ columns: [t.paymentId, t.patternId] }), index().on(t.patternId)],
).enableRLS();
