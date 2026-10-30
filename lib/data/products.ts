import "server-only";

import { formatPrice } from "@/lib/format";
import { readDb, updateDb } from "@/lib/mock/db";
import type { ProductType, StoreProduct } from "@/lib/mock/products";

// Бараа, материал. Одоогоор mock сан (.mock-db), дараа нь зөвхөн эдгээр функцын дотор талыг Supabase руу солино.

export type { Availability, Origin, ProductType, StoreProduct } from "@/lib/mock/products";
export { formatPrice };

export type ProductSort = "default" | "price_asc" | "price_desc";

function matches(item: StoreProduct, query: string) {
  const text = `${item.name} ${item.category} ${item.description}`.toLowerCase();
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
  if (sort === "price_asc") return items.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return items.sort((a, b) => b.price - a.price);
  return items;
}

export async function searchProducts(query: string, limit = 5): Promise<StoreProduct[]> {
  const trimmed = query.trim().slice(0, 80);
  return trimmed ? (await readDb()).products.filter((item) => matches(item, trimmed)).slice(0, limit) : [];
}

export async function getProduct(id: string): Promise<StoreProduct | null> {
  return (await readDb()).products.find((item) => item.id === id) ?? null;
}

export async function getCategories(type: ProductType): Promise<Array<{ name: string; count: number }>> {
  const counts = new Map<string, number>();
  for (const item of (await readDb()).products) {
    if (item.type === type) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return [...counts].map(([name, count]) => ({ name, count }));
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
