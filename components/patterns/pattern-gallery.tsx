"use client";

import Image from "next/image";
import { useState } from "react";

// Нүүр зураг + урьдчилан харах хуудсууд (ДЭЭЖ тэмдэгтэй). Бүтэн PDF зөвхөн худалдаж авсны дараа.
export function PatternGallery({ name, images }: { name: string; images: Array<{ src: string; label: string }> }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[#efe4da] bg-white">
        <Image
          key={current.src}
          src={current.src}
          alt={`${name} — ${current.label}`}
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 600px"
          className={index === 0 ? "object-cover" : "object-contain p-3"}
        />
        {index > 0 ? (
          <span className="absolute bottom-4 left-4 rounded-full bg-[#2f2420]/75 px-3 py-1.5 text-[10px] font-semibold text-white">
            Урьдчилан харах · {current.label}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex gap-3" role="group" aria-label="Зургууд">
        {images.map((image, imageIndex) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setIndex(imageIndex)}
            aria-label={image.label}
            aria-pressed={imageIndex === index}
            className={`relative h-24 w-20 overflow-hidden rounded-xl border-2 bg-white transition ${
              imageIndex === index ? "border-[#a24456]" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={image.src} alt="" fill sizes="80px" className={imageIndex === 0 ? "object-cover" : "object-contain"} />
          </button>
        ))}
      </div>
    </div>
  );
}
