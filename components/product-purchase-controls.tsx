"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

type Props = {
  item: { slug: string; name: string; price: string; priceValue: number; image: string; stock: number };
};

export function ProductPurchaseControls({ item }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function addToCart() {
    addItem(item, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      <p className="mb-4 text-[12px] font-medium text-[#495057]">Тоо ширхэг:</p>
      <div className="grid gap-4 lg:grid-cols-[0.78fr_1fr_1fr]">
        <div className="flex h-20 items-center overflow-hidden rounded-[1.4rem] border border-[#dfe3e6] bg-white lg:h-24">
          <button type="button" aria-label="Тоо ширхэг хасах" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-full w-18 items-center justify-center bg-[#f1f3f5] px-6 text-[12px] text-[#6b7280] disabled:opacity-40">−</button>
          <div aria-live="polite" className="flex-1 text-center text-[12px] font-semibold">{quantity}</div>
          <button type="button" aria-label="Тоо ширхэг нэмэх" disabled={quantity >= item.stock} onClick={() => setQuantity((value) => Math.min(item.stock, value + 1))} className="flex h-full w-18 items-center justify-center px-6 text-[12px] text-[#6b7280] disabled:opacity-40">+</button>
        </div>
        <button type="button" onClick={addToCart} disabled={item.stock < 1} className="rounded-[1.4rem] bg-[#f7a40d] px-8 py-5 text-[12px] font-bold text-white transition hover:bg-[#e69607] disabled:cursor-not-allowed disabled:opacity-50">
          {item.stock < 1 ? "Дууссан" : added ? "✓ Сагсанд нэмлээ" : "🧺 Сагслах"}
        </button>
        <a href="https://www.facebook.com/meriturlan" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-[1.4rem] bg-[#1fbe86] px-8 py-5 text-center text-[12px] font-semibold text-white transition hover:bg-[#18ac78]">
          Захиалгын талаар асуух
        </a>
      </div>
      <div className="mt-8 flex items-center justify-between rounded-[1.7rem] border border-[#dfe3e6] px-6 py-7">
        <span className="text-[12px] font-semibold text-[#495057]">Нийт дүн:</span>
        <span className="text-[12px] font-bold text-[#f59b17]">{(item.priceValue * quantity).toLocaleString("mn-MN")}₮</span>
      </div>
    </div>
  );
}
