"use client";

import { Heart } from "lucide-react";

import { useSaved, type SavedItem } from "@/components/saved-provider";

// Барааны зураг дээрх зүрх: дарахад "Хадгалсан" руу нэмэх / хасах.
export function SaveButton({ item, className = "" }: { item: SavedItem; className?: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(item.slug);

  return (
    <button
      type="button"
      onClick={() => toggle(item)}
      aria-pressed={saved}
      aria-label={saved ? `${item.name} хадгалснаас хасах` : `${item.name} хадгалах`}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-[0_8px_20px_-10px_rgba(47,36,32,0.5)] transition hover:scale-105 ${
        saved ? "text-[#a24456]" : "text-[#2f2420] hover:text-[#a24456]"
      } ${className}`}
    >
      <Heart aria-hidden className="h-5 w-5" strokeWidth={1.8} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
