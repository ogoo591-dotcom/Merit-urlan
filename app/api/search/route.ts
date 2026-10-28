import { NextResponse } from "next/server";

import { searchCatalogItems } from "@/lib/products";

export const runtime = "edge";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const items = await searchCatalogItems(query.slice(0, 80));
  return NextResponse.json({ items });
}
