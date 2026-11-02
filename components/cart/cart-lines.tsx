"use client";

import { Check, GraduationCap, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { isSelected, useCart, type CartLine } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

// Сагсны дугуй сонголтын тэмдэг (сагсны цонх болон захиалгын хуудсанд).
export function RoundCheck({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
        checked ? "border-[#a24456] bg-[#a24456] text-white" : "border-[#d6cbc3] bg-white text-transparent hover:border-[#a24456]"
      }`}
    >
      <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
    </button>
  );
}

export function SelectAllRow({ className = "" }: { className?: string }) {
  const { items, selectedItems, setAllSelected } = useCart();
  const all = items.length > 0 && selectedItems.length === items.length;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <RoundCheck checked={all} onChange={() => setAllSelected(!all)} label="Бүгдийг сонгох" />
      <span className="flex-1 text-[12px] font-medium text-[#4a3b35]">Бүгдийг сонгох</span>
      <span className="text-[11px] text-[#9c8c84]">
        {selectedItems.length}/{items.length}
      </span>
    </div>
  );
}

// Сагсны нэг мөр: сонгох, зураг, нэр, тоо ширхэг (сургалтад биш), устгах, үнэ.
export function CartLineRow({
  line,
  size = "md",
  onNavigate,
  note,
}: {
  line: CartLine;
  size?: "sm" | "md";
  onNavigate?: () => void;
  note?: React.ReactNode;
}) {
  const { toggleSelected, setQuantity, removeItem } = useCart();
  const image = size === "sm" ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24";
  const name = <span className="line-clamp-2 text-[12px] font-medium leading-snug text-[#2f2420] sm:text-[13px]">{line.name}</span>;

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="pt-1">
        <RoundCheck checked={isSelected(line)} onChange={() => toggleSelected(line.slug)} label={`${line.name} — сонгох`} />
      </div>
      <Image src={line.image} alt="" width={96} height={96} className={`${image} shrink-0 rounded-2xl bg-[#faf7f6] object-cover`} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            {line.href ? (
              <Link href={line.href} onClick={onNavigate} className="transition hover:text-[#a24456]">
                {name}
              </Link>
            ) : (
              name
            )}
            {line.kind === "course" ? (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#f7e9ec] px-2 py-0.5 text-[10px] font-semibold text-[#a24456]">
                <GraduationCap aria-hidden className="h-3 w-3" /> Онлайн сургалт
              </span>
            ) : null}
            {note}
          </div>
          <button
            type="button"
            onClick={() => removeItem(line.slug)}
            aria-label={`${line.name} — сагснаас хасах`}
            className="rounded-lg p-1 text-[#b3a69e] transition hover:bg-[#fbeaea] hover:text-[#a33a3a]"
          >
            <Trash2 aria-hidden className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {line.kind === "course" ? (
            <span className="text-[11px] text-[#9c8c84]">1 хүн · насан туршийн эрх</span>
          ) : (
            <div className="flex items-center rounded-full bg-[#f5eee8]">
              <button
                type="button"
                aria-label="Хасах"
                disabled={line.quantity <= 1}
                onClick={() => setQuantity(line.slug, line.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center text-[#4a3b35] disabled:opacity-30"
              >
                <Minus aria-hidden className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-[12px] font-semibold text-[#2f2420]">{line.quantity}</span>
              <button
                type="button"
                aria-label="Нэмэх"
                onClick={() => setQuantity(line.slug, line.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center text-[#4a3b35]"
              >
                <Plus aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <span className="text-[13px] font-bold text-[#2f2420] sm:text-[14px]">{formatPrice(line.priceValue * line.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
