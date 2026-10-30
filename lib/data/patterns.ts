import "server-only";

import { getProduct } from "@/lib/data/products";
import { readDb, updateDb, type DbPattern } from "@/lib/mock/db";
import type { PatternLevel, PatternType } from "@/lib/mock/patterns";

// Схем зааврын өгөгдөл. Client руу дамжих зүйлд pdfPath байхгүй;
// PDF-ийг зөвхөн /api/patterns/[id]/download эрх шалгасны дараа lib/data/pattern-files.ts уншина.

export type { PatternLevel, PatternType } from "@/lib/mock/patterns";

export type PatternMaterial = { name: string; href?: string; category?: string };

export type PatternSummary = {
  id: string;
  name: string;
  description: string;
  price: number;
  cover: { src: string };
  previews: string[];
  type: PatternType;
  typeLabel: string;
  level: PatternLevel;
  levelLabel: string;
  size: string;
  sourceLanguage: string;
  pages: number;
  createdAt: string;
};

export type PatternDetail = PatternSummary & { materials: PatternMaterial[] };

export const patternTypeLabels: Record<PatternType, string> = {
  toy: "Тоглоом",
  clothes: "Хувцас",
  home: "Гэр ахуй",
  accessory: "Аксессуар",
};

export const patternLevelLabels: Record<PatternLevel, string> = {
  beginner: "Анхан шат",
  intermediate: "Дунд шат",
  advanced: "Ахисан шат",
};

function toSummary(pattern: DbPattern): PatternSummary {
  return {
    id: pattern.id,
    name: pattern.name,
    description: pattern.description,
    price: pattern.price,
    cover: { src: pattern.coverImage },
    previews: pattern.previews,
    type: pattern.type,
    typeLabel: patternTypeLabels[pattern.type],
    level: pattern.level,
    levelLabel: patternLevelLabels[pattern.level],
    size: pattern.size,
    sourceLanguage: pattern.sourceLanguage,
    pages: pattern.pages,
    createdAt: pattern.createdAt,
  };
}

export async function getPatterns(filter: { type?: string; sort?: string } = {}): Promise<PatternSummary[]> {
  const items = (await readDb()).patterns.filter((pattern) => !filter.type || pattern.type === filter.type).map(toSummary);
  return filter.sort === "new" ? items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : items;
}

export async function getPattern(id: string): Promise<PatternDetail | null> {
  const pattern = (await readDb()).patterns.find((item) => item.id === id);
  if (!pattern) return null;
  const materials = await Promise.all(
    pattern.materials.map(async ({ name, materialId }) => {
      const product = materialId ? await getProduct(materialId) : null;
      return product ? { name, href: `/materials/${product.id}`, category: product.category } : { name };
    }),
  );
  return { ...toSummary(pattern), materials };
}

export function formatPatternPrice(value: number) {
  return `${value.toLocaleString("en-US")}₮`;
}

// ---- Админ ----

export async function getPatternForAdmin(id: string): Promise<DbPattern | null> {
  return (await readDb()).patterns.find((item) => item.id === id) ?? null;
}

export async function savePattern(pattern: DbPattern, originalId?: string) {
  await updateDb((db) => {
    const index = db.patterns.findIndex((item) => item.id === (originalId ?? pattern.id));
    const clash = db.patterns.some((item, itemIndex) => item.id === pattern.id && itemIndex !== index);
    if (clash) throw new Error("Энэ ID-тай схем аль хэдийн байна.");
    if (index === -1) db.patterns.push(pattern);
    else db.patterns[index] = pattern;
  });
}

export async function deletePattern(id: string) {
  await updateDb((db) => {
    db.patterns = db.patterns.filter((item) => item.id !== id);
  });
}
