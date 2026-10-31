"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { deleteProduct, getProduct, saveProduct, setProductStock } from "@/lib/data/products";
import { saveImageUpload } from "@/lib/data/uploads";
import { productColors, type Availability, type ColorKey, type Origin, type ProductType, type StoreProduct } from "@/lib/mock/products";

export type FormState = { error?: string };

const text = (formData: FormData, name: string, max = 300) => String(formData.get(name) ?? "").trim().slice(0, max);
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export async function saveProductAction(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const originalId = text(formData, "originalId", 100) || undefined;
  const name = text(formData, "name", 120);
  const id = originalId ?? (slugify(text(formData, "id", 60)) || `item-${Date.now().toString(36)}`);
  const type = text(formData, "type") as ProductType;
  const availability = text(formData, "availability") as Availability;
  const price = Math.round(Number(formData.get("price")));
  const stock = Math.floor(Number(formData.get("stock")));
  const leadDays = Math.floor(Number(formData.get("leadDays")));
  const origin = text(formData, "origin") as Origin | "";
  const category = text(formData, "category", 60);
  const subcategory = text(formData, "subcategory", 60);
  const brand = text(formData, "brand", 60);
  const colors = [...new Set(formData.getAll("colors").map(String))].filter((key): key is ColorKey => key in productColors);

  if (!name || !category) return { error: "Нэр, ангиллаа бөглөнө үү." };
  if (!["product", "material"].includes(type)) return { error: "Төрөл буруу байна." };
  if (!["ready", "made_to_order"].includes(availability)) return { error: "Бэлэн байдал буруу байна." };
  if (!Number.isFinite(price) || price < 0) return { error: "Үнэ буруу байна." };
  if (!Number.isInteger(stock) || stock < 0) return { error: "Үлдэгдэл 0 эсвэл түүнээс их бүхэл тоо байна." };
  if (availability === "made_to_order" && (!Number.isInteger(leadDays) || leadDays < 1)) {
    return { error: "Захиалгаар хийх бол бэлэн болох хоногийг оруулна уу." };
  }

  let images = formData.getAll("keepImages").map(String);
  try {
    for (const file of formData.getAll("images")) {
      if (file instanceof File && file.size > 0) images.push(await saveImageUpload(file));
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Зураг хадгалахад алдаа гарлаа." };
  }
  images = images.slice(0, 8);
  if (!images.length) return { error: "Дор хаяж нэг зураг оруулна уу." };

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

  try {
    await saveProduct(product, originalId);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Хадгалахад алдаа гарлаа." };
  }
  revalidatePath("/", "layout");
  redirect(`/admin/products?type=${type}&saved=1`);
}

export async function updateStockAction(formData: FormData) {
  await requireAdmin();
  const stock = Math.floor(Number(formData.get("stock")));
  if (!Number.isInteger(stock) || stock < 0) return;
  await setProductStock(String(formData.get("id")), stock);
  revalidatePath("/", "layout");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const product = await getProduct(String(formData.get("id")));
  if (!product) return;
  await deleteProduct(product.id);
  revalidatePath("/", "layout");
  redirect(`/admin/products?type=${product.type}&deleted=1`);
}
