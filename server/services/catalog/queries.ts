import "server-only";

import * as brandRepo from "@/server/repository/catalog/brand";
import * as categoryRepo from "@/server/repository/catalog/category";
import * as productRepo from "@/server/repository/catalog/product";
import * as productColorRepo from "@/server/repository/catalog/product-color";
import * as productImageRepo from "@/server/repository/catalog/product-image";
import {
  productColors,
  type Availability,
  type Catalog,
  type CatalogFilters,
  type ColorKey,
  type ProductSort,
  type ProductType,
  type StoreProduct,
} from "@/types/catalog";

// Бараа, материал унших. DB-ийн мөрийг (md_product + ангилал, брэнд, зураг, өнгө) StoreProduct хэлбэр рүү угсарна.
// Барааны тоо цөөн (хэдэн зуу) тул шүүлт, facet тооллыг санах ойд хийнэ; олширвол repository/catalog/product-search.ts руу шилжүүлнэ.

async function toStoreProducts(
  rows: productRepo.Product[],
): Promise<StoreProduct[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const [categories, brands, images, colors] = await Promise.all([
    categoryRepo.listCategories(),
    brandRepo.listBrands(),
    productImageRepo.listImagesByProductIds(ids),
    productColorRepo.listColorsByProductIds(ids),
  ]);
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const brandById = new Map(brands.map((brand) => [brand.id, brand.name]));
  const group = <T>(
    list: T[],
    key: (item: T) => string,
    value: (item: T) => string,
  ) => {
    const map = new Map<string, string[]>();
    for (const item of list)
      map.set(key(item), [...(map.get(key(item)) ?? []), value(item)]);
    return map;
  };
  const imagesOf = group(
    images,
    (image) => image.productId,
    (image) => image.path,
  );
  const colorsOf = group(
    colors,
    (color) => color.productId,
    (color) => color.colorKey,
  );

  return rows.map((row) => {
    const own = categoryById.get(row.categoryId);
    const parent = own?.parentId ? categoryById.get(own.parentId) : undefined;
    const brand = row.brandId ? brandById.get(row.brandId) : undefined;
    const itemColors = (colorsOf.get(row.id) ?? []) as ColorKey[];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      images: imagesOf.get(row.id) ?? [],
      category: (parent ?? own)?.name ?? "",
      type: row.type,
      stock: row.stock,
      availability: row.availability,
      ...(row.leadDays !== null ? { leadDays: row.leadDays } : {}),
      ...(parent && own ? { subcategory: own.name } : {}),
      ...(brand ? { brand } : {}),
      ...(itemColors.length ? { colors: itemColors } : {}),
      ...(row.origin ? { origin: row.origin } : {}),
    };
  });
}

async function loadProducts(type?: ProductType) {
  return toStoreProducts(await productRepo.listProducts({ type }));
}

function matches(item: StoreProduct, query: string) {
  const text =
    `${item.name} ${item.category} ${item.subcategory ?? ""} ${item.brand ?? ""} ${item.description}`.toLowerCase();
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
  const items = (await loadProducts(type)).filter(
    (item) =>
      (!type || item.type === type) &&
      (!category || item.category === category) &&
      (!query || matches(item, query)),
  );
  return sortItems(items, sort);
}

function sortItems(items: StoreProduct[], sort: ProductSort) {
  if (sort === "price_asc") return items.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return items.sort((a, b) => b.price - a.price);
  if (sort === "name")
    return items.sort((a, b) => a.name.localeCompare(b.name, "mn"));
  // "Санал болгох": дууссан бараа хамгийн сүүлд.
  return items.sort((a, b) => Number(a.stock < 1) - Number(b.stock < 1));
}

const availabilityLabels: Record<Availability, string> = {
  ready: "Бэлэн",
  made_to_order: "Захиалгаар",
};

function countBy(
  items: StoreProduct[],
  pick: (item: StoreProduct) => string[] | string | undefined,
) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const values = pick(item);
    for (const value of Array.isArray(values) ? values : values ? [values] : [])
      counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

// Жагсаалтын хуудас: ангилал, шүүлтүүр, эрэмбэ, хуудаслалт. Шүүлтүүрийн тоо нь сонгосон ангилал дотроо тоологдоно.
export async function getCatalog(filters: CatalogFilters): Promise<Catalog> {
  const perPage = filters.perPage ?? 12;
  const ofType = await loadProducts(filters.type);
  const searched = filters.query
    ? ofType.filter((item) => matches(item, filters.query!))
    : ofType;
  const inCategory = searched.filter(
    (item) => !filters.category || item.category === filters.category,
  );
  const scope = inCategory.filter(
    (item) => !filters.subcategory || item.subcategory === filters.subcategory,
  );

  const has = <T>(list: T[] | undefined, value: T | undefined) =>
    !list?.length || (value !== undefined && list.includes(value));
  const filtered = scope.filter(
    (item) =>
      has(filters.brands, item.brand) &&
      has(filters.origins, item.origin) &&
      has(filters.availability, item.availability) &&
      (!filters.colors?.length ||
        filters.colors.some((color) => item.colors?.includes(color))) &&
      (filters.minPrice === undefined || item.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || item.price <= filters.maxPrice),
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(Math.max(1, filters.page ?? 1), pageCount);
  const toOptions = (
    counts: Map<string, number>,
    label: (value: string) => string = (value) => value,
  ) =>
    [...counts].map(([value, count]) => ({
      value,
      label: label(value),
      count,
    }));

  const colorCounts = countBy(scope, (item) => item.colors);
  return {
    items: sortItems(filtered, filters.sort ?? "default").slice(
      (page - 1) * perPage,
      page * perPage,
    ),
    total: filtered.length,
    page,
    pageCount,
    perPage,
    categories: toOptions(countBy(searched, (item) => item.category)).map(
      (category) => ({
        ...category,
        subcategories: toOptions(
          countBy(
            searched.filter((item) => item.category === category.value),
            (item) => item.subcategory,
          ),
        ),
      }),
    ),
    facets: {
      brands: toOptions(countBy(scope, (item) => item.brand)).sort((a, b) =>
        a.label.localeCompare(b.label),
      ),
      colors: (Object.keys(productColors) as ColorKey[])
        .filter((key) => colorCounts.has(key))
        .map((key) => ({
          value: key,
          label: productColors[key].label,
          count: colorCounts.get(key)!,
          swatch: productColors[key].hex,
        })),
      origins: toOptions(countBy(scope, (item) => item.origin)),
      availability: toOptions(
        countBy(scope, (item) => item.availability),
        (value) => availabilityLabels[value as Availability],
      ),
    },
  };
}

export async function searchProducts(
  query: string,
  limit = 5,
): Promise<StoreProduct[]> {
  const trimmed = query.trim().slice(0, 80);
  return trimmed
    ? (await loadProducts())
        .filter((item) => matches(item, trimmed))
        .slice(0, limit)
    : [];
}

export async function getProduct(id: string): Promise<StoreProduct | null> {
  const row = await productRepo.findProduct(id);
  return row ? (await toStoreProducts([row]))[0] : null;
}
