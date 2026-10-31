import "server-only";

import { formatPrice } from "@/lib/format";
import { readDb, updateDb } from "@/lib/mock/db";
import { productColors, type Availability, type ColorKey, type Origin, type ProductType, type StoreProduct } from "@/lib/mock/products";

// Бараа, материал. Одоогоор mock сан (.mock-db), дараа нь зөвхөн эдгээр функцын дотор талыг Supabase руу солино.

export type { Availability, ColorKey, Origin, ProductType, StoreProduct } from "@/lib/mock/products";
export { formatPrice };

export type ProductSort = "default" | "price_asc" | "price_desc" | "name";

function matches(item: StoreProduct, query: string) {
  const text = `${item.name} ${item.category} ${item.subcategory ?? ""} ${item.brand ?? ""} ${item.description}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}

export async function getProducts({
  type,
  category,
  sort = "default",
  query,
}: {
  type?: ProductType;
  category?: string;
  sort?: ProductSort;
  query?: string;
}): Promise<StoreProduct[]> {
  const items = (await readDb()).products.filter(
    (item) => (!type || item.type === type) && (!category || item.category === category) && (!query || matches(item, query)),
  );
  return sortItems(items, sort);
}

function sortItems(items: StoreProduct[], sort: ProductSort) {
  if (sort === "price_asc") return items.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return items.sort((a, b) => b.price - a.price);
  if (sort === "name") return items.sort((a, b) => a.name.localeCompare(b.name, "mn"));
  // "Санал болгох": дууссан бараа хамгийн сүүлд.
  return items.sort((a, b) => Number(a.stock < 1) - Number(b.stock < 1));
}

export type CatalogFilters = {
  type: ProductType;
  category?: string;
  subcategory?: string;
  brands?: string[];
  colors?: ColorKey[];
  origins?: Origin[];
  availability?: Availability[];
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
};

export type FacetOption = { value: string; label: string; count: number; swatch?: string };

export type Catalog = {
  items: StoreProduct[];
  total: number;
  page: number;
  pageCount: number;
  perPage: number;
  categories: FacetOption[];
  subcategories: FacetOption[];
  facets: { brands: FacetOption[]; colors: FacetOption[]; origins: FacetOption[]; availability: FacetOption[] };
};

const availabilityLabels: Record<Availability, string> = { ready: "Бэлэн", made_to_order: "Захиалгаар" };

function countBy(items: StoreProduct[], pick: (item: StoreProduct) => string[] | string | undefined) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const values = pick(item);
    for (const value of Array.isArray(values) ? values : values ? [values] : []) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

// Жагсаалтын хуудас: ангилал, шүүлтүүр, эрэмбэ, хуудаслалт. Шүүлтүүрийн тоо нь сонгосон ангилал дотроо тоологдоно.
export async function getCatalog(filters: CatalogFilters): Promise<Catalog> {
  const perPage = filters.perPage ?? 12;
  const ofType = (await readDb()).products.filter((item) => item.type === filters.type);
  const searched = filters.query ? ofType.filter((item) => matches(item, filters.query!)) : ofType;
  const inCategory = searched.filter((item) => !filters.category || item.category === filters.category);
  const scope = inCategory.filter((item) => !filters.subcategory || item.subcategory === filters.subcategory);

  const has = <T,>(list: T[] | undefined, value: T | undefined) => !list?.length || (value !== undefined && list.includes(value));
  const filtered = scope.filter(
    (item) =>
      has(filters.brands, item.brand) &&
      has(filters.origins, item.origin) &&
      has(filters.availability, item.availability) &&
      (!filters.colors?.length || filters.colors.some((color) => item.colors?.includes(color))) &&
      (filters.minPrice === undefined || item.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || item.price <= filters.maxPrice),
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(Math.max(1, filters.page ?? 1), pageCount);
  const toOptions = (counts: Map<string, number>, label: (value: string) => string = (value) => value) =>
    [...counts].map(([value, count]) => ({ value, label: label(value), count }));

  const colorCounts = countBy(scope, (item) => item.colors);
  return {
    items: sortItems(filtered, filters.sort ?? "default").slice((page - 1) * perPage, page * perPage),
    total: filtered.length,
    page,
    pageCount,
    perPage,
    categories: toOptions(countBy(searched, (item) => item.category)),
    subcategories: toOptions(countBy(inCategory, (item) => item.subcategory)),
    facets: {
      brands: toOptions(countBy(scope, (item) => item.brand)).sort((a, b) => a.label.localeCompare(b.label)),
      colors: (Object.keys(productColors) as ColorKey[])
        .filter((key) => colorCounts.has(key))
        .map((key) => ({ value: key, label: productColors[key].label, count: colorCounts.get(key)!, swatch: productColors[key].hex })),
      origins: toOptions(countBy(scope, (item) => item.origin)),
      availability: toOptions(countBy(scope, (item) => item.availability), (value) => availabilityLabels[value as Availability]),
    },
  };
}

export async function searchProducts(query: string, limit = 5): Promise<StoreProduct[]> {
  const trimmed = query.trim().slice(0, 80);
  return trimmed ? (await readDb()).products.filter((item) => matches(item, trimmed)).slice(0, limit) : [];
}

export async function getProduct(id: string): Promise<StoreProduct | null> {
  return (await readDb()).products.find((item) => item.id === id) ?? null;
}

// ---- Админ ----

export async function saveProduct(product: StoreProduct, originalId?: string) {
  await updateDb((db) => {
    const index = db.products.findIndex((item) => item.id === (originalId ?? product.id));
    if (originalId && product.id !== originalId && db.products.some((item) => item.id === product.id)) {
      throw new Error("Энэ ID-тай бараа аль хэдийн байна.");
    }
    if (index === -1) {
      if (db.products.some((item) => item.id === product.id)) throw new Error("Энэ ID-тай бараа аль хэдийн байна.");
      db.products.unshift(product);
    } else {
      db.products[index] = product;
    }
  });
}

export async function deleteProduct(id: string) {
  await updateDb((db) => {
    db.products = db.products.filter((item) => item.id !== id);
  });
}

export async function setProductStock(id: string, stock: number) {
  await updateDb((db) => {
    const item = db.products.find((entry) => entry.id === id);
    if (item) item.stock = Math.max(0, Math.floor(stock));
  });
}
