import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import galleryImages from "@/lib/content/gallery-images.json";
import { mockCourses } from "@/server/mock/courses";
import { mockPatterns } from "@/server/mock/patterns";
import { mockCatalogVersion, mockProducts } from "@/server/mock/products";
import type { StoreProduct } from "@/types/catalog";
import type { Course } from "@/types/courses";
import type { AppNotification } from "@/types/notifications";
import type { Order } from "@/types/orders";
import type { Pattern } from "@/types/patterns";
import type { Payment } from "@/types/payments";
import type { Purchase } from "@/types/purchases";

// Сервер талын mock өгөгдлийн сан: .mock-db/db.json файл. Админ, захиалагч бүгд нэг өгөгдлийг харна.
// Анх уншихад server/mock/*-ийн өгөгдлөөр үүснэ. Supabase руу шилжихэд server/modules/* функцууд энэ файлын оронд Supabase-ийг дуудна.
// Анхаар: Vercel production дээр файл бичих боломжгүй — энэ нь зөвхөн локал хөгжүүлэлтэд зориулагдсан.


export type Db = {
  products: StoreProduct[];
  orders: Order[];
  notifications: AppNotification[];
  courses: Course[];
  patterns: Pattern[];
  purchases: Purchase[];
  payments: Payment[];
  catalogVersion?: number;
};

export const mockDbDir = path.join(process.cwd(), ".mock-db");
const dbFile = path.join(mockDbDir, "db.json");

const coverFor = (source: string) => galleryImages.find((image) => image.source === source)?.src ?? "/Hero.jpg";

function seed(): Db {
  return structuredClone({
    products: mockProducts,
    orders: [],
    notifications: [],
    courses: mockCourses.map(({ coverSource, gallerySources = [], ...course }) => ({
      ...course,
      coverImage: coverFor(coverSource),
      images: gallerySources.map(coverFor),
    })),
    patterns: mockPatterns,
    purchases: [],
    payments: [],
    catalogVersion: mockCatalogVersion,
  });
}

// Файл байхгүй бол анхны өгөгдлийг буцаана (бичихгүй) — анхны бичих үйлдэл файлыг үүсгэнэ.
async function load(): Promise<Db> {
  try {
    const stored = JSON.parse(await readFile(dbFile, "utf8")) as Partial<Db>;
    const db = { ...seed(), ...stored };
    // Mock барааны жагсаалт шинэчлэгдсэн бол хуучныг нь солино (захиалга, мэдэгдэл хэвээр).
    // Өмнө үүссэн санд сургалтын нэмэлт зураг байхгүй бол mock-оос нөхнө.
    const seeded = seed();
    for (const course of db.courses) {
      course.images ??= seeded.courses.find((item) => item.id === course.id)?.images;
    }
    if (stored.catalogVersion !== mockCatalogVersion) {
      db.products = structuredClone(mockProducts);
      db.catalogVersion = mockCatalogVersion;
    }
    return db;
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
