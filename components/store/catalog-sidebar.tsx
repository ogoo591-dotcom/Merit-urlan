"use client";

import { ArrowDownUp, Check, ChevronDown, ChevronRight, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import type { FacetOption } from "@/lib/data/products";

export type CategoryLink = { label: string; count: number; href: string; active: boolean };

const flags: Record<string, string> = { Турк: "🇹🇷", Хятад: "🇨🇳" };

const sectionTitle = "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c8c84]";
const priceInput = "w-full min-w-0 rounded-xl border border-[#eadfd5] px-3 py-2.5 text-[12px] outline-none focus:border-[#a24456]";

function categoryClass(active: boolean) {
  return `flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] transition ${
    active ? "bg-[#f7e9ec] font-semibold text-[#a24456]" : "text-[#4a3b35] hover:bg-[#faf6f3]"
  }`;
}

// Нээгддэг хэсэг: цонх шинэчлэгдэхэд ч ажиллах энгийн <details>.
function Group({ title, icon, open, children }: { title: string; icon?: ReactNode; open?: boolean; children: ReactNode }) {
  return (
    <details open={open} className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 py-2 text-[12px] font-semibold text-[#2f2420] [&::-webkit-details-marker]:hidden">
        {icon}
        <span className="flex-1">{title}</span>
        <ChevronDown aria-hidden className="h-4 w-4 text-[#9c8c84] transition group-open:rotate-180" />
      </summary>
      <div className="pb-2 pt-1">{children}</div>
    </details>
  );
}

// Жагсаалтын зүүн самбар: хайлт, ангилал, эрэмбэ, шүүлтүүр. Бүх төлөв URL-д хадгалагдана.
// Хайлт, шүүлтүүр нь GET form — илгээхэд URL-ийн параметр болж, сервер дахин шүүнэ.
export function CatalogSidebar({
  action,
  query,
  mobileSearch = false,
  allLink,
  categories,
  groups,
  selected,
  price,
  keep,
  clearHref,
  sortLinks,
}: {
  action: string;
  query?: string;
  // Толгойн хайлт зөвхөн бараа хайдаг: бараа биш хуудсанд самбарын хайлт утсан дээр ч харагдана.
  mobileSearch?: boolean;
  allLink: CategoryLink;
  categories: Array<CategoryLink & { subcategories: CategoryLink[] }>;
  groups: Array<{ name: string; title: string; options: FacetOption[] }>;
  selected: Record<string, string[]>;
  price: { min?: number; max?: number };
  keep: Record<string, string | undefined>;
  clearHref: string;
  sortLinks: Array<{ label: string; href: string; active: boolean }>;
}) {
  // Утсан дээр самбар хаалттай байж, товчоор нээгдэнэ. Том дэлгэцэд үргэлж харагдана.
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  const priceActive = price.min !== undefined || price.max !== undefined;
  const activeCount = Object.values(selected).flat().length + Number(priceActive);
  const activeSort = sortLinks.find((link) => link.active);

  const hiddenInputs = (values: Record<string, string | undefined>) =>
    Object.entries(values).map(([name, value]) => (value ? <input key={name} type="hidden" name={name} value={value} /> : null));

  return (
    <aside className="lg:sticky lg:top-[calc(var(--header-h,130px)+1rem)] lg:max-h-[calc(100svh-var(--header-h,130px)-2rem)] lg:self-start lg:overflow-y-auto lg:rounded-[22px] lg:border lg:border-[#eadfd5] lg:bg-white lg:p-4">
      {/* key: URL солигдоход талбарууд шинэ утгаа авна. */}
      <Form key={`search-${query ?? ""}`} action={action} role="search" className={`relative lg:block ${mobileSearch ? "mb-3 lg:mb-0" : "hidden"}`}>
        {hiddenInputs(keep)}
        {Object.entries(selected).flatMap(([name, values]) =>
          values.map((value) => <input key={`${name}-${value}`} type="hidden" name={name} value={value} />),
        )}
        {hiddenInputs({ min: price.min?.toString(), max: price.max?.toString() })}
        <input
          type="search"
          name="q"
          defaultValue={query}
          maxLength={80}
          placeholder="Хайх…"
          aria-label="Бараа хайх"
          className="w-full rounded-xl border border-[#eadfd5] bg-white py-2.5 pl-3.5 pr-10 text-[12px] text-[#2f2420] outline-none transition placeholder:text-[#a3958d] focus:border-[#a24456] [&::-webkit-search-cancel-button]:hidden"
        />
        <button type="submit" aria-label="Хайх" className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#7a6b63] transition hover:text-[#a24456]">
          <Search aria-hidden className="h-4 w-4" />
        </button>
      </Form>

      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
        aria-controls="catalog-panel"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#eadfd5] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#2f2420] lg:hidden"
      >
        <SlidersHorizontal aria-hidden className="h-4 w-4" />
        Ангилал, шүүлтүүр
        {activeCount ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a24456] px-1.5 text-[10px] text-white">{activeCount}</span>
        ) : null}
      </button>

      <div id="catalog-panel" className={`mt-3 rounded-[22px] border border-[#eadfd5] bg-white p-4 lg:mt-4 lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 ${mobileOpen ? "block" : "hidden"}`}>
        <p className={`${sectionTitle} px-3`}>Ангиллууд</p>
        <nav aria-label="Ангилал" className="mt-2">
          <ul className="space-y-0.5">
            <li>
              <Link href={allLink.href} onClick={closeMobile} aria-current={allLink.active ? "page" : undefined} className={categoryClass(allLink.active)}>
                <span className="flex-1">{allLink.label}</span>
                <span className="text-[11px] font-normal opacity-70">{allLink.count}</span>
              </Link>
            </li>
            {categories.map((category) => {
              const hasSubs = category.subcategories.length > 1;
              const expanded = category.active || category.subcategories.some((sub) => sub.active);
              return (
                <li key={category.label}>
                  <Link href={category.href} onClick={hasSubs ? undefined : closeMobile} aria-current={category.active ? "page" : undefined} className={categoryClass(category.active)}>
                    <span className="flex-1">{category.label}</span>
                    <span className="text-[11px] font-normal opacity-70">{category.count}</span>
                    {hasSubs ? <ChevronRight aria-hidden className={`h-3.5 w-3.5 transition ${expanded ? "rotate-90" : ""}`} /> : null}
                  </Link>
                  {hasSubs && expanded ? (
                    <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-[#f1ebe5] pl-2">
                      {category.subcategories.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            href={sub.href}
                            onClick={closeMobile}
                            aria-current={sub.active ? "page" : undefined}
                            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] transition ${
                              sub.active ? "font-semibold text-[#a24456]" : "text-[#7a6b63] hover:bg-[#faf6f3] hover:text-[#a24456]"
                            }`}
                          >
                            <span className="flex-1">{sub.label}</span>
                            <span className="font-normal opacity-70">{sub.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-4 border-t border-[#f1ebe5] px-3 pt-2">
          <Group title={`Эрэмблэх${activeSort ? `: ${activeSort.label}` : ""}`} icon={<ArrowDownUp aria-hidden className="h-4 w-4" />}>
            <ul className="space-y-0.5">
              {sortLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    scroll={false}
                    onClick={closeMobile}
                    aria-current={link.active ? "true" : undefined}
                    className={`flex items-center justify-between rounded-lg px-1.5 py-1.5 text-[12px] transition hover:bg-[#faf6f3] ${
                      link.active ? "font-semibold text-[#a24456]" : "text-[#4a3b35]"
                    }`}
                  >
                    {link.label}
                    {link.active ? <Check aria-hidden className="h-4 w-4" /> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Group>
        </div>

        <div className="mt-2 border-t border-[#f1ebe5] px-3 pt-4">
          <p className={`${sectionTitle} flex items-center gap-2`}>
            <Filter aria-hidden className="h-3.5 w-3.5" />
            Шүүлтүүр
            {activeCount ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a24456] px-1.5 text-[10px] tracking-normal text-white">{activeCount}</span>
            ) : null}
          </p>

          {/* key: самбар байнга нээлттэй тул шүүлтүүрийг өөр газраас хасахад checkbox-ууд дагаж шинэчлэгдэнэ. */}
          <Form key={JSON.stringify([selected, price])} action={action} onSubmit={closeMobile} className="mt-2">
            {hiddenInputs({ ...keep, q: query })}

            {groups.filter((group) => group.options.length > 0).map((group) => (
              <Group key={group.name} title={group.title} open={group.options.length <= 4 || selected[group.name]?.length > 0}>
                <fieldset>
                  <legend className="sr-only">{group.title}</legend>
                  <ul className="max-h-[220px] space-y-0.5 overflow-y-auto">
                    {group.options.map((option) => (
                      <li key={option.value}>
                        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-[12px] text-[#4a3b35] transition hover:bg-[#faf6f3]">
                          <input
                            type="checkbox"
                            name={group.name}
                            value={option.value}
                            defaultChecked={selected[group.name]?.includes(option.value)}
                            className="h-4 w-4 shrink-0 accent-[#a24456]"
                          />
                          {option.swatch ? (
                            <span aria-hidden className="h-4 w-4 shrink-0 rounded-full ring-1 ring-[#2f2420]/15" style={{ background: option.swatch }} />
                          ) : null}
                          {flags[option.value] ? <span aria-hidden>{flags[option.value]}</span> : null}
                          <span className="flex-1">{option.label}</span>
                          <span className="text-[11px] text-[#9c8c84]">{option.count}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </Group>
            ))}

            <Group title="Үнэ (₮)" open={priceActive}>
              <fieldset className="flex items-center gap-2">
                <legend className="sr-only">Үнэ</legend>
                <input type="number" name="min" min={0} step={100} inputMode="numeric" placeholder="Доод" aria-label="Доод үнэ" defaultValue={price.min} className={priceInput} />
                <span className="text-[#9c8c84]">–</span>
                <input type="number" name="max" min={0} step={100} inputMode="numeric" placeholder="Дээд" aria-label="Дээд үнэ" defaultValue={price.max} className={priceInput} />
              </fieldset>
            </Group>

            <div className="mt-3 flex items-center gap-2 pb-1">
              <button type="submit" className="flex-1 rounded-xl bg-[#3d302c] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#2f2420]">
                Шүүх
              </button>
              {activeCount ? (
                <Link
                  href={clearHref}
                  onClick={closeMobile}
                  className="inline-flex items-center gap-1 rounded-xl px-2.5 py-2.5 text-[12px] font-medium text-[#7a6b63] transition hover:text-[#a24456]"
                >
                  <X aria-hidden className="h-4 w-4" />
                  Цэвэрлэх
                </Link>
              ) : null}
            </div>
          </Form>
        </div>
      </div>
    </aside>
  );
}
