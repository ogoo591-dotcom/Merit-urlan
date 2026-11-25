import "server-only";

import { updateDb } from "@/server/mock/db";
import type { StoreProduct } from "@/types/catalog";

// Бараа, материал засах (админ).

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
