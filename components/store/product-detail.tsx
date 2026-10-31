"use client";

import { Check, ChevronRight, Clock, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useAuthModal } from "@/components/auth/auth-modal-provider";
import { useCart } from "@/components/cart-provider";
import { SaveButton } from "@/components/save-button";
import { AvailabilityBadge } from "@/components/store/availability-badge";
import { storeMeta } from "@/components/store/store-paths";
import { formatPrice } from "@/lib/format";
import { productColors, type StoreProduct } from "@/lib/mock/products";

export function ProductDetailView({ product }: { product: StoreProduct }) {
  const meta = storeMeta[product.type];
  const { items, addItem } = useCart();
  const { requireAuth } = useAuthModal();
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Сагсанд байгаа тоог хасаад үлдэгдлээс хэтрэхгүй.
  const inCart = items.find((line) => line.slug === product.id)?.quantity ?? 0;
  const maxQuantity = Math.max(0, product.stock - inCart);
  const soldOut = product.stock < 1;
  const qty = Math.min(quantity, Math.max(1, maxQuantity));

  const addToCart = () => {
    if (maxQuantity < 1) return false;
    addItem(
      { slug: product.id, name: product.name, price: formatPrice(product.price), priceValue: product.price, image: product.images[0] },
      qty,
    );
    return true;
  };

  const details = [
    { label: "Ангилал", value: product.subcategory ? `${product.category} · ${product.subcategory}` : product.category },
    ...(product.brand ? [{ label: "Брэнд", value: product.brand }] : []),
    ...(product.colors?.length ? [{ label: "Өнгө", value: product.colors.map((key) => productColors[key].label).join(", ") }] : []),
    ...(product.origin ? [{ label: "Гарал үүсэл", value: product.origin }] : []),
    { label: "Үлдэгдэл", value: soldOut ? "Дууссан" : `${product.stock} ширхэг` },
    {
      label: "Бэлэн болох",
      value: product.availability === "made_to_order" ? `Захиалснаас хойш ~${product.leadDays ?? 7} хоногт` : "Шууд илгээнэ",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:px-[60px]">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#9c8c84]">
        <Link href="/" className="hover:text-[#a24456]">Нүүр</Link>
        <ChevronRight aria-hidden className="h-3.5 w-3.5" />
        <Link href={meta.base} className="hover:text-[#a24456]">{meta.title}</Link>
        <ChevronRight aria-hidden className="h-3.5 w-3.5" />
        <Link href={`${meta.base}?category=${encodeURIComponent(product.category)}`} className="hover:text-[#a24456]">
          {product.category}
        </Link>
        <ChevronRight aria-hidden className="h-3.5 w-3.5" />
        <span className="text-[#4a3b35]">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Зургийн gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[#efe4da] bg-white">
            <Image
              key={product.images[imageIndex]}
              src={product.images[imageIndex]}
              alt={`${product.name} — зураг ${imageIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 640px"
              className="object-contain p-4"
            />
            <SaveButton
              item={{
                slug: product.id,
                category: meta.base.slice(1),
                name: product.name,
                price: formatPrice(product.price),
                image: product.images[0],
              }}
              className="absolute right-5 top-5 h-12 w-12"
            />
          </div>
          {product.images.length > 1 ? (
            <div className="mt-4 flex gap-3" role="group" aria-label="Зургууд">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Зураг ${index + 1}`}
                  aria-pressed={index === imageIndex}
                  className={`relative h-20 w-20 overflow-hidden rounded-2xl border-2 bg-white transition ${
                    index === imageIndex ? "border-[#a24456]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={image} alt="" fill sizes="80px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Мэдээлэл, худалдан авалт */}
        <div>
          <AvailabilityBadge product={product} />
          <h1 className="mt-4 font-serif text-[36px] leading-tight text-[#2f2420] lg:text-[48px]">{product.name}</h1>
          <p className="mt-4 text-[26px] font-bold text-[#a24456]">{formatPrice(product.price)}</p>
          <p className="mt-5 text-[13px] leading-[1.9] text-[#7a6b63]">{product.description}</p>

          {product.availability === "made_to_order" && !soldOut ? (
            <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#fdf6e6] px-4 py-3 text-[12px] leading-relaxed text-[#7a5200]">
              <Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              Захиалгаар хийгдэнэ. Төлбөр төлөгдсөнөөс хойш ойролцоогоор {product.leadDays ?? 7} хоногт бэлэн болно.
            </p>
          ) : null}

          <dl className="mt-6 divide-y divide-[#f1ebe5] rounded-2xl border border-[#efe4da] bg-white">
            {details.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 px-5 py-3 text-[12px]">
                <dt className="text-[#9c8c84]">{row.label}</dt>
                <dd className="text-right font-medium text-[#2f2420]">{row.value}</dd>
              </div>
            ))}
          </dl>

          {soldOut ? (
            <p className="mt-8 rounded-2xl bg-[#ece8e5] px-5 py-4 text-center text-[12px] font-semibold text-[#7a6b63]">
              Энэ бараа одоогоор дууссан байна
            </p>
          ) : (
            <div className="mt-8">
              <div className="flex items-center gap-4">
                <span className="text-[12px] font-medium text-[#4a3b35]">Тоо ширхэг</span>
                <div className="flex items-center rounded-full border border-[#e3d6cb] bg-white">
                  <button
                    type="button"
                    aria-label="Тоо ширхэг хасах"
                    disabled={qty <= 1}
                    onClick={() => setQuantity(qty - 1)}
                    className="flex h-10 w-10 items-center justify-center text-[#4a3b35] disabled:opacity-30"
                  >
                    <Minus aria-hidden className="h-4 w-4" />
                  </button>
                  <span aria-live="polite" className="w-10 text-center text-[13px] font-semibold">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Тоо ширхэг нэмэх"
                    disabled={qty >= maxQuantity}
                    onClick={() => setQuantity(qty + 1)}
                    className="flex h-10 w-10 items-center justify-center text-[#4a3b35] disabled:opacity-30"
                  >
                    <Plus aria-hidden className="h-4 w-4" />
                  </button>
                </div>
                {inCart ? <span className="text-[11px] text-[#9c8c84]">Сагсанд {inCart} ширхэг байна</span> : null}
              </div>

              {maxQuantity < 1 ? (
                <p className="mt-4 text-[12px] text-[#7a6b63]">Үлдэгдэлтэй бүх ширхэг аль хэдийн сагсанд байна.</p>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={maxQuantity < 1}
                  onClick={() => {
                    if (addToCart()) {
                      setAdded(true);
                      setQuantity(1);
                      window.setTimeout(() => setAdded(false), 1800);
                    }
                  }}
                  className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-[#3d302c] px-6 py-4 text-[13px] font-semibold text-[#3d302c] transition hover:bg-[#3d302c] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {added ? <Check aria-hidden className="h-5 w-5" /> : <ShoppingCart aria-hidden className="h-5 w-5" />}
                  {added ? "Сагсанд нэмлээ" : "Сагсанд нэмэх"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Сагсанд байгаа бол дахин нэмэлгүй шууд захиалга руу орно.
                    if (maxQuantity > 0) addToCart();
                    requireAuth("/checkout");
                  }}
                  className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#a24456] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#8a3748]"
                >
                  <Zap aria-hidden className="h-5 w-5" />
                  Шууд захиалах
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
