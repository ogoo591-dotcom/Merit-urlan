import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteProductAction } from "@/app/admin/products/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getProduct, getProducts } from "@/lib/data/products";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const product = await getProduct((await params).id);
  if (!product) notFound();
  const categories = [...new Set((await getProducts({})).map((item) => item.category))];

  return (
    <div>
      <Link href={`/admin/products?type=${product.type}`} className="text-[12px] text-[#7a6b63] hover:text-[#a24456]">← Буцах</Link>
      <div className="mt-3">
        <PageHeader
          title={product.name}
          action={
            <form action={deleteProductAction}>
              <input type="hidden" name="id" value={product.id} />
              <ConfirmButton
                message={`"${product.name}"-г устгах уу? Буцаах боломжгүй.`}
                className="rounded-xl border border-[#e8b4b4] px-4 py-2 text-[12px] font-semibold text-[#a33a3a] hover:bg-[#fdf3f3]"
              >
                Устгах
              </ConfirmButton>
            </form>
          }
        />
      </div>
      <ProductForm product={product} defaultType={product.type} categories={categories} />
    </div>
  );
}
