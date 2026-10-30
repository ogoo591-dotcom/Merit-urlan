import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import galleryImages from "@/lib/gallery-images.json";
import { mockCourses, type MockCourse } from "@/lib/mock/courses";
import { mockPatterns, type MockPattern } from "@/lib/mock/patterns";
import { mockProducts, type StoreProduct } from "@/lib/mock/products";
import type { Order } from "@/lib/orders";

// Сервер талын mock өгөгдлийн сан: .mock-db/db.json файл. Админ, захиалагч бүгд нэг өгөгдлийг харна.
// Анх уншихад lib/mock/*-ийн өгөгдлөөр үүснэ. Supabase руу шилжихэд lib/data/* функцууд энэ файлын оронд Supabase-ийг дуудна.
// Анхаар: Vercel production дээр файл бичих боломжгүй — энэ нь зөвхөн локал хөгжүүлэлтэд зориулагдсан.

export type DbCourse = Omit<MockCourse, "coverSource"> & { coverImage: string };
export type DbPattern = Omit<MockPattern, "coverSource"> & { coverImage: string };

export type DbNotification = {
  id: string;
  audience: "admin" | "customer";
  userId?: string;
  message: string;
  href?: string;
  createdAt: string;
  read: boolean;
};

export type DbPurchase = {
  id: string;
  kind: "course" | "pattern";
  itemId: string;
  userId: string;
  price: number;
  transactionId: string;
  createdAt: string;
};

export type Db = {
  products: StoreProduct[];
  orders: Order[];
  notifications: DbNotification[];
  courses: DbCourse[];
  patterns: DbPattern[];
  purchases: DbPurchase[];
};

export const mockDbDir = path.join(process.cwd(), ".mock-db");
const dbFile = path.join(mockDbDir, "db.json");

const coverFor = (source: string) => galleryImages.find((image) => image.source === source)?.src ?? "/Hero.jpg";

function seed(): Db {
  return structuredClone({
    products: mockProducts,
    orders: [],
    notifications: [],
    courses: mockCourses.map(({ coverSource, ...course }) => ({ ...course, coverImage: coverFor(coverSource) })),
    patterns: mockPatterns.map(({ coverSource, ...pattern }) => ({ ...pattern, coverImage: coverFor(coverSource) })),
    purchases: [],
  });
}

// Файл байхгүй бол анхны өгөгдлийг буцаана (бичихгүй) — анхны бичих үйлдэл файлыг үүсгэнэ.
async function load(): Promise<Db> {
  try {
    return { ...seed(), ...(JSON.parse(await readFile(dbFile, "utf8")) as Partial<Db>) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return seed();
    throw error;
  }
}

async function save(db: Db) {
  await mkdir(mockDbDir, { recursive: true });
  const tmp = `${dbFile}.${crypto.randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(db, null, 2));
  await rename(tmp, dbFile);
}

// Бичих үйлдлүүдийг дараалалд оруулж, зэрэг бичигдэхээс сэргийлнэ.
let queue: Promise<unknown> = Promise.resolve();

export async function readDb(): Promise<Db> {
  await queue;
  return load();
}

export function updateDb<T>(change: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const result = await change(db);
    await save(db);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}
