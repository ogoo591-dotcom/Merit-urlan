import Link from "next/link";

import { CatalogProductCard } from "@/components/catalog-product-card";
import { ShopBreadcrumb } from "@/components/shop-breadcrumb";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listCatalogItems } from "@/lib/products";
import { shopCategoryMeta } from "@/lib/site-data";

type ShopPageProps = {
  searchParams?: Promise<{ search?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const searchQuery = params?.search?.trim() ?? "";
  const catalogItems = await listCatalogItems();
  const visibleItems = searchQuery
    ? catalogItems.filter((item) => {
        const query = searchQuery.toLowerCase();

        return [item.name, item.subcategory, item.description].some((value) =>
          value.toLowerCase().includes(query),
        );
      })
    : catalogItems;

  const yarnItems = visibleItems.filter(
    (item) => item.category === "supplies" && item.subcategory === "Синель утас"
  );
  const supplyItems = visibleItems.filter(
    (item) => item.category === "supplies" && item.subcategory !== "Синель утас"
  );
  const finishedItems = visibleItems.filter((item) => item.category === "finished");

  const shopSections = [
    {
      id: "yarn",
      title: "Нэхмэлийн утас",
      icon: "◉",
      tint: "#3f4752",
      description: "Синель утас, зөөлөн өнгөний сонголтууд, бүтээлээ эхлүүлэх үндсэн материалууд.",
      items: yarnItems,
      hrefPrefix: "/shop/supplies",
    },
    {
      id: "supplies",
      title: "Туслах материал",
      icon: "✂",
      tint: "#3f4752",
      description: "Товч, хэрэгсэл, жижиг деталь болон сүлжмэл ажлын дагалдах сонголтууд.",
      items: supplyItems,
      hrefPrefix: "/shop/supplies",
    },
    {
      id: "finished",
      title: "Бэлэн бүтээгдэхүүн",
      icon: "⌂",
      tint: "#f39200",
      description: "Гараар урласан тоглоом, багц, бэлэглэхэд бэлэн дууссан бүтээлүүд.",
      items: finishedItems,
      hrefPrefix: "/shop/finished",
    },
  ] as const;

  return (
    <>
      <SiteHeader />
      <main className="bg-[#fbf7f6] text-stone-900">
        <ShopBreadcrumb
          crumbs={[
            { label: "⌂ Нүүр", href: "/" },
            { label: "Дэлгүүр", active: true },
          ]}
        />

        <section className="border-b border-[#ebe0d4] bg-white">
          <div className="mx-auto grid w-full max-w-[1800px] gap-4 px-6 py-6 lg:grid-cols-3 lg:px-12">
            {shopSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center justify-center gap-4 rounded-[1.6rem] border border-[#ebe0d4] bg-[#fffdfa] px-6 py-6 text-center transition hover:bg-[#faf5ef]"
              >
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: section.tint }}
                >
                  {section.icon}
                </span>
                <span
                  className="text-[12px] font-semibold tracking-tight"
                  style={{ color: section.tint }}
                >
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1800px] px-6 py-14 lg:px-12 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#b58d64]">Shop Overview</p>
            <h1 className="mt-5 text-[40px] font-bold tracking-tight text-[#2f1f28] lg:text-[48px]">
              {searchQuery ? `«${searchQuery}» хайлтын үр дүн` : "Дэлгүүрийн ангиллуудаа тус тусад нь үзээрэй"}
            </h1>
            <p className="mt-5 text-[12px] leading-10 text-[#8d6d76]">
              {searchQuery
                ? `${visibleItems.length} бараа олдлоо.`
                : "Нэхмэлийн утас, туслах материал, бэлэн бүтээгдэхүүн гэсэн 3 урсгалаар ялгаад, section бүр дээрээ холбогдох бараануудыг шууд хардаг болголоо."}
            </p>
          </div>

          <div className="mt-14 space-y-20">
            {shopSections.filter((section) => !searchQuery || section.items.length > 0).map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#b58d64]">
                      {section.id === "yarn"
                        ? "Yarn Collection"
                        : section.id === "supplies"
                          ? shopCategoryMeta.supplies.heroEyebrow
                          : shopCategoryMeta.finished.heroEyebrow}
                    </p>
                    <h2 className="mt-3 text-[32px] font-bold tracking-tight text-[#2f1f28] lg:text-[40px]">
                      {section.title}
                    </h2>
                    <p className="mt-4 max-w-3xl text-[12px] leading-9 text-[#8d6d76]">
                      {section.description}
                    </p>
                  </div>
                  <Link
                    href={section.id === "finished" ? shopCategoryMeta.finished.href : shopCategoryMeta.supplies.href}
                    className="inline-flex w-fit rounded-full border border-[#d8c3af] px-6 py-3 text-[12px] font-semibold text-[#7e5f44] transition hover:bg-[#fff7ee]"
                  >
                    Ангилал руу орох
                  </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {section.items.map((item) => (
                    <CatalogProductCard
                      key={item.slug}
                      item={item}
                      href={`${section.hrefPrefix}/${item.slug}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
