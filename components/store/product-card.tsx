import Image from "next/image";
import Link from "next/link";

import { SaveButton } from "@/components/save-button";
import { AvailabilityBadge } from "@/components/store/availability-badge";
import { QuickAddButton } from "@/components/store/quick-add-button";
import { storeMeta } from "@/components/store/store-paths";
import { formatPrice } from "@/lib/format";
import { productColors, type StoreProduct } from "@/lib/mock/products";

export function ProductCard({ product }: { product: StoreProduct }) {
  const base = storeMeta[product.type].base;
  const soldOut = product.stock < 1;
  const lowStock = !soldOut && product.stock <= 3;
  const colors = product.colors ?? [];

  return (
    <div className="group relative h-full transition hover:-translate-y-1">
      <Link
        href={`${base}/${product.id}`}
        className="flex h-full flex-col rounded-[22px] border border-[#ecd3d9] bg-white p-2.5 transition group-hover:border-[#a24456] group-hover:shadow-[0_22px_45px_-30px_rgba(162,68,86,0.5)] sm:p-4"
      >
        <div className="relative aspect-square overflow-hidden rounded-[16px] bg-[#faf7f6]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 45vw, 25vw"
            className={`object-contain transition duration-500 group-hover:scale-[1.03] ${soldOut ? "opacity-50 grayscale" : ""}`}
          />
          <AvailabilityBadge product={product} className="absolute left-2 top-2 sm:left-3 sm:top-3" />
        </div>
        <div className="flex flex-1 flex-col px-1 pb-1 pt-3 sm:pt-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#9c8c84]">
            {product.subcategory ?? product.category}
            {product.origin ? ` · ${product.origin}` : ""}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[12px] font-semibold leading-snug text-[#2f2420] sm:text-[13px]">{product.name}</h3>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {product.brand ? (
              <span className="rounded-md bg-[#f5eee8] px-2 py-1 text-[10px] font-semibold text-[#4a3b35]">{product.brand}</span>
            ) : null}
            {colors.length ? (
              <span className="flex items-center gap-1" aria-label={`Өнгө: ${colors.map((key) => productColors[key].label).join(", ")}`}>
                {colors.slice(0, 4).map((key) => (
                  <span key={key} aria-hidden className="h-3 w-3 rounded-full ring-1 ring-[#2f2420]/15" style={{ background: productColors[key].hex }} />
                ))}
              </span>
            ) : null}
            {lowStock ? (
              <span className="rounded-md bg-[#fdf1d6] px-2 py-1 text-[10px] font-semibold text-[#8a5a00]">Цөөн үлдсэн</span>
            ) : null}
          </div>
          <p className="mt-auto pr-11 pt-3 text-[14px] font-bold text-[#a24456] sm:text-[15px]">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <SaveButton
        item={{
          slug: product.id,
          category: base.slice(1),
          name: product.name,
          price: formatPrice(product.price),
          image: product.images[0],
        }}
        className="absolute right-4 top-4 z-10 sm:right-7 sm:top-7"
      />
      {/* Үнийн мөрийн баруун талд (Link дотор товч байж болохгүй тул гадна нь). */}
      {!soldOut ? <QuickAddButton product={product} className="absolute bottom-3 right-3 z-10 sm:bottom-4 sm:right-4" /> : null}
    </div>
  );
}
