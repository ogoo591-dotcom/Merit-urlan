"use server";

import { redirect } from "next/navigation";

import { runAdminAction, runAdminForm } from "@/server/shared/admin-action";
import { int, money, slugify, text } from "@/server/shared/form";
import { uploadImages } from "@/server/shared/upload";
import { deleteProduct, saveProduct, setProductStock } from "@/server/services/catalog/service";
import { getProduct } from "@/server/services/catalog/queries";
import { productColors, type Availability, type ColorKey, type Origin, type ProductType, type StoreProduct } from "@/types/catalog";
import type { FormState } from "@/types/forms";

export async function saveProductAction(_state: FormState, formData: FormData): Promise<FormState> {
  const type = text(formData, "type") as ProductType;
  const result = await runAdminForm(async () => {
    const originalId = text(formData, "originalId", 100) || undefined;
    const name = text(formData, "name", 120);
    const id = originalId ?? slugify(text(formData, "id", 60), "item");
    const availability = text(formData, "availability") as Availability;
    const price = money(formData, "price");
    const stock = int(formData, "stock");
    const leadDays = int(formData, "leadDays");
    const origin = text(formData, "origin") as Origin | "";
    const category = text(formData, "category", 60);
    const subcategory = text(formData, "subcategory", 60);
    const brand = text(formData, "brand", 60);
    const colors = [...new Set(formData.getAll("colors").map(String))].filter((key): key is ColorKey => key in productColors);

    if (!name || !category) return "Нэр, ангиллаа бөглөнө үү.";
    if (!["product", "material"].includes(type)) return "Төрөл буруу байна.";
    if (!["ready", "made_to_order"].includes(availability)) return "Бэлэн байдал буруу байна.";
    if (!Number.isFinite(price) || price < 0) return "Үнэ буруу байна.";
    if (!Number.isInteger(stock) || stock < 0) return "Үлдэгдэл 0 эсвэл түүнээс их бүхэл тоо байна.";
    if (availability === "made_to_order" && (!Number.isInteger(leadDays) || leadDays < 1)) {
      return "Захиалгаар хийх бол бэлэн болох хоногийг оруулна уу.";
    }

    const uploaded = await uploadImages(formData.getAll("images"), type === "material" ? "materials" : "products");
    const images = [...formData.getAll("keepImages").map(String), ...uploaded].slice(0, 8);
    if (!images.length) return "Дор хаяж нэг зураг оруулна уу.";

    const product: StoreProduct = {
      id,
      name,
      description: text(formData, "description", 2000),
      price,
      images,
      category,
      type,
      stock,
      availability,
      ...(availability === "made_to_order" ? { leadDays } : {}),
      ...(subcategory ? { subcategory } : {}),
      ...(brand ? { brand } : {}),
      ...(colors.length ? { colors } : {}),
      ...(type === "material" && origin ? { origin } : {}),
    };
    await saveProduct(product, originalId);
  });
  if (result) return result;
  redirect(`/admin/products?type=${type}&saved=1`);
}

export async function updateStockAction(formData: FormData) {
  const stock = int(formData, "stock");
  if (!Number.isInteger(stock) || stock < 0) return;
  await runAdminAction(() => setProductStock(String(formData.get("id")), stock), "/");
}

export async function deleteProductAction(formData: FormData) {
  const product = await getProduct(String(formData.get("id")));
  if (!product) return;
  await runAdminAction(() => deleteProduct(product.id), "/");
  redirect(`/admin/products?type=${product.type}&deleted=1`);
}
