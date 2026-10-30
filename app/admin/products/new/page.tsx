import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/data/products";

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  await requireAdmin();
  const type = (await searchParams).type === "material" ? "material" : "product";
  const categories = [...new Set((await getProducts({})).map((item) => item.category))];

  return (
    <div>
      <Link href={`/admin/products?type=${type}`} className="text-[12px] text-[#7a6b63] hover:text-[#a24456]">← Буцах</Link>
      <div className="mt-3">
        <PageHeader title={type === "product" ? "Шинэ бүтээгдэхүүн" : "Шинэ материал"} />
      </div>
      <ProductForm defaultType={type} categories={categories} />
    </div>
  );
}
