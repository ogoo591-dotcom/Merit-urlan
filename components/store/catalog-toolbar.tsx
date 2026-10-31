"use client";

import { ArrowDownUp, Check, ChevronDown, Filter, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { FacetOption } from "@/lib/data/products";

type Selected = { brand: string[]; color: string[]; origin: string[]; avail: string[]; min?: number; max?: number };

const flags: Record<string, string> = { Турк: "🇹🇷", Хятад: "🇨🇳" };

// Жагсаалтын дээрх саарал мөр: олдсон тоо, "Шүүлтүүр" самбар, "Эрэмблэх" цэс.
// Шүүлтүүр нь GET form — "Шүүх" дарахад URL-ийн параметр болж, сервер дахин шүүнэ.
export function CatalogToolbar({
  action,
  total,
  facets,
  selected,
  keep,
  clearHref,
  sortLinks,
}: {
  action: string;
  total: number;
  facets: { brands: FacetOption[]; colors: FacetOption[]; origins: FacetOption[]; availability: FacetOption[] };
  selected: Selected;
  keep: Record<string, string | undefined>;
  clearHref: string;
  sortLinks: Array<{ label: string; href: string; active: boolean }>;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const activeCount =
    selected.brand.length + selected.color.length + selected.origin.length + selected.avail.length + Number(selected.min !== undefined || selected.max !== undefined);

  const groups = [
    { name: "brand", title: "Брэнд", options: facets.brands },
    { name: "color", title: "Өнгө", options: facets.colors },
    { name: "origin", title: "Улс", options: facets.origins },
    { name: "avail", title: "Бэлэн байдал", options: facets.availability },
  ].filter((group) => group.options.length > 0) as Array<{ name: keyof Omit<Selected, "min" | "max">; title: string; options: FacetOption[] }>;

  return (
    <div className="mt-8 border-y border-[#eadfd5] bg-[#f5eee8]">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-6 py-3 lg:px-[60px]">
        <p className="text-[12px] text-[#7a6b63]">
          <b className="text-[#2f2420]">{total}</b> бараа
        </p>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            aria-expanded={filterOpen}
            aria-controls="catalog-filters"
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-[#2f2420] transition sm:px-4 ${
              filterOpen ? "bg-white shadow-sm" : "hover:bg-white/70"
            }`}
          >
            <Filter aria-hidden className="h-4 w-4" />
            Шүүлтүүр
            {activeCount ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a24456] px-1.5 text-[10px] text-white">
                {activeCount}
              </span>
            ) : null}
          </button>
          <SortMenu links={sortLinks} />
        </div>
      </div>

      {filterOpen ? (
        <div id="catalog-filters" className="mx-auto w-full max-w-[1600px] px-6 pb-5 lg:px-[60px]">
          <Form
            action={action}
            onSubmit={() => setFilterOpen(false)}
            className="rounded-[22px] border border-[#eadfd5] bg-white p-5 shadow-[0_20px_40px_-34px_rgba(70,45,35,0.5)] sm:p-7"
          >
            {Object.entries(keep).map(([name, value]) => (value ? <input key={name} type="hidden" name={name} value={value} /> : null))}

            <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {groups.map((group) => (
                <fieldset key={group.name}>
                  <legend className="text-[12px] font-semibold text-[#2f2420]">{group.title}</legend>
                  <ul className="mt-3 max-h-[260px] space-y-1 overflow-y-auto pr-2">
                    {group.options.map((option) => (
                      <li key={option.value}>
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1.5 py-1.5 text-[12px] text-[#4a3b35] transition hover:bg-[#faf6f3]">
                          <input
                            type="checkbox"
                            name={group.name}
                            value={option.value}
                            defaultChecked={selected[group.name].includes(option.value)}
                            className="h-4 w-4 shrink-0 accent-[#a24456]"
                          />
                          {option.swatch ? (
                            <span
                              aria-hidden
                              className="h-4 w-4 shrink-0 rounded-full ring-1 ring-[#2f2420]/15"
                              style={{ background: option.swatch }}
                            />
                          ) : null}
                          {flags[option.value] ? <span aria-hidden>{flags[option.value]}</span> : null}
                          <span className="flex-1">{option.label}</span>
                          <span className="text-[11px] text-[#9c8c84]">{option.count}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              ))}

              <fieldset>
                <legend className="text-[12px] font-semibold text-[#2f2420]">
                  Үнэ <span className="font-normal text-[#9c8c84]">(₮)</span>
                </legend>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    name="min"
                    min={0}
                    step={100}
                    inputMode="numeric"
                    placeholder="Доод"
                    aria-label="Доод үнэ"
                    defaultValue={selected.min}
                    className="w-full min-w-0 rounded-xl border border-[#eadfd5] px-3.5 py-3 text-[12px] outline-none focus:border-[#a24456]"
                  />
                  <span className="text-[#9c8c84]">–</span>
                  <input
                    type="number"
                    name="max"
                    min={0}
                    step={100}
                    inputMode="numeric"
                    placeholder="Дээд"
                    aria-label="Дээд үнэ"
                    defaultValue={selected.max}
                    className="w-full min-w-0 rounded-xl border border-[#eadfd5] px-3.5 py-3 text-[12px] outline-none focus:border-[#a24456]"
                  />
                </div>
              </fieldset>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[#f1ebe5] pt-5">
              <button
                type="submit"
                className="rounded-xl bg-[#3d302c] px-7 py-3 text-[12px] font-semibold text-white transition hover:bg-[#2f2420]"
              >
                Шүүх
              </button>
              {activeCount ? (
                <Link
                  href={clearHref}
                  onClick={() => setFilterOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-[12px] font-medium text-[#7a6b63] transition hover:text-[#a24456]"
                >
                  <X aria-hidden className="h-4 w-4" />
                  Цэвэрлэх
                </Link>
              ) : null}
            </div>
          </Form>
        </div>
      ) : null}
    </div>
  );
}

function SortMenu({ links }: { links: Array<{ label: string; href: string; active: boolean }> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Гадна дарах эсвэл Esc дарахад хаагдана.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-[#2f2420] transition sm:px-4 ${
          open ? "bg-white shadow-sm" : "hover:bg-white/70"
        }`}
      >
        <ArrowDownUp aria-hidden className="h-4 w-4" />
        <span className="hidden sm:inline">{links.find((link) => link.active)?.label ?? "Эрэмблэх"}</span>
        <span className="sm:hidden">Эрэмблэх</span>
        <ChevronDown aria-hidden className={`h-4 w-4 text-[#9c8c84] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-[#eadfd5] bg-white py-1.5 shadow-[0_20px_40px_-20px_rgba(70,45,35,0.45)]"
        >
          {links.map((link) => (
            <li key={link.label} role="none">
              <Link
                role="menuitem"
                href={link.href}
                scroll={false}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 text-[12px] transition hover:bg-[#faf6f3] ${
                  link.active ? "font-semibold text-[#a24456]" : "text-[#4a3b35]"
                }`}
              >
                {link.label}
                {link.active ? <Check aria-hidden className="h-4 w-4" /> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
