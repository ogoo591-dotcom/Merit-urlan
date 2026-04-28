import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogProductCard } from "@/components/catalog-product-card";
import { ShopBreadcrumb } from "@/components/shop-breadcrumb";
import { ShopHero } from "@/components/shop-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogItems, homeStats, shopCategoryMeta, type ShopCategoryKey } from "@/lib/site-data";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export const runtime = "edge";

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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!isCategoryKey(category)) notFound();

  const meta = shopCategoryMeta[category];
  const items = getCatalogItems(category);

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

        <section className="mx-auto w-full max-w-[1800px] px-6 py-16 lg:px-12">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-4xl font-bold text-[#2f1f28] lg:text-5xl">{meta.label}</h2>
              <p className="mt-3 text-xl text-[#7f8994]">
                {category === "supplies"
                  ? "Гар урлал, сүлжмэл, чимэглэлийн материалууд"
                  : "Гараар урласан тоглоом, багц, бэлгийн бэлэн бүтээгдэхүүнүүд"}
              </p>
            </div>
            <div className="rounded-xl bg-[#f5f6f8] px-5 py-4 text-xl text-[#7f8994]">Эрэмбэлэх ▾</div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <CatalogProductCard
                key={item.slug}
                item={item}
                href={`/shop/${category}/${item.slug}`}
              />
            ))}
          </div>

          {category === "finished" ? (
            <div className="mt-16 rounded-[2rem] border border-[#ecd8de] bg-[#fffafb] p-8 lg:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                <button className="rounded-[1.6rem] border-4 border-[#b04a61] px-8 py-7 text-3xl font-semibold text-[#b04a61] transition hover:bg-[#fff3f6]">
                  Сагслах
                </button>
                <button className="rounded-[1.6rem] bg-[#b04a61] px-8 py-7 text-3xl font-semibold text-white transition hover:bg-[#9c3e53]">
                  Худалдан авах
                </button>
              </div>

              <div className="mt-16">
                <p className="text-3xl uppercase tracking-[0.08em] text-[#9f7b84]">Онцлог</p>
                <div className="mt-8 space-y-5 text-2xl text-[#425066]">
                  {[
                    "Шууд татаан авах боломжтой",
                    "Нэг удаагийн төлбөр",
                    "Мэргэжлийн баг боловсруулсан",
                    "24/7 хэрэглэгчийн үйлчилгээ",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7dde2] text-[#b04a61]">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
