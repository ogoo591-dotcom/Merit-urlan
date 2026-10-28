"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminSupabase } from "@/lib/auth";
import { productImageBucket } from "@/lib/supabase";

export type ProductFormState = { error?: string };

const maxImageBytes = 5 * 1024 * 1024;

function text(formData: FormData, name: string, max = 500) {
  return String(formData.get(name) ?? "").trim().slice(0, max);
}

function wholeNumber(formData: FormData, name: string) {
  const value = Number(formData.get(name));
  return Number.isInteger(value) && value >= 0 ? value : null;
}

function refreshShop() {
  revalidatePath("/admin", "layout");
  revalidatePath("/shop", "layout");
}

export async function saveProduct(_state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const supabase = await getAdminSupabase();
  const existingSlug = text(formData, "existing_slug", 120);
  const slug = existingSlug || text(formData, "slug", 120).toLowerCase();
  const price = wholeNumber(formData, "price");
  const stock = wholeNumber(formData, "stock");
  const category = text(formData, "category");

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Код (slug) зөвхөн латин жижиг үсэг, тоо, зураас (-) агуулна. Жишээ: bor-tovch-12mm" };
  }
  if (!text(formData, "name")) return { error: "Барааны нэрийг оруулна уу." };
  if (category !== "supplies" && category !== "finished") return { error: "Ангилал сонгоно уу." };
  if (price === null || stock === null) return { error: "Үнэ, үлдэгдэл нь 0 буюу түүнээс их бүхэл тоо байна." };

  let image = text(formData, "current_image", 1000);
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "Зөвхөн зураг оруулна уу." };
    if (file.size > maxImageBytes) return { error: "Зураг 5MB-аас бага байх ёстой." };

    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${slug}-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(productImageBucket)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) return { error: `Зураг хадгалахад алдаа гарлаа: ${uploadError.message}` };
    image = supabase.storage.from(productImageBucket).getPublicUrl(path).data.publicUrl;
  }
  if (!image) return { error: "Барааны зураг оруулна уу." };

  const record = {
    name: text(formData, "name", 200),
    category,
    subcategory: text(formData, "subcategory", 120),
    price,
    stock,
    brand: text(formData, "brand", 120) || "-",
    image,
    description: text(formData, "description", 4000),
    badge: text(formData, "badge", 60) || null,
    features: text(formData, "features", 4000)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    group_slug: text(formData, "group_slug", 120) || null,
    option_label: text(formData, "option_label", 120) || null,
    sort_order: wholeNumber(formData, "sort_order") ?? 0,
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = existingSlug
    ? await supabase.from("products").update(record).eq("slug", existingSlug)
    : await supabase.from("products").insert({ slug, ...record });

  if (error) {
    if (error.code === "23505") return { error: "Ийм кодтой бараа аль хэдийн байна." };
    return { error: `Хадгалахад алдаа гарлаа: ${error.message}` };
  }

  refreshShop();
  redirect("/admin/products?saved=1");
}

export async function updateStock(formData: FormData) {
  const supabase = await getAdminSupabase();
  const stock = wholeNumber(formData, "stock");
  if (stock === null) return;
  await supabase
    .from("products")
    .update({ stock, updated_at: new Date().toISOString() })
    .eq("slug", text(formData, "slug", 120));
  refreshShop();
}

export async function toggleActive(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase
    .from("products")
    .update({ is_active: formData.get("is_active") === "true", updated_at: new Date().toISOString() })
    .eq("slug", text(formData, "slug", 120));
  refreshShop();
}

export async function deleteProduct(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase.from("products").delete().eq("slug", text(formData, "slug", 120));
  refreshShop();
  redirect("/admin/products");
}
