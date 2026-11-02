import Link from "next/link";
import type { ReactNode } from "react";

import { ActiveFilters } from "@/components/store/active-filters";
import { list, price, single, type CatalogSearchParams } from "@/components/store/catalog-params";
import { CatalogSidebar } from "@/components/store/catalog-sidebar";
import type { FacetOption } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";

export type ListingState = { category?: string; q?: string; sort: string; level: string[]; min?: number; max?: number };

const levelValues = ["beginner", "intermediate", "advanced"];

export function parseListingParams(searchParams: CatalogSearchParams, categoryParam: string, sortOptions: Array<{ value: string }>): ListingState {
  const sort = single(searchParams.sort);
  return {
    category: single(searchParams[categoryParam]),
    q: single(searchParams.q),
    sort: sort && sortOptions.some((option) => option.value === sort) ? sort : "default",
    level: list(searchParams.level).filter((value) => levelValues.includes(value)),
    min: price(searchParams.min),
    max: price(searchParams.max),
  };
}

// Сургалт, схемийн жагсаалт (server): бараа, материалын хуудастай ижил зүүн самбартай. Бүх төлөв URL-д хадгалагдана.
export function ListingView({
  base,
  title,
  description,
  unit,
  categoryParam,
  state,
  catalog,
  sortOptions,
  children,
}: {
  base: string;
  title: string;
  description: string;
  unit: string;
  categoryParam: string;
  state: ListingState;
  catalog: { total: number; allCount: number; categories: FacetOption[]; levels: FacetOption[] };
  sortOptions: Array<{ value: string; label: string }>;
  children: ReactNode;
}) {
  const href = (next: Partial<ListingState>) => {
    const merged = { ...state, ...next };
    const params = new URLSearchParams();
    if (merged.category) params.set(categoryParam, merged.category);
    if (merged.q) params.set("q", merged.q);
    if (merged.sort !== "default") params.set("sort", merged.sort);
    for (const value of merged.level) params.append("level", value);
    if (merged.min !== undefined) params.set("min", String(merged.min));
    if (merged.max !== undefined) params.set("max", String(merged.max));
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  };

  const activeFilters = [
    ...state.level.map((value) => ({
      label: catalog.levels.find((option) => option.value === value)?.label ?? value,
      href: href({ level: state.level.filter((item) => item !== value) }),
    })),
    ...(state.min !== undefined || state.max !== undefined
      ? [
          {
            label: `${state.min !== undefined ? formatPrice(state.min) : "0₮"} – ${state.max !== undefined ? formatPrice(state.max) : "∞"}`,
            href: href({ min: undefined, max: undefined }),
          },
        ]
      : []),
  ];
  const clearFilters = href({ level: [], min: undefined, max: undefined });
  const heading = catalog.categories.find((item) => item.value === state.category)?.label ?? title;

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-6 pb-16 pt-8 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10 lg:px-[60px] lg:pt-10">
      <CatalogSidebar
        action={base}
        query={state.q}
        mobileSearch
        allLink={{ label: "Бүгд", count: catalog.allCount, href: href({ category: undefined }), active: !state.category }}
        categories={catalog.categories.map((item) => ({
          label: item.label,
          count: item.count,
          href: href({ category: item.value }),
          active: state.category === item.value,
          subcategories: [],
        }))}
        groups={[{ name: "level", title: "Түвшин", options: catalog.levels }]}
        selected={{ level: state.level }}
        price={{ min: state.min, max: state.max }}
        keep={{ [categoryParam]: state.category, sort: state.sort === "default" ? undefined : state.sort }}
        clearHref={clearFilters}
        sortLinks={sortOptions.map((option) => ({ label: option.label, href: href({ sort: option.value }), active: option.value === state.sort }))}
      />

      <section className="min-w-0">
        <h1 className="font-serif text-[32px] leading-tight text-[#2f2420] lg:text-[40px]">{heading}</h1>
        <p className="mt-2 text-[12px] text-[#7a6b63]">
          {description} · <b className="text-[#2f2420]">{catalog.total}</b> {unit}
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

        {catalog.total ? (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{children}</ul>
        ) : (
          <div className="mt-8 rounded-[22px] border border-dashed border-[#e3d6cb] bg-white/60 px-6 py-16 text-center">
            <p className="text-[13px] font-semibold text-[#2f2420]">Тохирох {unit} олдсонгүй</p>
            <p className="mt-2 text-[12px] text-[#7a6b63]">Шүүлтүүрээ өөрчилж эсвэл цэвэрлээд дахин үзээрэй.</p>
            <Link href={base} className="mt-4 inline-block text-[12px] font-medium text-[#a24456] underline underline-offset-4">
              Бүгдийг харах
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
