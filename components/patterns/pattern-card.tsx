import { BadgeCheck, Gift, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatPatternPrice, type PatternSummary } from "@/lib/data/patterns";

export function PatternCard({ pattern, purchased }: { pattern: PatternSummary; purchased: boolean }) {
  const open = pattern.isFree || purchased;

  return (
    <Link href={`/patterns/${pattern.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-[#faf7f6] shadow-[0_18px_36px_-28px_rgba(70,45,35,0.6)]">
        <Image
          src={pattern.cover.src}
          alt={pattern.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1280px) 40vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold ${
            pattern.isFree ? "bg-[#e7f4ea] text-[#1f7a3d]" : purchased ? "bg-[#3d302c] text-white" : "bg-white/95 text-[#a24456]"
          }`}
        >
          {pattern.isFree ? <Gift aria-hidden className="h-3.5 w-3.5" /> : purchased ? <BadgeCheck aria-hidden className="h-3.5 w-3.5" /> : <Lock aria-hidden className="h-3.5 w-3.5" />}
          {pattern.isFree ? "Үнэгүй" : purchased ? "Авсан" : "Төлбөртэй"}
        </span>
      </div>
      <div className="px-1 pt-3">
        <h3 className="text-[14px] font-semibold text-[#2f2420] group-hover:text-[#a24456]">{pattern.name}</h3>
        <p className="mt-1 text-[11px] text-[#9c8c84]">
          {pattern.typeLabel} · {pattern.levelLabel}
        </p>
        <p className="mt-2 text-[12px] font-semibold text-[#a24456]">{open ? "Схем үзэх →" : `${formatPatternPrice(pattern.price)} · Төлөөд авах →`}</p>
      </div>
    </Link>
  );
}
