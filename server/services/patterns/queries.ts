import "server-only";

import { buildListing, type ListingFilters } from "@/server/listing";
import * as patternRepo from "@/server/repository/pattern/pattern";
import * as patternMaterialRepo from "@/server/repository/pattern/pattern-material";
import { getProduct } from "@/server/services/catalog/queries";
import { patternLevelLabels, patternTypeLabels, type Pattern, type PatternDetail, type PatternSummary } from "@/types/patterns";

// Схем зааврын өгөгдөл. Client руу дамжих зүйлд filePath байхгүй;
// Бүтэн схемийг зөвхөн /api/patterns/[id]/download эрх шалгасны дараа server/storage/pattern-files.ts уншина.

// md_pattern + материалыг Pattern хэлбэр рүү угсарна.
async function toPatterns(rows: patternRepo.Pattern[]): Promise<Pattern[]> {
  if (rows.length === 0) return [];
  const materials = await patternMaterialRepo.listMaterialsByPatternIds(rows.map((row) => row.id));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    coverImage: row.coverImage,
    type: row.type,
    level: row.level,
    materials: materials
      .filter((material) => material.patternId === row.id)
      .map(({ name, productId }) => (productId ? { name, materialId: productId } : { name })),
    size: row.size,
    sourceLanguage: row.sourceLanguage,
    ...(row.credit ? { credit: row.credit } : {}),
    createdAt: row.createdAt.toISOString().slice(0, 10),
    filePath: row.filePath,
  }));
}

const loadPatterns = async () => toPatterns(await patternRepo.listPatterns());

async function loadPattern(id: string): Promise<Pattern | null> {
  const row = await patternRepo.findPattern(id);
  return row ? (await toPatterns([row]))[0] : null;
}

function toSummary(pattern: Pattern): PatternSummary {
  return {
    id: pattern.id,
    name: pattern.name,
    description: pattern.description,
    price: pattern.price,
    isFree: pattern.price === 0,
    cover: { src: pattern.coverImage },
    fileKind: pattern.filePath.toLowerCase().endsWith(".pdf") ? "pdf" : "image",
    credit: pattern.credit,
    type: pattern.type,
    typeLabel: patternTypeLabels[pattern.type],
    level: pattern.level,
    levelLabel: patternLevelLabels[pattern.level],
    size: pattern.size,
    sourceLanguage: pattern.sourceLanguage,
    createdAt: pattern.createdAt,
  };
}

export async function getPatterns(filter: { type?: string; sort?: string } = {}): Promise<PatternSummary[]> {
  const items = (await loadPatterns()).filter((pattern) => !filter.type || pattern.type === filter.type).map(toSummary);
  return filter.sort === "new" ? items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : items;
}

const accessLabels: Record<string, string> = { free: "Үнэгүй схем", paid: "Төлбөртэй схем" };

// Схемийн жагсаалт: үнэгүй/төлбөртэй нь ангилал (?access=free|paid), түвшин нь шүүлтүүр.
export async function getPatternCatalog(filters: ListingFilters) {
  return buildListing((await loadPatterns()).map(toSummary), filters, {
    categoriesOf: (pattern) => [pattern.isFree ? "free" : "paid"],
    categoryLabel: (access) => accessLabels[access] ?? access,
    levelLabels: patternLevelLabels,
    textOf: (pattern) => `${pattern.name} ${pattern.description} ${pattern.typeLabel} ${pattern.levelLabel}`,
    nameOf: (pattern) => pattern.name,
    createdAtOf: (pattern) => pattern.createdAt,
  });
}

export async function getPattern(id: string): Promise<PatternDetail | null> {
  const pattern = await loadPattern(id);
  if (!pattern) return null;
  const materials = await Promise.all(
    pattern.materials.map(async ({ name, materialId }) => {
      const product = materialId ? await getProduct(materialId) : null;
      return product ? { name, href: `/materials/${product.id}`, category: product.category } : { name };
    }),
  );
  return { ...toSummary(pattern), materials };
}

export async function getPatternForAdmin(id: string): Promise<Pattern | null> {
  return loadPattern(id);
}
