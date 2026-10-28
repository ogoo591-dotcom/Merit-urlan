import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteProduct } from "@/app/admin/products/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminSupabase } from "@/lib/auth";
import type { ProductRow } from "@/lib/products";

export const runtime = "edge";

type EditProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;
  const supabase = await getAdminSupabase();
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle<ProductRow>();
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-[12px] text-[#7a6b63] hover:text-[#2f2420]">← Бараа бүтээгдэхүүн</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[24px] font-semibold">{product.name}</h1>
        <div className="flex items-center gap-3">
          {product.is_active ? (
            <Link href={`/shop/${product.category}/${product.slug}`} target="_blank" className="text-[12px] text-[#6e4f45] underline">
              Сайт дээр харах
            </Link>
          ) : null}
          <form action={deleteProduct}>
            <input type="hidden" name="slug" value={product.slug} />
            <ConfirmButton
              message="Энэ барааг бүр мөсөн устгах уу? Түр нуух бол “Сайтад харуулах”-ыг унтраана уу."
              className="rounded-xl border border-[#e8c9c9] px-4 py-2 text-[12px] text-[#a04848] hover:bg-[#fbeaea]"
            >
              Устгах
            </ConfirmButton>
          </form>
        </div>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
