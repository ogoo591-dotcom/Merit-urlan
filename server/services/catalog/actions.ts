"use server";

import { searchProducts } from "@/server/services/catalog/queries";

export async function searchCatalog(query: string) {
  return searchProducts(String(query));
}
