import Image from "next/image";
import Link from "next/link";

import { SaveButton } from "@/components/save-button";
import type { CatalogItem } from "@/lib/site-data";

type CatalogProductCardProps = {
  item: CatalogItem;
  href: string;
};

export function CatalogProductCard({ item, href }: CatalogProductCardProps) {
  return (
    // Зүрх товч Link-ийн гадна (дотор нь товч байж болохгүй), зургийн баруун дээд буланд байрлана.
    <div className="relative transition hover:-translate-y-1">
      <Link
        href={href}
        className="block rounded-[1.35rem] border-2 border-[#ecd3d9] bg-white p-6 transition hover:border-[#a24456] hover:shadow-[0_22px_45px_-28px_rgba(162,68,86,0.45)]"
      >
        <div className="relative overflow-hidden rounded-[1rem] bg-[#faf7f6]">
          {item.badge ? (
            <div className="absolute left-3 top-3 z-10 rounded-lg bg-[#a24456] px-4 py-2 text-[12px] font-bold text-white">
              {item.badge}
            </div>
          ) : null}
          <Image
            src={item.image}
            alt={item.name}
            width={800}
            height={800}
            className="h-80 w-full object-contain"
          />
        </div>

        <div className="mt-5 space-y-4">
          <h3 className="line-clamp-2 text-[12px] font-bold leading-tight text-[#a24456]">{item.name}</h3>
          <div className="flex flex-wrap gap-3 text-[12px] text-[#6c757d]">
            <span className="rounded-lg border border-[#dfe3e6] bg-[#f8f9fa] px-3 py-2">Үлдэгдэл {item.stock}</span>
            <span className="rounded-lg border border-[#dfe3e6] bg-[#f8f9fa] px-3 py-2">Бренд {item.brand}</span>
          </div>
          <p className="text-[12px] font-bold text-[#2f2420]">{item.price}</p>
        </div>
      </Link>
      <SaveButton
        item={{ slug: item.slug, category: item.category, name: item.name, price: item.price, image: item.image }}
        className="absolute right-9 top-9 z-10"
      />
    </div>
  );
}
