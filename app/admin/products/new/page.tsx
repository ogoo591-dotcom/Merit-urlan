import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";

export const runtime = "edge";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div>
      <Link href="/admin/products" className="text-[12px] text-[#7a6b63] hover:text-[#2f2420]">← Бараа бүтээгдэхүүн</Link>
      <h1 className="mt-3 text-[24px] font-semibold">Шинэ бараа нэмэх</h1>
      <ProductForm />
    </div>
  );
}
