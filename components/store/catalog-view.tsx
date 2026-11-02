import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { ActiveFilters } from "@/components/store/active-filters";
import { list, price, single, type CatalogSearchParams } from "@/components/store/catalog-params";
import { CatalogSidebar } from "@/components/store/catalog-sidebar";
import { ProductCard } from "@/components/store/product-card";
import { storeMeta } from "@/components/store/store-paths";
import { getCatalog, type ColorKey, type ProductSort, type ProductType } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { productColors, type Availability, type Origin } from "@/lib/mock/products";

export const sortOptions: Array<{ value: ProductSort; label: string }> = [
  { value: "default", label: "Санал болгох" },
  { value: "price_asc", label: "Үнэ: багаас их" },
  { value: "price_desc", label: "Үнэ: ихээс бага" },
  { value: "name", label: "Нэрээр (А–Я)" },
];

export type { CatalogSearchParams };

// Бүтээгдэхүүн / Материалын жагсаалт (server). Ангилал, шүүлтүүр, эрэмбэ, хуудас бүгд URL-д хадгалагдана.
export async function CatalogView({ type, searchParams }: { type: ProductType; searchParams: CatalogSearchParams }) {
  const meta = storeMeta[type];
  const state = {
    category: single(searchParams.category),
    sub: single(searchParams.sub),
    q: single(searchParams.q),
    sort: sortOptions.find((option) => option.value === single(searchParams.sort))?.value ?? "default",
    brand: list(searchParams.brand),
    color: list(searchParams.color).filter((key): key is ColorKey => key in productColors),
    origin: list(searchParams.origin).filter((value): value is Origin => value === "Хятад" || value === "Турк"),
    avail: list(searchParams.avail).filter((value): value is Availability => value === "ready" || value === "made_to_order"),
    min: price(searchParams.min),
    max: price(searchParams.max),
    page: Math.max(1, Math.floor(Number(single(searchParams.page))) || 1),
  };

  const catalog = await getCatalog({
    type,
    category: state.category,
    subcategory: state.sub,
    brands: state.brand,
    colors: state.color,
    origins: state.origin,
    availability: state.avail,
    minPrice: state.min,
    maxPrice: state.max,
    query: state.q,
    sort: state.sort,
    page: state.page,
  });

  // Одоогийн төлвөөс зөвхөн өөрчилсөн хэсгийг сольж холбоос үүсгэнэ. Шүүлтүүр солигдоход 1-р хуудас руу буцна.
  const href = (next: Partial<typeof state>) => {
    const merged = { ...state, page: 1, ...next };
    const params = new URLSearchParams();
    if (merged.category) params.set("category", merged.category);
    if (merged.sub) params.set("sub", merged.sub);
    if (merged.q) params.set("q", merged.q);
    if (merged.sort !== "default") params.set("sort", merged.sort);
    for (const key of ["brand", "color", "origin", "avail"] as const) for (const value of merged[key]) params.append(key, value);
    if (merged.min !== undefined) params.set("min", String(merged.min));
    if (merged.max !== undefined) params.set("max", String(merged.max));
    if (merged.page > 1) params.set("page", String(merged.page));
    const query = params.toString();
    return query ? `${meta.base}?${query}` : meta.base;
  };

  const without = <K extends "brand" | "color" | "origin" | "avail">(key: K, value: string) =>
    href({ [key]: (state[key] as string[]).filter((item) => item !== value) } as Partial<typeof state>);
  const activeFilters = [
    ...state.brand.map((value) => ({ label: value, href: without("brand", value) })),
    ...state.color.map((value) => ({ label: productColors[value].label, href: without("color", value) })),
    ...state.origin.map((value) => ({ label: value, href: without("origin", value) })),
    ...state.avail.map((value) => ({ label: value === "ready" ? "Бэлэн" : "Захиалгаар", href: without("avail", value) })),
    ...(state.min !== undefined || state.max !== undefined
      ? [
          {
            label: `${state.min !== undefined ? formatPrice(state.min) : "0₮"} – ${state.max !== undefined ? formatPrice(state.max) : "∞"}`,
            href: href({ min: undefined, max: undefined }),
          },
        ]
      : []),
  ];
  const clearFilters = href({ brand: [], color: [], origin: [], avail: [], min: undefined, max: undefined });

  const allCount = catalog.categories.reduce((sum, item) => sum + item.count, 0);

  const from = catalog.total ? (catalog.page - 1) * catalog.perPage + 1 : 0;
  const to = Math.min(catalog.page * catalog.perPage, catalog.total);

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-6 pb-16 pt-8 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10 lg:px-[60px] lg:pt-10">
      <CatalogSidebar
        action={meta.base}
        query={state.q}
        allLink={{ label: "Бүгд", count: allCount, href: href({ category: undefined, sub: undefined }), active: !state.category && !state.sub }}
        categories={catalog.categories.map((item) => ({
          label: item.label,
          count: item.count,
          href: href({ category: item.value, sub: undefined }),
          active: state.category === item.value && !state.sub,
          subcategories: item.subcategories.map((sub) => ({
            label: sub.label,
            count: sub.count,
            href: href({ category: item.value, sub: sub.value }),
            active: state.category === item.value && state.sub === sub.value,
          })),
        }))}
        groups={[
          { name: "brand", title: "Брэнд", options: catalog.facets.brands },
          { name: "color", title: "Өнгө", options: catalog.facets.colors },
          { name: "origin", title: "Улс", options: catalog.facets.origins },
          { name: "avail", title: "Бэлэн байдал", options: catalog.facets.availability },
        ]}
        selected={{ brand: state.brand, color: state.color, origin: state.origin, avail: state.avail }}
        price={{ min: state.min, max: state.max }}
        keep={{ category: state.category, sub: state.sub, sort: state.sort === "default" ? undefined : state.sort }}
        clearHref={clearFilters}
        sortLinks={sortOptions.map((option) => ({ ...option, href: href({ sort: option.value }), active: option.value === state.sort }))}
      />

      <section className="min-w-0">
        <h1 className="font-serif text-[32px] leading-tight text-[#2f2420] lg:text-[40px]">{state.sub ?? state.category ?? meta.title}</h1>
        <p className="mt-2 text-[12px] text-[#7a6b63]">
          {meta.description} · <b className="text-[#2f2420]">{catalog.total}</b> бараа
        </p>
        {state.q ? (
          <p className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-[#4a3b35]">
            «{state.q}» хайлтын үр дүн
            <Link href={href({ q: undefined })} className="font-medium text-[#a24456] underline underline-offset-4">
              Хайлтыг арилгах
            </Link>
          </p>
        ) : null}

        <ActiveFilters filters={activeFilters} clearHref={clearFilters} />

        {catalog.items.length ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
            {catalog.items.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-[22px] border border-dashed border-[#e3d6cb] bg-white/60 px-6 py-16 text-center">
            <p className="text-[13px] font-semibold text-[#2f2420]">Тохирох бараа олдсонгүй</p>
            <p className="mt-2 text-[12px] text-[#7a6b63]">Шүүлтүүрээ өөрчилж эсвэл цэвэрлээд дахин үзээрэй.</p>
            <Link href={clearFilters} className="mt-4 inline-block text-[12px] font-medium text-[#a24456] underline underline-offset-4">
              Шүүлтүүр цэвэрлэх
            </Link>
          </div>
        )}

        {catalog.total ? (
          <Pagination page={catalog.page} pageCount={catalog.pageCount} pageHref={(page) => href({ page })}>
            {from}–{to}, нийт <b className="text-[#2f2420]">{catalog.total}</b>
          </Pagination>
        ) : null}
      </section>
    </div>
  );
}

// 1 … 4 5 6 … 10 хэлбэрээр: эхний, сүүлийн болон одоогийн хуудасны хөршүүд.
function pageNumbers(page: number, pageCount: number) {
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((value) => value >= 1 && value <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((value, index) => (index && value - sorted[index - 1] > 1 ? (["gap", value] as const) : [value]));
}

function Pagination({
  page,
  pageCount,
  pageHref,
  children,
}: {
  page: number;
  pageCount: number;
  pageHref: (page: number) => string;
  children: React.ReactNode;
}) {
  const box = "flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-[13px] font-semibold transition";
  const arrow = (target: number, label: string, Icon: typeof ChevronLeft) =>
    target >= 1 && target <= pageCount ? (
      <Link href={pageHref(target)} aria-label={label} className={`${box} text-[#2f2420] hover:bg-white`}>
        <Icon aria-hidden className="h-4 w-4" />
      </Link>
    ) : (
      <span aria-hidden className={`${box} text-[#d6cbc3]`}>
        <Icon className="h-4 w-4" />
      </span>
    );

  return (
    <nav aria-label="Хуудаслалт" className="mt-12 flex flex-col items-center gap-3">
      {pageCount > 1 ? (
        <div className="flex items-center gap-1.5 sm:gap-2">
          {arrow(page - 1, "Өмнөх хуудас", ChevronLeft)}
          {pageNumbers(page, pageCount).map((value, index) =>
            value === "gap" ? (
              <span key={`gap-${index}`} className="px-1 text-[#9c8c84]">
                …
              </span>
            ) : (
              <Link
                key={value}
                href={pageHref(value)}
                aria-current={value === page ? "page" : undefined}
                className={`${box} ${
                  value === page
                    ? "bg-[#a24456] text-white"
                    : "border border-[#eadfd5] bg-white text-[#2f2420] hover:border-[#a24456] hover:text-[#a24456]"
                }`}
              >
                {value}
              </Link>
            ),
          )}
          {arrow(page + 1, "Дараагийн хуудас", ChevronRight)}
        </div>
      ) : null}
      <p className="text-[12px] text-[#7a6b63]">{children}</p>
    </nav>
  );
}
