import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CatalogView, type CatalogSearchParams } from "@/components/store/catalog-view";

export const metadata: Metadata = { title: "Материал | Merit Urlan" };

export default async function Page({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0]">
        <CatalogView type="material" searchParams={await searchParams} />
      </main>
      <SiteFooter />
    </>
  );
}
