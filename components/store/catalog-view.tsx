import Link from "next/link";
import { Suspense } from "react";

import { ProductCard } from "@/components/store/product-card";
import { SortSelect } from "@/components/store/sort-select";
import { storeMeta } from "@/components/store/store-paths";
import { getCategories, getProducts, type ProductSort, type ProductType } from "@/lib/data/products";

const sorts: ProductSort[] = ["default", "price_asc", "price_desc"];

export type CatalogSearchParams = { category?: string; sort?: string; q?: string };

// Бүтээгдэхүүн / Материалын жагсаалт (server). Шүүлтүүр URL-д (?category=&sort=&q=) хадгалагдана.
export async function CatalogView({ type, searchParams }: { type: ProductType; searchParams: CatalogSearchParams }) {
  const meta = storeMeta[type];
  const category = searchParams.category || undefined;
  const query = searchParams.q?.trim() || undefined;
  const sort = sorts.find((value) => value === searchParams.sort) ?? "default";
  const [categories, products] = await Promise.all([getCategories(type), getProducts({ type, category, sort, query })]);
  const total = categories.reduce((sum, item) => sum + item.count, 0);

  const href = (next: Partial<CatalogSearchParams>) => {
    const params = new URLSearchParams();
    const merged = { category, sort: sort === "default" ? undefined : sort, q: query, ...next };
    for (const [key, value] of Object.entries(merged)) if (value) params.set(key, value);
    const string = params.toString();
    return string ? `${meta.base}?${string}` : meta.base;
  };

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-[12px] font-medium transition ${
      active ? "bg-[#a24456] text-white" : "bg-white text-[#4a3b35] ring-1 ring-[#eadfd5] hover:ring-[#a24456]"
    }`;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-12 lg:px-[60px]">
      <div className="flex flex-col gap-2 border-b border-[#eadfd5] pb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">Дэлгүүр</p>
        <h1 className="font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[48px]">{meta.title}</h1>
        <p className="text-[12px] text-[#7a6b63]">{meta.description}</p>
        {query ? (
          <p className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-[#4a3b35]">
            «{query}» хайлтын үр дүн
            <Link href={href({ q: undefined })} className="font-medium text-[#a24456] underline underline-offset-4">
              Хайлтыг арилгах
            </Link>
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav className="flex flex-wrap gap-2" aria-label="Ангиллаар шүүх">
          <Link href={href({ category: undefined })} aria-current={!category ? "page" : undefined} className={chip(!category)}>
            Бүгд ({total})
          </Link>
          {categories.map((item) => (
            <Link
              key={item.name}
              href={href({ category: item.name })}
              aria-current={category === item.name ? "page" : undefined}
              className={chip(category === item.name)}
            >
              {item.name} ({item.count})
            </Link>
          ))}
        </nav>
        <Suspense>
          <SortSelect value={sort} />
        </Suspense>
      </div>

      {products.length ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-[22px] border border-dashed border-[#e3d6cb] bg-white/60 px-6 py-16 text-center">
          <p className="text-[13px] font-semibold text-[#2f2420]">Энэ ангилалд одоогоор бараа алга</p>
          <Link href={meta.base} className="mt-4 inline-block text-[12px] font-medium text-[#a24456] underline underline-offset-4">
            Бүх барааг харах
          </Link>
        </div>
      )}
    </section>
  );
}
