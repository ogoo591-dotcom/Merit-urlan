import { BadgeCheck, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatPatternPrice, type PatternSummary } from "@/lib/data/patterns";

export function PatternCard({ pattern, purchased }: { pattern: PatternSummary; purchased: boolean }) {
  return (
    <Link
      href={`/patterns/${pattern.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#ecd3d9] bg-white transition hover:-translate-y-1 hover:border-[#a24456] hover:shadow-[0_22px_45px_-30px_rgba(162,68,86,0.5)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#faf7f6]">
        <Image
          src={pattern.cover.src}
          alt={pattern.name}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-[#2f2420]">
          <FileText aria-hidden className="h-3.5 w-3.5 text-[#a24456]" /> PDF · {pattern.pages} хуудас
        </span>
        {purchased ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#3d302c] px-3 py-1.5 text-[10px] font-semibold text-white">
            <BadgeCheck aria-hidden className="h-3.5 w-3.5" /> Авсан
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] uppercase tracking-[0.12em] text-[#9c8c84]">
          {pattern.typeLabel} · {pattern.levelLabel}
        </p>
        <h3 className="mt-1.5 text-[15px] font-semibold text-[#2f2420]">{pattern.name}</h3>
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[#7a6b63]">{pattern.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-[11px] text-[#7a6b63]">{pattern.sourceLanguage} → Монгол орчуулга</p>
          <p className="text-[15px] font-bold text-[#a24456]">{formatPatternPrice(pattern.price)}</p>
        </div>
      </div>
    </Link>
  );
}
