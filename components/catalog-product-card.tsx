import Image from "next/image";
import Link from "next/link";

import type { CatalogItem } from "@/lib/site-data";

type CatalogProductCardProps = {
  item: CatalogItem;
  href: string;
};

export function CatalogProductCard({ item, href }: CatalogProductCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-[1.35rem] border-2 border-[#ff9900] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_22px_45px_-28px_rgba(255,153,0,0.45)]"
    >
      <div className="relative overflow-hidden rounded-[1rem] bg-[#faf7f6]">
        {item.badge ? (
          <div className="absolute left-3 top-3 z-10 rounded-lg bg-[#20c997] px-4 py-2 text-lg font-bold text-white">
            {item.badge}
          </div>
        ) : null}
        <Image
          src={item.image}
          alt={item.name}
          width={800}
          height={800}
          className="h-80 w-full object-cover"
        />
      </div>

      <div className="mt-5 space-y-4">
        <h3 className="line-clamp-2 text-[2rem] font-bold leading-tight text-[#ff9800]">{item.name}</h3>
        <div className="flex flex-wrap gap-3 text-base text-[#6c757d]">
          <span className="rounded-lg border border-[#dfe3e6] bg-[#f8f9fa] px-3 py-2">Үлдэгдэл {item.stock}</span>
          <span className="rounded-lg border border-[#dfe3e6] bg-[#f8f9fa] px-3 py-2">Бренд {item.brand}</span>
        </div>
        <p className="text-[2.2rem] font-bold text-[#111]">{item.price}</p>
      </div>
    </Link>
  );
}
