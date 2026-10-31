import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/data/products";

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  await requireAdmin();
  const type = (await searchParams).type === "material" ? "material" : "product";
  const all = await getProducts({});
  const unique = (values: Array<string | undefined>) => [...new Set(values.filter((value): value is string => Boolean(value)))];
  const categories = unique(all.map((item) => item.category));
  const subcategories = unique(all.map((item) => item.subcategory));
  const brands = unique(all.map((item) => item.brand));

  return (
    <div>
      <Link href={`/admin/products?type=${type}`} className="text-[12px] text-[#7a6b63] hover:text-[#a24456]">← Буцах</Link>
      <div className="mt-3">
        <PageHeader title={type === "product" ? "Шинэ бүтээгдэхүүн" : "Шинэ материал"} />
      </div>
      <ProductForm defaultType={type} categories={categories} subcategories={subcategories} brands={brands} />
    </div>
  );
}
