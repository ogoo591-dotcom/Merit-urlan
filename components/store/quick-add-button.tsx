"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";
import type { StoreProduct } from "@/lib/mock/products";

// Картан дээрээс 1 ширхэгийг шууд сагсанд нэмнэ. Сагсанд байгаа тоо үлдэгдлээс хэтрэхгүй.
export function QuickAddButton({ product, className = "" }: { product: StoreProduct; className?: string }) {
  const { items, addItem } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find((line) => line.slug === product.id)?.quantity ?? 0;
  const disabled = product.stock - inCart < 1;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem({ slug: product.id, name: product.name, price: formatPrice(product.price), priceValue: product.price, image: product.images[0] });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1500);
      }}
      aria-label={disabled ? "Үлдэгдэл хүрэлцэхгүй" : `${product.name} — сагсанд нэмэх`}
      title={disabled ? "Үлдэгдэл хүрэлцэхгүй" : "Сагсанд нэмэх"}
      className={`flex h-10 w-10 items-center justify-center rounded-full shadow-[0_8px_20px_-10px_rgba(162,68,86,0.8)] transition ${
        added ? "bg-[#2fa65a] text-white" : "bg-[#a24456] text-white hover:bg-[#8a3748]"
      } disabled:cursor-not-allowed disabled:bg-[#d8cdc6] disabled:shadow-none ${className}`}
    >
      {added ? <Check aria-hidden className="h-4 w-4" /> : <ShoppingCart aria-hidden className="h-4 w-4" />}
    </button>
  );
}
