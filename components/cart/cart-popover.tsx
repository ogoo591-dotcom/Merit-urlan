"use client";

import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuthModal } from "@/components/auth/auth-modal-provider";
import { CartLineRow, SelectAllRow } from "@/components/cart/cart-lines";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

// Header-ийн сагсны дүрс доор гарах жижиг цонх. Гадна дарах, Esc эсвэл хуудас солигдоход хаагдана.
// Эцэг элемент (сагсны товчтой хамт) дотор дарвал хаахгүй — товч өөрөө нээж/хаадаг.
export function CartPopover({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const openedAt = useRef(pathname);
  const { items, selectedItems } = useCart();
  const { requireAuth } = useAuthModal();
  const total = selectedItems.reduce((sum, line) => sum + line.priceValue * line.quantity, 0);

  useEffect(() => {
    if (pathname !== openedAt.current) onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.parentElement?.contains(event.target as Node)) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const goCheckout = () => {
    onClose();
    requireAuth("/checkout");
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Таны сагс"
      className="fixed inset-x-3 top-[calc(var(--header-h,72px)+8px)] z-50 flex max-h-[calc(100svh-var(--header-h,72px)-24px)] flex-col overflow-hidden rounded-[24px] border border-[#eadfd5] bg-white text-left shadow-[0_30px_60px_-25px_rgba(47,36,32,0.45)] animate-[fade-in_0.15s_ease-out] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[420px]"
    >
      <div className="flex items-center justify-between border-b border-[#f1ebe5] px-5 py-4">
        <h2 className="text-[14px] font-semibold text-[#2f2420]">Таны сагс ({items.length})</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Сагс хаах"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#8a7b73] transition hover:bg-[#faf6f3] hover:text-[#2f2420]"
        >
          <X aria-hidden className="h-5 w-5" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7e9ec] text-[#a24456]">
            <ShoppingBag aria-hidden className="h-7 w-7" />
          </span>
          <p className="mt-5 text-[13px] font-semibold text-[#2f2420]">Таны сагс хоосон байна</p>
          <p className="mt-2 text-[12px] text-[#7a6b63]">Дуртай бараа, сургалтаа нэмээд худалдан авалтаа эхлээрэй</p>
          <div className="mt-6 flex gap-2">
            <Link href="/products" onClick={onClose} className="rounded-xl bg-[#3d302c] px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-[#2f2420]">
              Дэлгүүр
            </Link>
            <Link href="/courses" onClick={onClose} className="rounded-xl border border-[#eadfd5] px-5 py-3 text-[12px] font-semibold text-[#2f2420] transition hover:border-[#a24456] hover:text-[#a24456]">
              Сургалт
            </Link>
          </div>
        </div>
      ) : (
        <>
          <SelectAllRow className="border-b border-[#f1ebe5] px-5 py-3.5" />
          <ul className="flex-1 divide-y divide-[#f1ebe5] overflow-y-auto">
            {items.map((line) => (
              <li key={line.slug} className="px-5 py-4">
                <CartLineRow line={line} size="sm" onNavigate={onClose} />
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-[#f1ebe5] bg-[#faf6f3] px-5 py-4">
            <span className="text-[12px] text-[#7a6b63]">Барааны дүн</span>
            <strong className="text-[16px] text-[#2f2420]">{formatPrice(total)}</strong>
          </div>
          <div className="space-y-1 px-5 pb-4 pt-4">
            <button
              type="button"
              onClick={goCheckout}
              disabled={selectedItems.length === 0}
              className="w-full rounded-2xl bg-[#3d302c] px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#2f2420] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Худалдан авах
            </button>
            <button
              type="button"
              onClick={goCheckout}
              className="w-full rounded-2xl px-6 py-3 text-[12px] font-semibold text-[#2f2420] transition hover:text-[#a24456]"
            >
              Сагс харах
            </button>
          </div>
        </>
      )}
    </div>
  );
}
