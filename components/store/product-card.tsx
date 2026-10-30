import Image from "next/image";
import Link from "next/link";

import { SaveButton } from "@/components/save-button";
import { AvailabilityBadge } from "@/components/store/availability-badge";
import { storeMeta } from "@/components/store/store-paths";
import { formatPrice } from "@/lib/format";
import type { StoreProduct } from "@/lib/mock/products";

export function ProductCard({ product }: { product: StoreProduct }) {
  const base = storeMeta[product.type].base;
  const soldOut = product.stock < 1;

  return (
    <div className="group relative transition hover:-translate-y-1">
      <Link
        href={`${base}/${product.id}`}
        className="block h-full rounded-[22px] border border-[#ecd3d9] bg-white p-4 transition group-hover:border-[#a24456] group-hover:shadow-[0_22px_45px_-30px_rgba(162,68,86,0.5)]"
      >
        <div className="relative aspect-square overflow-hidden rounded-[16px] bg-[#faf7f6]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 25vw"
            className={`object-contain transition duration-500 group-hover:scale-[1.03] ${soldOut ? "opacity-50 grayscale" : ""}`}
          />
          <AvailabilityBadge product={product} className="absolute left-3 top-3" />
        </div>
        <div className="px-1 pb-1 pt-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#9c8c84]">
            {product.category}
            {product.origin ? ` · ${product.origin}` : ""}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-snug text-[#2f2420]">{product.name}</h3>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[14px] font-bold text-[#a24456]">{formatPrice(product.price)}</p>
            {!soldOut ? <p className="text-[10px] text-[#9c8c84]">Үлдэгдэл {product.stock}</p> : null}
          </div>
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
        className="absolute right-7 top-7 z-10"
      />
    </div>
  );
}
