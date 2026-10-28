import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ProductOptionCard } from "@/components/product-option-card";
import { ProductPurchaseControls } from "@/components/product-purchase-controls";
import { ShopBreadcrumb } from "@/components/shop-breadcrumb";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { findCatalogItem } from "@/lib/products";
import { shopCategoryMeta, type ShopCategoryKey } from "@/lib/site-data";

export const runtime = "edge";

type ProductDetailPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

function isCategoryKey(value: string): value is ShopCategoryKey {
  return value === "supplies" || value === "finished";
}

function formatCode(slug: string) {
  return slug.replace(/-/g, " ").toUpperCase();
}

function getCountryLabel(category: ShopCategoryKey) {
  return category === "supplies" ? "Турк" : "Монгол";
}

function getSectionCrumb(category: ShopCategoryKey, subcategory: string) {
  if (category === "finished") {
    return { label: "Бэлэн бүтээгдэхүүн", href: "/shop#finished" };
  }

  if (subcategory === "Синель утас") {
    return { label: "Нэхмэлийн утас", href: "/shop#yarn" };
  }

  return { label: "Туслах материал", href: "/shop#supplies" };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  if (!isCategoryKey(category)) return {};
  const item = await findCatalogItem(category, slug);
  if (!item) return {};
  return {
    title: `${item.name} | Merit Urlan`,
    description: item.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { category, slug } = await params;
  if (!isCategoryKey(category)) notFound();

  const item = await findCatalogItem(category, slug);
  if (!item) notFound();

  const metaChips = [
    `Үлдэгдэл ${item.stock} ш`,
    `Код ${formatCode(item.slug)}`,
    `Брэнд ${item.brand === "-" ? "Merit Urlan" : item.brand}`,
    `Улс ${getCountryLabel(category)}`,
  ];

  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <ShopBreadcrumb
          crumbs={[
            { label: "⌂ Нүүр", href: "/" },
            { label: "Дэлгүүр", href: "/shop" },
            getSectionCrumb(category, item.subcategory),
            { label: item.subcategory, href: shopCategoryMeta[category].href, active: true },
            { label: item.name },
          ]}
        />

        <section className="mx-auto w-full max-w-[1800px] px-6 py-16 lg:px-12">
          {item.options?.length ? (
            <div id="product-options">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <p className="flex items-center gap-3 text-[12px] font-semibold text-[#6e6e6e]">
                  <span>🎨</span> Сонголтууд ({item.options.length})
                </p>
                <a href="#product-options" className="w-fit rounded-xl border border-[#9aa5b1] px-6 py-3 text-[12px] font-medium text-[#4b5563] transition hover:bg-[#f7f7f7]">
                  Бүгдийг харах
                </a>
              </div>
              <div className="-mx-2 overflow-x-auto px-2 pb-2">
                <div className="flex gap-4">
                  {item.options.map((option) => (
                    <ProductOptionCard
                      key={option.slug}
                      href={`/shop/${category}/${option.slug}`}
                      image={option.image}
                      name={option.name}
                      price={option.price}
                      stock={option.stock}
                      selected={option.slug === item.slug}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-10 grid gap-12 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[2.5rem] bg-[#fcfaf8] ring-1 ring-[#ece4dd]">
              <Image
                src={item.image}
                alt={item.name}
                width={900}
                height={1100}
                className="h-full min-h-[32rem] w-full object-contain p-8 lg:p-12"
              />
            </div>

            <div className="xl:pt-6">
              <h1 className="text-[40px] font-bold leading-[0.92] tracking-tight text-black lg:text-[68px]">
                {item.name}
              </h1>
              <div className="mt-6 flex flex-wrap gap-3">
                {metaChips.map((chip) => (
                  <div
                    key={chip}
                    className="rounded-2xl border border-[#dfe3e6] bg-[#f8f9fa] px-5 py-3 text-[12px] font-medium text-[#6c757d]"
                  >
                    {chip}
                  </div>
                ))}
              </div>

              <div className="mt-10 space-y-8">
                <div className="flex items-center justify-between rounded-[1.7rem] border border-[#dfe3e6] px-6 py-7">
                  <span className="text-[12px] font-semibold text-[#495057]">Үнэ:</span>
                  <span className="text-[12px] font-bold text-[#f59b17]">{item.price}</span>
                </div>

                <ProductPurchaseControls item={item} />

                <div className="rounded-[2rem] border border-[#ecd8de] bg-[#fffafb] p-8 lg:p-10">
                  <p className="text-[12px] font-semibold text-[#3d4651]">Тайлбар</p>
                  <p className="mt-5 text-[12px] leading-8 text-[#6c7380] lg:leading-10">
                    {item.description}
                  </p>

                  <div className="mt-12">
                    <p className="text-[12px] uppercase tracking-[0.08em] text-[#9f7b84]">Онцлог</p>
                    <div className="mt-8 space-y-5 text-[12px] text-[#425066]">
                      {(item.features ?? [
                        "Нэг бүрчлэн шалгаж бэлтгэсэн чанартай бүтээгдэхүүн.",
                        "Захиалгын дараа хүргэлт болон сонголтын баталгаажуулалт хийгдэнэ.",
                        "Messenger болон Instagram-аар нэмэлт мэдээлэл авах боломжтой.",
                      ]).map((feature) => (
                        <div key={feature} className="flex items-start gap-4 lg:gap-5">
                          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7dde2] text-[#b04a61] lg:h-12 lg:w-12">
                            ✓
                          </span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
