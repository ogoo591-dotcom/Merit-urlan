import { NextResponse } from "next/server";

import { listCatalogItems } from "@/lib/products";
import type { ShopCategoryKey } from "@/lib/site-data";

export const runtime = "edge";

// Цэсний "Категори" цонхонд харагдах дэд ангиллууд (барааны тоотой).
export async function GET() {
  const items = await listCatalogItems();
  const menu: Record<ShopCategoryKey, Array<{ name: string; count: number }>> = { supplies: [], finished: [] };

  for (const item of items) {
    if (!item.subcategory) continue;
    const list = menu[item.category];
    const entry = list.find((sub) => sub.name === item.subcategory);
    if (entry) entry.count += 1;
    else list.push({ name: item.subcategory, count: 1 });
  }

  return NextResponse.json(menu, { headers: { "Cache-Control": "public, max-age=60" } });
}
