import Image from "next/image";

import type { ShopCategoryMeta, Stat } from "@/lib/site-data";

type ShopHeroProps = {
  meta: ShopCategoryMeta;
  stats: Stat[];
  illustration: "supplies" | "finished";
};

const heroVisuals = {
  supplies: {
    src: "/Hero.jpg",
    alt: "Merit Urlan-ы гараар урласан тоглоомууд",
    frame: "#c98029",
    glow: "#f2dfb7",
    paper: "#f4e7d8",
    imageClassName: "object-cover object-center",
  },
  finished: {
    src: "/finished-bear.svg",
    alt: "Гараар урласан зөөлөн баавгай",
    frame: "#d98a9c",
    glow: "#f4d8df",
    paper: "#f8eaee",
    imageClassName: "object-contain p-10",
  },
} as const;

export function ShopHero({
  meta,
  stats,
  illustration,
}: ShopHeroProps) {
  const visual = heroVisuals[illustration];

  return (
    <>
      <section
        className="overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,240,231,0.94) 50%, rgba(255,255,255,0.98) 100%)",
        }}
      >
        <div className="mx-auto grid w-full max-w-[1800px] gap-12 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12 lg:py-16">
          <div className="flex flex-col justify-center lg:pr-8">
            <p className="text-xs uppercase tracking-[0.42em] text-[#9c7d63]">{meta.heroEyebrow}</p>
            <h1 className="mt-6 whitespace-pre-line font-serif text-6xl leading-[0.84] font-semibold tracking-[-0.06em] text-[#1f1712] sm:text-7xl lg:text-[7.4rem]">
              {meta.heroTitle}
            </h1>
            <p className="mt-8 max-w-xl font-serif text-2xl leading-relaxed text-[#7f746b] italic lg:text-[2.15rem]">
              {meta.heroDescription}
            </p>
          </div>

          <div className="relative mx-auto flex w-full max-w-[920px] justify-center lg:justify-end">
            <div
              className="absolute left-4 top-0 h-40 w-40 rounded-full blur-3xl lg:left-16 lg:h-64 lg:w-64"
              style={{ backgroundColor: visual.glow }}
            />
            <div
              className="absolute bottom-6 right-0 h-56 w-56 rounded-full blur-3xl lg:h-72 lg:w-72"
              style={{ backgroundColor: visual.paper }}
            />
            <div className="relative aspect-[4/5] w-full max-w-[34rem] overflow-hidden border border-white/70 bg-white p-4 shadow-[0_24px_80px_-36px_rgba(53,36,19,0.45)] lg:p-5">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0) 20%), repeating-linear-gradient(135deg, rgba(201,171,132,0.10) 0 12px, rgba(255,255,255,0.1) 12px 28px)",
                }}
              />
              <div
                className="absolute inset-x-4 inset-y-4"
                style={{ boxShadow: `inset 0 0 0 1px ${visual.frame}` }}
              />
              <div className="relative h-full w-full overflow-hidden bg-[#f3ebe2]">
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 44vw"
                  className={visual.imageClassName}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ece1d7] bg-[#fffdf9]">
        <div className="mx-auto grid w-full max-w-[1800px] gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-5xl font-semibold text-[#573a2a] lg:text-6xl">{stat.value}</p>
              <p className="mt-4 text-base uppercase tracking-[0.2em] text-[#9b8572]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
