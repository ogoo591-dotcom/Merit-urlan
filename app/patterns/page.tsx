import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import { PatternCard } from "@/components/patterns/pattern-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { CatalogSearchParams } from "@/components/store/catalog-params";
import { ListingView, parseListingParams } from "@/components/store/listing-view";
import { getPatternCatalog } from "@/lib/data/patterns";
import { getPurchasedPatternIds } from "@/lib/data/purchases";

export const metadata: Metadata = { title: "Схем заавар | Merit Urlan" };

const sortOptions = [
  { value: "default", label: "Санал болгох" },
  { value: "new", label: "Шинэ" },
  { value: "price_asc", label: "Үнэ: багаас их" },
  { value: "price_desc", label: "Үнэ: ихээс бага" },
  { value: "name", label: "Нэрээр (А–Я)" },
];

export default async function PatternsPage({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  const state = parseListingParams(await searchParams, "access", sortOptions);
  const { userId } = await auth();
  const [catalog, purchased] = await Promise.all([
    getPatternCatalog({ category: state.category, levels: state.level, query: state.q, sort: state.sort, minPrice: state.min, maxPrice: state.max }),
    getPurchasedPatternIds(userId),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0]">
        <ListingView
          base="/patterns"
          title="Схем заавар"
          description="Үнэгүй схемийг шууд үзэж, төлбөртэйг нь төлбөр төлөөд авна. Авсан схем тань “Миний сан”-д хадгалагдана."
          unit="схем"
          categoryParam="access"
          state={state}
          catalog={catalog}
          sortOptions={sortOptions}
        >
          {catalog.items.map((pattern) => (
            <li key={pattern.id}>
              <PatternCard pattern={pattern} purchased={purchased.includes(pattern.id)} />
            </li>
          ))}
        </ListingView>
      </main>
      <SiteFooter />
    </>
  );
}
