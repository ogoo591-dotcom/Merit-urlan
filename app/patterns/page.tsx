import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";

import { PatternCard } from "@/components/patterns/pattern-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPatterns } from "@/lib/data/patterns";
import { getPurchasedPatternIds } from "@/lib/data/purchases";

export const metadata: Metadata = { title: "Схем заавар | Merit Urlan" };

const filters = [
  { label: "Бүгд", query: "" },
  { label: "Шинэ", query: "sort=new" },
  { label: "Тоглоом", query: "type=toy" },
  { label: "Хувцас", query: "type=clothes" },
  { label: "Гэр ахуй", query: "type=home" },
  { label: "Аксессуар", query: "type=accessory" },
];

export default async function PatternsPage({ searchParams }: { searchParams: Promise<{ type?: string; sort?: string }> }) {
  const { type, sort } = await searchParams;
  const { userId } = await auth();
  const [patterns, purchased] = await Promise.all([getPatterns({ type, sort }), getPurchasedPatternIds(userId)]);
  const activeQuery = type ? `type=${type}` : sort === "new" ? "sort=new" : "";

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0]">
        <section className="mx-auto w-full max-w-[1600px] px-6 py-12 lg:px-[60px]">
          <div className="border-b border-[#eadfd5] pb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">Схем заавар</p>
            <h1 className="mt-2 font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[48px]">Схем заавар</h1>
            <p className="mt-2 text-[12px] text-[#7a6b63]">
              Монгол хэлнээ орчуулсан схемүүд. Худалдаж авсны дараа PDF-ээ “Миний сан” хэсгээс татаж авна.
            </p>
          </div>

          <nav aria-label="Схем шүүх" className="mt-8 flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = filter.query === activeQuery;
              return (
                <Link
                  key={filter.label}
                  href={filter.query ? `/patterns?${filter.query}` : "/patterns"}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-[12px] font-medium transition ${
                    active ? "bg-[#a24456] text-white" : "bg-white text-[#4a3b35] ring-1 ring-[#eadfd5] hover:ring-[#a24456]"
                  }`}
                >
                  {filter.label}
                </Link>
              );
            })}
          </nav>

          {patterns.length ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {patterns.map((pattern) => (
                <li key={pattern.id}>
                  <PatternCard pattern={pattern} purchased={purchased.includes(pattern.id)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-[22px] border border-dashed border-[#e3d6cb] bg-white/60 px-6 py-16 text-center text-[13px] text-[#7a6b63]">
              Энэ ангилалд одоогоор схем алга
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
