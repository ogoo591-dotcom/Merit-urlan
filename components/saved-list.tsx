"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SaveButton } from "@/components/save-button";
import { useSaved } from "@/components/saved-provider";

// Хуучин (/shop/...) хадгалсан бараа redirect-ээр шинэ хуудас руу шилжинэ.
const storeCategories = ["products", "materials"];

export function SavedList() {
  const { items } = useSaved();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-[520px] rounded-[28px] border border-[#efe4da] bg-white p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7e9ec] text-[#a24456]">
          <Heart aria-hidden className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <h2 className="mt-6 font-serif text-[28px] text-[#2f2420]">Хадгалсан бараа алга</h2>
        <p className="mx-auto mt-3 max-w-[380px] text-[12px] leading-[1.9] text-[#7a6b63]">
          Барааны зураг дээрх зүрхийг дарж хадгалаад, дараа нь эндээс хурдан олоорой.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="rounded-xl bg-[#a24456] px-6 py-3.5 text-[12px] font-semibold text-white transition hover:bg-[#8a3748]">
            Бүтээгдэхүүн үзэх
          </Link>
          <Link href="/materials" className="rounded-xl border border-[#e3d6cb] px-6 py-3.5 text-[12px] font-semibold text-[#2f2420] transition hover:border-[#a24456] hover:text-[#a24456]">
            Материал үзэх
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.slug} className="relative">
          <Link
            href={storeCategories.includes(item.category) ? `/${item.category}/${item.slug}` : `/shop/${item.category}/${item.slug}`}
            className="block rounded-[1.35rem] border-2 border-[#ecd3d9] bg-white p-5 transition hover:border-[#a24456]"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={600}
              height={600}
              className="aspect-square w-full rounded-[1rem] bg-[#faf7f6] object-contain"
            />
            <p className="mt-4 line-clamp-2 text-[12px] font-bold text-[#a24456]">{item.name}</p>
            <p className="mt-2 text-[12px] font-bold text-[#2f2420]">{item.price}</p>
          </Link>
          <SaveButton item={item} className="absolute right-8 top-8" />
        </li>
      ))}
    </ul>
  );
}
