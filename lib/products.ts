import "server-only";

import { catalogItems, getCatalogItem as getStaticCatalogItem, type CatalogItem, type ShopCategoryKey } from "@/lib/site-data";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export type ProductRow = {
  slug: string;
  name: string;
  category: ShopCategoryKey;
  subcategory: string;
  price: number;
  stock: number;
  brand: string;
  image: string;
  description: string;
  badge: string | null;
  features: string[];
  group_slug: string | null;
  option_label: string | null;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
};

export function formatPrice(value: number) {
  return `${value.toLocaleString("en-US")}₮`;
}

function toCatalogItem(row: ProductRow, siblings: ProductRow[] = []): CatalogItem {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    price: formatPrice(row.price),
    priceValue: row.price,
    stock: row.stock,
    brand: row.brand,
    image: row.image,
    description: row.description,
    badge: siblings.length > 1 ? `${siblings.length} сонголт` : (row.badge ?? undefined),
    features: row.features.length ? row.features : undefined,
    options:
      siblings.length > 1
        ? siblings.map((option) => ({
            slug: option.slug,
            name: option.option_label ?? option.name,
            price: formatPrice(option.price),
            stock: option.stock,
            image: option.image,
          }))
        : undefined,
  };
}

// Хувилбартай бараа жагсаалтад нэг л удаа (бүлгийн эхнийх нь) харагдана.
function collapseGroups(rows: ProductRow[]) {
  const groups = new Map<string, ProductRow[]>();
  for (const row of rows) {
    if (!row.group_slug) continue;
    groups.set(row.group_slug, [...(groups.get(row.group_slug) ?? []), row]);
  }

  const seen = new Set<string>();
  const items: CatalogItem[] = [];
  for (const row of rows) {
    if (!row.group_slug) {
      items.push(toCatalogItem(row));
      continue;
    }
    if (seen.has(row.group_slug)) continue;
    seen.add(row.group_slug);
    items.push(toCatalogItem(row, groups.get(row.group_slug)));
  }
  return items;
}

async function fetchActiveRows(category?: ShopCategoryKey) {
  let query = getSupabase().from("products").select("*").eq("is_active", true).order("sort_order");
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data as ProductRow[];
}

// Supabase тохируулаагүй үед site-data.ts дахь хуучин өгөгдлөөр ажиллана.
export async function listCatalogItems(category?: ShopCategoryKey) {
  if (!isSupabaseConfigured()) {
    return category ? catalogItems.filter((item) => item.category === category) : catalogItems;
  }
  return collapseGroups(await fetchActiveRows(category));
}

export async function findCatalogItem(category: ShopCategoryKey, slug: string) {
  if (!isSupabaseConfigured()) return getStaticCatalogItem(category, slug);

  const supabase = getSupabase();
  const { data: row, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("category", category)
    .eq("is_active", true)
    .maybeSingle<ProductRow>();
  if (error) throw error;
  if (!row) return undefined;

  if (!row.group_slug) return toCatalogItem(row);

  const { data: siblings, error: siblingsError } = await supabase
    .from("products")
    .select("*")
    .eq("group_slug", row.group_slug)
    .eq("is_active", true)
    .order("sort_order");
  if (siblingsError) throw siblingsError;
  return toCatalogItem(row, siblings as ProductRow[]);
}

export async function searchCatalogItems(query: string, limit = 4) {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const items = await listCatalogItems();
  return items
    .filter((item) =>
      [item.name, item.subcategory, item.description].some((value) => value.toLowerCase().includes(term)),
    )
    .slice(0, limit);
}
