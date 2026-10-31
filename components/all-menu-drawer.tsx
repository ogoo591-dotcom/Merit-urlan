"use client";

import { useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, LogIn, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { useAuthModal } from "@/components/auth/auth-modal-provider";
import { navSections, utilityLinks } from "@/lib/navigation";

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// "☰ Бүгд" товчоор нээгдэх зүүн drawer. Зүүн баганад 5 хэсэг, баруун самбарт сонгосон хэсгийн дэд ангилал.
// Утсан дээр бүтэн дэлгэцээр гарч, дэд ангилал руу ороход "‹ Буцах" товч гарна.
export function AllMenuDrawer({ onClose }: { onClose: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { isSignedIn } = useUser();
  const { openAuth } = useAuthModal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const active = navSections.find((section) => section.id === activeId) ?? null;

  // Нээгдэхэд эхний хэсэгт focus өгч, хаагдахад өмнөх элемент рүү (☰ товч) буцаана. Арын хуудсыг гүйлгэхгүй.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sectionRefs.current[0]?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, []);

  const openSection = (id: string, focusPanel: boolean) => {
    setActiveId(id);
    if (focusPanel) {
      window.requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus());
    }
  };

  const backToSections = () => {
    const index = navSections.findIndex((section) => section.id === activeId);
    setActiveId(null);
    window.requestAnimationFrame(() => sectionRefs.current[Math.max(index, 0)]?.focus());
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    // Focus drawer-ээс гарахгүй (Tab / Shift+Tab эргэлдэнэ).
    if (event.key === "Tab" && dialogRef.current) {
      const nodes = [...dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)].filter(
        (node) => node.offsetParent !== null,
      );
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
      return;
    }

    // Хэсгүүдийн дунд ↑/↓, самбар руу →, буцах ←.
    const sectionIndex = sectionRefs.current.findIndex((node) => node === document.activeElement);
    if (sectionIndex !== -1) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const next = (sectionIndex + (event.key === "ArrowDown" ? 1 : -1) + navSections.length) % navSections.length;
        sectionRefs.current[next]?.focus();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        openSection(navSections[sectionIndex].id, true);
      }
    } else if (event.key === "ArrowLeft" && panelRef.current?.contains(document.activeElement)) {
      event.preventDefault();
      backToSections();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Бүх ангилал"
      className="fixed inset-0 z-[60]"
      onKeyDown={onKeyDown}
    >
      <div
        className="motion-safe-drawer absolute inset-0 bg-[#1c1513]/60 animate-[fade-in_0.2s_ease-out]"
        onClick={onClose}
      />

      <div className="motion-safe-drawer relative flex h-full w-full animate-[drawer-in_0.25s_ease-out] sm:w-fit">
        {/* Зүүн багана: үндсэн хэсгүүд */}
        <nav
          aria-label="Үндсэн хэсгүүд"
          className={`h-full w-full flex-col overflow-y-auto bg-white sm:flex sm:w-[320px] ${active ? "hidden" : "flex"}`}
        >
          <div className="flex items-center gap-3 border-b border-[#f1ebe5] px-6 py-5">
            <Image src="/Logo.png" alt="" width={80} height={80} className="h-10 w-10 rounded-full" />
            <span className="text-[13px] font-semibold text-[#2f2420]">Merit урлан</span>
          </div>

          <ul className="px-3 py-3">
            {navSections.map((section, index) => {
              const Icon = section.icon;
              const selected = section.id === activeId;
              return (
                <li key={section.id}>
                  <button
                    ref={(node) => {
                      sectionRefs.current[index] = node;
                    }}
                    type="button"
                    aria-expanded={selected}
                    onClick={() => openSection(section.id, false)}
                    onMouseEnter={() => {
                      if (window.matchMedia("(hover: hover)").matches) setActiveId(section.id);
                    }}
                    className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-[13px] font-semibold transition ${
                      selected ? "bg-[#f7e9ec] text-[#a24456]" : "text-[#2f2420] hover:bg-[#faf6f3]"
                    }`}
                  >
                    <Icon aria-hidden className="h-5 w-5 shrink-0" strokeWidth={1.7} />
                    <span className="flex-1">{section.label}</span>
                    <ChevronRight aria-hidden className="h-4 w-4 text-[#b3a69e]" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mx-6 border-t border-[#f1ebe5]" />

          <ul className="px-3 py-3">
            {utilityLinks.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 text-[12px] font-medium text-[#4a3b35] transition hover:bg-[#faf6f3]"
                >
                  <Icon aria-hidden className="h-5 w-5 shrink-0 text-[#7a6b63]" strokeWidth={1.7} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto border-t border-[#f1ebe5] p-5">
            {isSignedIn ? (
              <Link
                href="/account"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#3d302c] px-5 py-3.5 text-[12px] font-semibold text-white transition hover:bg-[#2f2420]"
              >
                <User aria-hidden className="h-4 w-4" />
                Миний профайл
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuth();
                }}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#a24456] px-5 py-3.5 text-[12px] font-semibold text-white transition hover:bg-[#8a3748]"
              >
                <LogIn aria-hidden className="h-4 w-4" />
                Нэвтрэх / Бүртгүүлэх
              </button>
            )}
          </div>
        </nav>

        {/* Баруун самбар: сонгосон хэсгийн дэд ангилал */}
        {active ? (
          <div
            ref={panelRef}
            className="flex h-full w-full flex-col overflow-y-auto bg-[#faf6f3] sm:w-[min(440px,calc(100vw-320px))] sm:border-l sm:border-[#f1ebe5]"
          >
            <div className="border-b border-[#f1ebe5] px-6 pb-5 pt-5 sm:pt-7">
              <button
                type="button"
                onClick={backToSections}
                className="mb-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#7a6b63] transition hover:text-[#a24456] sm:hidden"
              >
                <ChevronLeft aria-hidden className="h-4 w-4" />
                Буцах
              </button>
              <div className="flex items-start justify-between gap-4 pr-12 sm:pr-0">
                <div>
                  <h2 className="font-serif text-[26px] leading-tight text-[#2f2420]">{active.label}</h2>
                  <p className="mt-1.5 text-[11px] text-[#7a6b63]">{active.description}</p>
                </div>
                <Link
                  href={active.href}
                  onClick={onClose}
                  className="shrink-0 rounded-full border border-[#e3d6cb] bg-white px-4 py-2 text-[11px] font-semibold text-[#2f2420] transition hover:border-[#a24456] hover:text-[#a24456]"
                >
                  Бүгдийг харах
                </Link>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-3 p-6">
              {active.links.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onClose}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-[#efe4da] bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-[#a24456] hover:shadow-[0_16px_30px_-22px_rgba(162,68,86,0.6)] focus-visible:border-[#a24456]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7e9ec] text-[#a24456] transition group-hover:bg-[#a24456] group-hover:text-white">
                      <Icon aria-hidden className="h-6 w-6" strokeWidth={1.6} />
                    </span>
                    <span className="text-[12px] font-medium leading-snug text-[#2f2420]">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Drawer-ийн баруун ирмэгийн хажууд (утсан дээр дотор нь баруун дээд буланд). */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Цэс хаах"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 sm:-right-[60px] items-center justify-center rounded-full bg-white text-[#2f2420] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition hover:text-[#a24456]"
        >
          <X aria-hidden className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
