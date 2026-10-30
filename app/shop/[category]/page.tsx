import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogProductCard } from "@/components/catalog-product-card";
import { ShopBreadcrumb } from "@/components/shop-breadcrumb";
import { ShopHero } from "@/components/shop-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listCatalogItems } from "@/lib/products";
import { homeStats, shopCategoryMeta, type ShopCategoryKey } from "@/lib/site-data";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string }>;
};

function isCategoryKey(value: string): value is ShopCategoryKey {
  return value === "supplies" || value === "finished";
}

function getCategoryCrumb(category: ShopCategoryKey) {
  if (category === "finished") {
    return { label: "Бэлэн бүтээгдэхүүн", href: "/shop#finished", active: true };
  }

  return { label: "Туслах материал", href: "/shop#supplies", active: true };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isCategoryKey(category)) return {};
  const meta = shopCategoryMeta[category];
  return {
    title: `${meta.label} | Merit Urlan`,
    description: meta.heroDescription,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { sub } = await searchParams;
  if (!isCategoryKey(category)) notFound();

  const meta = shopCategoryMeta[category];
  const allItems = await listCatalogItems(category);
  const subcategories = [...new Set(allItems.map((item) => item.subcategory).filter(Boolean))];
  const activeSub = sub && subcategories.includes(sub) ? sub : undefined;
  const items = activeSub ? allItems.filter((item) => item.subcategory === activeSub) : allItems;

  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <ShopHero
          meta={meta}
          stats={homeStats}
          illustration={category}
        />

        <ShopBreadcrumb
          crumbs={[
            { label: "⌂ Нүүр", href: "/" },
            { label: "Дэлгүүр", href: "/shop" },
            getCategoryCrumb(category),
          ]}
        />

        <section id="products" className="mx-auto w-full max-w-[1800px] scroll-mt-[var(--header-h,90px)] px-6 py-16 lg:px-12">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[32px] font-bold text-[#2f1f28] lg:text-[40px]">{meta.label}</h2>
              <p className="mt-3 text-[12px] text-[#7f8994]">
                {category === "supplies"
                  ? "Гар урлал, сүлжмэл, чимэглэлийн материалууд"
                  : "Гараар урласан тоглоом, багц, бэлгийн бэлэн бүтээгдэхүүнүүд"}
              </p>
            </div>
            <div className="rounded-xl bg-[#f5f6f8] px-5 py-4 text-[12px] text-[#7f8994]">Эрэмбэлэх ▾</div>
          </div>

          {subcategories.length > 1 ? (
            <div className="mb-10 flex flex-wrap gap-3">
              {[undefined, ...subcategories].map((name) => (
                <Link
                  key={name ?? "all"}
                  href={name ? `/shop/${category}?sub=${encodeURIComponent(name)}#products` : `/shop/${category}#products`}
                  className={`rounded-full px-5 py-2.5 text-[12px] transition ${
                    activeSub === name ? "bg-[#6e4f45] text-white" : "bg-[#f5f6f8] text-[#4a3b35] hover:bg-[#efe7e1]"
                  }`}
                >
                  {name ?? "Бүгд"}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <CatalogProductCard
                key={item.slug}
                item={item}
                href={`/shop/${category}/${item.slug}`}
              />
            ))}
          </div>

        </section>
      </main>
      <SiteFooter />
    </>
  );
}
