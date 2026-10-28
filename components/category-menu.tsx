"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { featuredCourses, type ShopCategoryKey } from "@/lib/site-data";

type MenuData = Record<ShopCategoryKey, Array<{ name: string; count: number }>>;

type Column = {
  icon: string;
  title: string;
  href: string;
  links: Array<{ label: string; href: string }>;
};

const quickLinks = [
  { icon: "🛍️", label: "Бүх бараа", href: "/shop" },
  { icon: "🎓", label: "Онлайн сургалт", href: "/courses" },
  { icon: "✉️", label: "Холбоо барих", href: "/#contact" },
];

const homeColumn: Column = {
  icon: "🏠",
  title: "Нүүр",
  href: "/",
  links: [
    { label: "Бидний тухай", href: "/#about" },
    { label: "Бүтээгдэхүүн / Үйлчилгээ", href: "/#services" },
    { label: "Зургийн цомог", href: "/#gallery" },
    { label: "Яагаад Merit урлан", href: "/#why" },
    { label: "Түгээмэл асуулт", href: "/#faq" },
  ],
};

const courseColumn: Column = {
  icon: "🎓",
  title: "Сургалт",
  href: "/courses",
  links: featuredCourses.map((course) => ({ label: course.title, href: "/courses" })),
};

function shopColumn(category: ShopCategoryKey, data: MenuData | null): Column {
  const base = `/shop/${category}`;
  return {
    icon: category === "supplies" ? "🧶" : "🧸",
    title: category === "supplies" ? "Туслах материал" : "Бэлэн бүтээгдэхүүн",
    href: base,
    links: (data?.[category] ?? []).map((sub) => ({
      label: `${sub.name} (${sub.count})`,
      href: `${base}?sub=${encodeURIComponent(sub.name)}#products`,
    })),
  };
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 text-[#b3a69e]" viewBox="0 0 16 16" fill="none">
      <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTile({ children }: { children: string }) {
  return (
    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7f0ea] text-[18px]">
      {children}
    </span>
  );
}

// "☰ Категори" товч: хулганаа авчрахад сайтын бүх хэсэг, ангиллыг багануудаар харуулна.
export function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<MenuData | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const requested = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);

  // Анх нээх үед л дэд ангиллуудыг сангаас татна.
  useEffect(() => {
    if (!open || requested.current) return;
    requested.current = true;
    fetch("/api/menu")
      .then((response) => (response.ok ? response.json() : null))
      .then((menu: MenuData | null) => setData(menu))
      .catch(() => {
        requested.current = false;
      });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const columns = [homeColumn, shopColumn("supplies", data), shopColumn("finished", data), courseColumn];
  const close = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(false);
  };

  // Товчноос цонх руу шилжих зуур header-ийн зайгаар өнгөрөхөд шууд хаагдахгүйн тулд түр хүлээнэ.
  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 200);
  };

  return (
    <div ref={wrapperRef} className="shrink-0" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          // Хулганатай үед hover-оор аль хэдийн нээгдсэн тул дарахад хаахгүй. Утсан дээр нээж/хаана.
          if (window.matchMedia("(hover: hover)").matches) openNow();
          else setOpen((value) => !value);
        }}
        className={`flex h-[50px] items-center gap-2.5 rounded-xl px-3 text-[12px] font-medium transition ${
          open ? "bg-white text-[#2f2420]" : "text-[#6f625b] hover:text-[#2f2420]"
        }`}
      >
        <MenuIcon open={open} />
        Категори
      </button>

      {open ? (
        // Header-ийн доор бүтэн өргөнөөр нээгдэнэ. pt-2 нь товчноос цонх руу хулгана шилжихэд хаагдахгүй байлгана.
        <div
          className="absolute inset-x-0 top-full z-50 px-4 pt-2 lg:px-[60px]"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          onClick={(event) => {
            // Цонхны хоосон хэсэг (хажуугийн зай) дээр дарвал хаана.
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="mx-auto max-h-[calc(100svh-var(--header-h,90px)-24px)] max-w-[1480px] overflow-y-auto rounded-[20px] border border-[#eadfd5] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(47,36,32,0.55)] lg:p-8">
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-[0.8fr_1fr_1fr_1fr_1fr]">
              <ul className="space-y-1">
                {quickLinks.map((link) => (
                  <li key={link.href} className="border-b border-[#f1ebe5] last:border-0">
                    <Link
                      href={link.href}
                      onClick={close}
                      className="flex items-center gap-3 py-3.5 text-[13px] font-semibold text-[#2f2420] transition hover:text-[#6e4f45]"
                    >
                      <IconTile>{link.icon}</IconTile>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {columns.map((column) => (
                <div key={column.title}>
                  <Link
                    href={column.href}
                    onClick={close}
                    className="group flex items-center gap-3 text-[13px] font-semibold text-[#2f2420] transition hover:text-[#6e4f45]"
                  >
                    <IconTile>{column.icon}</IconTile>
                    {column.title}
                    <ChevronIcon />
                  </Link>
                  <ul className="mt-3 space-y-0.5 border-b border-[#f1ebe5] pb-4">
                    {column.links.length === 0 ? (
                      <li className="py-2 text-[12px] text-[#b3a69e]">{data ? "Одоогоор хоосон" : "Ачаалж байна…"}</li>
                    ) : (
                      column.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            onClick={close}
                            className="block truncate py-2 text-[12px] text-[#4a3b35] transition hover:text-[#6e4f45]"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
