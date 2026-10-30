import { ArrowDown, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import galleryImages from "@/lib/gallery-images.json";
import { aboutHero } from "@/lib/mock/about";

const heroImage =
  galleryImages.find((image) => image.source === aboutHero.imageSource) ?? { src: "/Hero.jpg", width: 5, height: 4 };

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#fcf6f0] bg-[radial-gradient(#efe2d7_1px,transparent_1px)] [background-size:28px_28px]">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#f6dfe3] opacity-60 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-12 px-6 py-14 lg:grid-cols-[1fr_1.05fr] lg:px-[144px] lg:py-20">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">{aboutHero.eyebrow}</p>
          <h1 className="mt-5 font-serif text-[48px] leading-[1.1] text-[#2f2420] lg:text-[68px]">{aboutHero.title}</h1>
          <p className="mt-6 max-w-[560px] font-serif text-[22px] leading-[1.5] text-[#6e4f45]">{aboutHero.tagline}</p>
          <p className="mt-5 max-w-[560px] text-[12px] leading-[1.9] text-[#7a6b63]">{aboutHero.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#story"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#a24456] px-6 py-3.5 text-[12px] font-semibold text-white transition hover:bg-[#8a3748]"
            >
              Бидний түүх
              <ArrowDown aria-hidden className="h-4 w-4" />
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 rounded-xl border border-[#e3d6cb] bg-white px-6 py-3.5 text-[12px] font-semibold text-[#2f2420] transition hover:border-[#a24456] hover:text-[#a24456]"
            >
              <ShoppingBag aria-hidden className="h-4 w-4" />
              Бүтээгдэхүүн үзэх
            </Link>
          </div>
        </div>

        <div className="rounded-[40px] border border-[#f1dcd8] bg-white/60 p-3 shadow-[0_30px_70px_-40px_rgba(70,45,35,0.45)]">
          <div
            className="relative overflow-hidden rounded-[32px] bg-[#f3ebe2]"
            style={{ aspectRatio: `${heroImage.width} / ${heroImage.height}` }}
          >
            <Image
              src={heroImage.src}
              alt="Merit урлангийн гараар урласан тоглоомууд"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 700px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
