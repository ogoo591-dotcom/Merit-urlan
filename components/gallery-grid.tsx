"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type GalleryImage = { src: string; width: number; height: number; position?: string; fit?: "contain" };

// Нүүр хуудсанд багтаахын тулд эхний 6-г торонд харуулж, үлдсэнийг lightbox-оор үзүүлнэ.
const tiles = ["md:col-span-2 md:row-span-2", "", "", "", "", ""];

function ZoomIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m16 16 4 4M11 8.5v5M8.5 11h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === "left" ? "m14.5 6-6 6 6 6" : "m9.5 6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const altText = (index: number) => `Merit урлангийн бүтээл ${index + 1}`;

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const shown = images.slice(0, tiles.length);
  const hidden = images.length - shown.length;

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (delta: number) => setActive((index) => (index === null ? index : (index + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  if (!images.length) return null;
  const current = active === null ? null : images[active];

  return (
    <>
      <div className="mt-6 grid auto-rows-[220px] gap-4 md:grid-cols-3 lg:h-[calc(100svh-var(--header-h,130px)-230px)] lg:grid-rows-3">
        {shown.map((image, index) => {
          const isLast = index === shown.length - 1 && hidden > 0;
          return (
            <button
              key={image.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={isLast ? `Бүх ${images.length} зургийг үзэх` : `${altText(index)} томруулж үзэх`}
              className={`group relative overflow-hidden rounded-[24px] bg-[#2f2420] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8786b] ${tiles[index]}`}
            >
              {image.fit === "contain" ? (
                // Бүтнээр нь харуулахад үлдэх хоосон зайг тухайн зургийн бүдгэрүүлсэн хувилбараар дүүргэнэ.
                <Image src={image.src} alt="" aria-hidden fill sizes="10vw" className="scale-110 object-cover opacity-60 blur-2xl" />
              ) : null}
              <Image
                src={image.src}
                alt={altText(index)}
                fill
                sizes={index === 0 ? "(max-width: 768px) 90vw, 50vw" : "(max-width: 768px) 90vw, 25vw"}
                className={`transition duration-700 group-hover:scale-105 ${image.fit === "contain" ? "object-contain" : "object-cover"}`}
                style={image.position ? { objectPosition: image.position } : undefined}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              {isLast ? (
                // Сүүлийн зургийг бүрхэхгүйн тулд жижиг шошгоор "бүх зураг" гэж харуулна.
                <span className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/25 bg-[#2f2420]/70 px-4 py-2 text-[11px] font-medium text-white backdrop-blur transition group-hover:bg-[#2f2420]/90">
                  <ZoomIcon />
                  Бүх зураг (+{hidden})
                </span>
              ) : (
                <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#2f2420]/50 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <ZoomIcon />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {current && active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Зураг томоор харах"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1c1513]/95 p-4 sm:p-10"
          onClick={(event) => event.target === event.currentTarget && close()}
          onTouchStart={(event) => (touchStart.current = event.touches[0].clientX)}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const distance = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1);
            touchStart.current = null;
          }}
        >
          <Image
            key={current.src}
            src={current.src}
            alt={altText(active)}
            width={current.width}
            height={current.height}
            sizes="100vw"
            priority
            className="h-auto max-h-[85svh] w-auto max-w-full rounded-[16px] object-contain shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
          />

          <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] tracking-[0.1em] text-white/80">
            {active + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Хаах"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[22px] text-white transition hover:bg-white/20"
          >
            ×
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Өмнөх зураг"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Дараагийн зураг"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
              >
                <ArrowIcon direction="right" />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
