import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CatalogView, type CatalogSearchParams } from "@/features/catalog/components/catalog-view";

export const metadata: Metadata = { title: "Бүтээгдэхүүн | Merit Urlan" };

export default async function Page({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0]">
        <CatalogView type="product" searchParams={await searchParams} />
      </main>
      <SiteFooter />
    </>
  );
}
