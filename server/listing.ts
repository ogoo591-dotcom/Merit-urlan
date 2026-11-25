import "server-only";

import type { FacetOption } from "@/lib/data/products";

// Сургалт, схемийн жагсаалтын дундын шүүлт. Бараа, материал нь getCatalog() (lib/data/products.ts)-ийг ашиглана.

export type ListingFilters = {
  category?: string;
  levels?: string[];
  query?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type Listing<T> = { items: T[]; total: number; allCount: number; categories: FacetOption[]; levels: FacetOption[] };

export function buildListing<T extends { price: number; level: string }>(
  all: T[],
  filters: ListingFilters,
  options: {
    categoriesOf: (item: T) => string[];
    categoryLabel: (value: string) => string;
    levelLabels: Record<string, string>;
    textOf: (item: T) => string;
    nameOf: (item: T) => string;
    createdAtOf?: (item: T) => string;
  },
): Listing<T> {
  const words = (filters.query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const searched = all.filter((item) => {
    const text = options.textOf(item).toLowerCase();
    return words.every((word) => text.includes(word));
  });
  const inCategory = searched.filter((item) => !filters.category || options.categoriesOf(item).includes(filters.category));
  const filtered = inCategory.filter(
    (item) =>
      (!filters.levels?.length || filters.levels.includes(item.level)) &&
      (filters.minPrice === undefined || item.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || item.price <= filters.maxPrice),
  );

  const categoryCounts = new Map<string, number>();
  for (const item of searched) for (const value of options.categoriesOf(item)) categoryCounts.set(value, (categoryCounts.get(value) ?? 0) + 1);

  const items = [...filtered];
  if (filters.sort === "price_asc") items.sort((a, b) => a.price - b.price);
  else if (filters.sort === "price_desc") items.sort((a, b) => b.price - a.price);
  else if (filters.sort === "name") items.sort((a, b) => options.nameOf(a).localeCompare(options.nameOf(b), "mn"));
  else if (filters.sort === "new" && options.createdAtOf) items.sort((a, b) => options.createdAtOf!(b).localeCompare(options.createdAtOf!(a)));

  return {
    items,
    total: filtered.length,
    allCount: searched.length,
    categories: [...categoryCounts].map(([value, count]) => ({ value, label: options.categoryLabel(value), count })),
    levels: Object.entries(options.levelLabels)
      .map(([value, label]) => ({ value, label, count: inCategory.filter((item) => item.level === value).length }))
      .filter((option) => option.count > 0 || filters.levels?.includes(option.value)),
  };
}
