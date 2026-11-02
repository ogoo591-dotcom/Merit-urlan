"use client";

import { Check, Share2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useAuthModal } from "@/components/auth/auth-modal-provider";
import { courseCartSlug, useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

// Том зураг + баруун талд (утсан дээр доор) жижиг зургууд.
export function CourseGallery({ title, images }: { title: string; images: string[] }) {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative aspect-square flex-1 overflow-hidden rounded-[28px] bg-[#faf7f6]">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${title} — зураг ${index + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 620px"
          className="object-cover animate-[fade-in_0.2s_ease-out]"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-3 sm:w-24 sm:flex-col" role="group" aria-label="Зургууд">
          {images.map((src, imageIndex) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`Зураг ${imageIndex + 1}`}
              aria-pressed={imageIndex === index}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition sm:w-full ${
                imageIndex === index ? "border-[#a24456]" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Хуваалцах"
      title={copied ? "Холбоос хуулагдлаа" : "Хуваалцах"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7e9ec] text-[#a24456] transition hover:bg-[#a24456] hover:text-white"
    >
      {copied ? <Check aria-hidden className="h-4 w-4" /> : <Share2 aria-hidden className="h-4 w-4" />}
    </button>
  );
}

// "Сагслах" — сагсанд нэмнэ. "Захиалах" — сагсанд нэмээд шууд захиалгын хуудас руу (нэвтрээгүй бол нэвтрэх).
export function CourseCartActions({ course }: { course: { id: string; title: string; price: number; image: string } }) {
  const { items, addItem } = useCart();
  const { requireAuth } = useAuthModal();
  const slug = courseCartSlug(course.id);
  const inCart = items.some((line) => line.slug === slug);
  const [justAdded, setJustAdded] = useState(false);

  const add = () =>
    addItem({
      slug,
      kind: "course",
      name: course.title,
      price: formatPrice(course.price),
      priceValue: course.price,
      image: course.image,
      href: `/courses/${course.id}`,
    });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => {
          add();
          setJustAdded(true);
          window.setTimeout(() => setJustAdded(false), 1800);
        }}
        className={`inline-flex items-center justify-center gap-2.5 rounded-2xl border-2 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] transition ${
          justAdded
            ? "border-[#2fa65a] bg-[#e3f4e8] text-[#1f7a3d]"
            : "border-[#eadfd5] bg-white text-[#2f2420] hover:border-[#a24456] hover:text-[#a24456]"
        }`}
      >
        {justAdded ? <Check aria-hidden className="h-4 w-4" /> : <ShoppingCart aria-hidden className="h-4 w-4" />}
        {justAdded ? "Сагсанд нэмэгдлээ" : inCart ? "Сагсанд байгаа" : "Сагслах"}
      </button>
      <button
        type="button"
        onClick={() => {
          add();
          requireAuth("/checkout");
        }}
        className="rounded-2xl bg-[#3d302c] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#2f2420]"
      >
        Захиалах
      </button>
    </div>
  );
}
