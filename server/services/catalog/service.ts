import "server-only";

import * as brandRepo from "@/server/repository/catalog/brand";
import * as categoryRepo from "@/server/repository/catalog/category";
import * as productRepo from "@/server/repository/catalog/product";
import * as productColorRepo from "@/server/repository/catalog/product-color";
import * as productImageRepo from "@/server/repository/catalog/product-image";
import { transaction } from "@/server/repository/transaction";
import type { StoreProduct } from "@/types/catalog";

// Бараа, материал засах (админ).

// Монгол нэрээр ирсэн ангилал/дэд ангиллыг md_category-ийн id болгоно.
async function resolveCategoryId(product: StoreProduct) {
  const categories = await categoryRepo.listCategories();
  const top = categories.find(
    (item) =>
      item.type === product.type &&
      !item.parentId &&
      item.name === product.category,
  );
  const target = product.subcategory
    ? categories.find(
        (item) =>
          item.parentId === top?.id && item.name === product.subcategory,
      )
    : top;
  if (!target)
    throw new Error(
      `"${product.category}${product.subcategory ? ` / ${product.subcategory}` : ""}" ангилал олдсонгүй.`,
    );
  return target.id;
}

export async function saveProduct(product: StoreProduct, originalId?: string) {
  const categoryId = await resolveCategoryId(product);
  await transaction(async (tx) => {
    const brandId = product.brand
      ? (await brandRepo.upsertBrandByName(product.brand, tx)).id
      : null;
    const values = {
      type: product.type,
      categoryId,
      brandId,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      availability: product.availability,
      leadDays: product.leadDays ?? null,
      origin: product.origin ?? null,
    };
    const id = originalId ?? product.id;
    if (originalId) {
      await productRepo.updateProduct(id, values, tx);
    } else {
      if (await productRepo.productIdExists(id, tx))
        throw new Error("Энэ ID-тай бараа аль хэдийн байна.");
      await productRepo.insertProducts([{ id, ...values }], tx);
    }
    await productImageRepo.deleteImagesByProduct(id, tx);
    await productImageRepo.insertProductImages(
      product.images.map((path, position) => ({
        productId: id,
        path,
        position,
      })),
      tx,
    );
    await productColorRepo.deleteColorsByProduct(id, tx);
    await productColorRepo.insertProductColors(
      [...new Set(product.colors ?? [])].map((colorKey) => ({
        productId: id,
        colorKey,
      })),
      tx,
    );
  });
}

// Захиалга, материалын холбоос эвдрэхгүйн тулд мөрийг устгахгүй, deleted_at тэмдэглэнэ.
export async function deleteProduct(id: string) {
  await productRepo.softDeleteProduct(id);
}

export async function setProductStock(id: string, stock: number) {
  await productRepo.updateProduct(id, {
    stock: Math.max(0, Math.floor(stock)),
  });
}
