import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductDetailView } from "@/components/store/product-detail";
import { getProduct } from "@/lib/data/products";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).id);
  return product ? { title: `${product.name} | Merit Urlan`, description: product.description } : {};
}

export default async function Page({ params }: Props) {
  const product = await getProduct((await params).id);
  if (!product || product.type !== "product") notFound();
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0]">
        <ProductDetailView product={product} />
      </main>
      <SiteFooter />
    </>
  );
}
