"use server";

import { searchProducts } from "@/server/modules/catalog/queries";

export async function searchCatalog(query: string) {
  return searchProducts(String(query));
}
