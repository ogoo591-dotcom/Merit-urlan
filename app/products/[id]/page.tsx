import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductDetailView } from "@/features/catalog/components/product-detail";
import { getProduct } from "@/server/modules/catalog/queries";

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
