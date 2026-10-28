import Image from "next/image";
import Link from "next/link";

const highlights = [
  { label: "Алхамчилсан заавар", dot: "bg-[#f0c4cf]" },
  { label: "Видео сургалт", dot: "bg-[#d4cdf0]" },
  { label: "Гараар урласан тоглоом", dot: "bg-[#c6dcc6]" },
] as const;

function HeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
      <path
        d="m12 3.8 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.6-5 2.6.9-5.6-4-3.9 5.6-.8L12 3.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M4.5 11.5L11.5 4.5M5.5 4.5H11.5V10.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 11.5v4c1.4 1.3 3.3 2 5.5 2s4.1-.7 5.5-2v-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YarnIcon() {
  return (
    <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 32 32" fill="none">
      <circle cx="14" cy="17" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 12.5c4 1 8 4 10.5 11.5M10 9.5c4.5 2 8.5 6 10.5 13M6 18c3.5-.5 7 .5 10 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M22 9 28 3M26 4.5l1.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M25 13.5v3M23.5 15h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function HomeHero() {
  return (
    <section className="screen-section relative overflow-hidden bg-[#fcf6f0] bg-[radial-gradient(#efe2d7_1px,transparent_1px)] [background-size:28px_28px]">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#f6dfe3] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-[30rem] w-[30rem] rounded-full bg-[#ebe4f6] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-[22rem] left-1/2 h-[30rem] w-[140%] -translate-x-1/2 rounded-[50%] bg-[#eef0e5]" />

      <div className="relative mx-auto grid w-full max-w-[2000px] items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1fr_1.05fr] lg:px-[160px]">
        <div>
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 shadow-[0_8px_24px_-16px_rgba(70,45,35,0.4)]">
            <HeartIcon className="h-5 w-5 text-[#c98a9a]" />
            <span className="text-[11px] font-semibold text-[#5a4a44]">
              Хайраар урласан бүтээл бүр онцгой
            </span>
          </div>

          <h1 className="mt-6 font-serif text-[44px] leading-[1.12] tracking-[-0.01em] text-[#2f2420] sm:text-[56px] lg:text-[68px]">
            Бяцхан бүтээлээс
            <br />
            <span className="text-[#6e4f45]">
              том{" "}
              <span className="relative inline-block">
                аз жаргал
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-4 w-[62%] text-[#e4bfcc]"
                  viewBox="0 0 200 16"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 10C55 4 130 3 198 9"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
            <br />
            эхэлнэ
          </h1>

          <p className="mt-6 max-w-[600px] text-[12px] leading-[1.9] text-[#7a6b63]">
            Өөрийн гараар өхөөрдөм чихмэл тоглоом урлаж, бүтээх аз жаргалыг мэдрээрэй.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 rounded-[14px] bg-[#6e4f45] px-7 py-4 text-[12px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(70,45,35,0.7)] transition hover:bg-[#5c4038]"
            >
              Бүтээлээ эхлүүлье
              <ArrowUpRightIcon />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-3 rounded-[14px] border border-[#eadfd5] bg-white px-7 py-4 text-[12px] font-semibold text-[#4a3b35] transition hover:border-[#6e4f45] hover:text-[#6e4f45]"
            >
              <GraduationCapIcon />
              Онлайн сургалт үзэх
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
            {highlights.map((item) => (
              <li key={item.label} className="flex items-center gap-2.5 text-[12px] text-[#7a6b63]">
                <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[680px] lg:mx-0">
          <div className="rounded-[44px] border border-[#f1dcd8] bg-white/60 p-4 shadow-[0_30px_70px_-40px_rgba(70,45,35,0.45)]">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[34px] bg-[#f3ebe2]">
              <Image
                src="/Hero.jpg"
                alt="Merit Urlan-ы гараар урласан тоглоомууд"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 680px"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="absolute -left-5 top-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ddd3f3] text-[#4a3b35] shadow-[0_12px_28px_-14px_rgba(70,45,35,0.5)]">
            <StarIcon />
          </div>

          <div className="absolute -right-6 top-[36%] flex h-14 w-14 items-center justify-center rounded-full bg-[#cfe0d0] text-[#4a3b35] shadow-[0_12px_28px_-14px_rgba(70,45,35,0.5)]">
            <HeartIcon />
          </div>

          <div className="absolute -bottom-10 left-6 flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_24px_50px_-24px_rgba(70,45,35,0.45)] sm:left-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#f6dbe2] to-[#ecc6d1] text-white">
              <YarnIcon />
            </div>
            <div>
              <p className="text-[11px] text-[#8a7b73]">Бүтээх мөч бүр</p>
              <p className="mt-0.5 text-[12px] font-semibold text-[#2f2420]">Дурсамж болон үлдэнэ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
