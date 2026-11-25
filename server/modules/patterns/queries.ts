import "server-only";

import { readDb } from "@/server/mock/db";
import { buildListing, type ListingFilters } from "@/server/listing";
import { getProduct } from "@/server/modules/catalog/queries";
import { patternLevelLabels, patternTypeLabels, type Pattern, type PatternDetail, type PatternSummary } from "@/types/patterns";

// Схем зааврын өгөгдөл. Client руу дамжих зүйлд filePath байхгүй;
// Бүтэн схемийг зөвхөн /api/patterns/[id]/download эрх шалгасны дараа server/storage/pattern-files.ts уншина.

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
  const items = (await readDb()).patterns.filter((pattern) => !filter.type || pattern.type === filter.type).map(toSummary);
  return filter.sort === "new" ? items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : items;
}

const accessLabels: Record<string, string> = { free: "Үнэгүй схем", paid: "Төлбөртэй схем" };

// Схемийн жагсаалт: үнэгүй/төлбөртэй нь ангилал (?access=free|paid), түвшин нь шүүлтүүр.
export async function getPatternCatalog(filters: ListingFilters) {
  return buildListing((await readDb()).patterns.map(toSummary), filters, {
    categoriesOf: (pattern) => [pattern.isFree ? "free" : "paid"],
    categoryLabel: (access) => accessLabels[access] ?? access,
    levelLabels: patternLevelLabels,
    textOf: (pattern) => `${pattern.name} ${pattern.description} ${pattern.typeLabel} ${pattern.levelLabel}`,
    nameOf: (pattern) => pattern.name,
    createdAtOf: (pattern) => pattern.createdAt,
  });
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

export async function getPatternForAdmin(id: string): Promise<Pattern | null> {
  return (await readDb()).patterns.find((item) => item.id === id) ?? null;
}
