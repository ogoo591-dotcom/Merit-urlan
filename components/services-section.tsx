"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import galleryImages from "@/lib/gallery-images.json";

function BookIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 6.5C10.3 5.2 8 4.5 3.5 4.5v14c4.5 0 6.8.7 8.5 2 1.7-1.3 4-2 8.5-2v-14c-4.5 0-6.8.7-8.5 2Zm0 0v14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path
        d="M6.5 11.5v4c1.4 1.3 3.3 2 5.5 2s4.1-.7 5.5-2v-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <rect x="4.5" y="7.5" width="15" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 3.5c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M6 15.5c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 transition-transform ${open ? "" : "rotate-180"}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M5 12.5 10 7.5l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
      <path d="M4.5 11.5L11.5 4.5M5.5 4.5H11.5V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const services = [
  {
    title: "Хийх заавар",
    description: "Алхам алхмаар өөрөө урлаарай",
    cta: "Заавар үзэх",
    href: "/courses",
    icon: BookIcon,
    // Бичлэг, схемийн зураг бэлэн болтол хоосон харагдана.
    image: null,
    placeholder: "Схем, зааврын зураг удахгүй нэмэгдэнэ",
    card: "bg-[#fdf6ee] border-[#f3e6d8]",
  },
  {
    title: "Онлайн сургалт",
    description: "Анхан шатнаас ур чадвараа хөгжүүлээрэй",
    cta: "Сургалт сонгох",
    href: "/courses",
    icon: GraduationCapIcon,
    image: null,
    placeholder: "Видео сургалт удахгүй нэмэгдэнэ",
    card: "bg-[#f5e1e5] border-[#efd3d9]",
  },
  {
    title: "Чихмэл тоглоом",
    description: "Гараар урласан хөөрхөн бүтээлүүд",
    cta: "Дэлгүүр үзэх",
    // Шууд барааны жагсаалт руу гүйлгэж очно.
    href: "/shop/finished#products",
    icon: BagIcon,
    // raw-images доторх файлын нэрээр (npm run compress-ийн дараа ч зөв зургаа олно).
    image: galleryImages.find((entry) => entry.source === "21.jpg")?.src ?? null,
    placeholder: "Зураг удахгүй нэмэгдэнэ",
    card: "bg-[#ebe3f4] border-[#e0d6ee]",
  },
] as const;

export function ServicesSection() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section
      id="services"
      className="screen-section bg-gradient-to-br from-[#f8e9ea] via-[#f6eeec] to-[#f3eef5] px-6 py-10 lg:px-[200px]"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mx-auto max-w-[780px] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]">
            Бүтээгдэхүүн, үйлчилгээ
          </p>
          <h2 className="mt-5 font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[48px]">
            Бүтээх, сурах, сонгох
          </h2>
          <p className="mt-6 text-[12px] leading-[1.9] text-[#7a6b63]">
            Өөрийн гараар чихмэл тоглоом урлах заавар, видео сургалт болон бэлэн бүтээлүүдээс
            хэрэгтэй чиглэлээ сонгоорой.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="mt-8 flex w-full items-center gap-4 rounded-2xl border border-[#f1e4da] bg-[#fdf7f1] px-6 py-3 text-left shadow-[0_10px_30px_-24px_rgba(70,45,35,0.5)]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f2d9e0] text-[#4a3b35]">
            <SparkleIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-semibold text-[#2f2420]">Эхлэх чиглэлээ сонгоно уу</span>
            <span className="mt-0.5 block text-[11px] font-medium text-[#7a6b63]">
              Гурван үндсэн үйлчилгээг нэг дороос
            </span>
          </span>
          <span className="text-[#2f2420]">
            <ChevronIcon open={isOpen} />
          </span>
        </button>

        {isOpen ? (
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className={`flex flex-col rounded-[28px] border p-4 shadow-[0_20px_40px_-34px_rgba(70,45,35,0.5)] ${service.card}`}
                >
                  <div className="relative">
                    {service.image ? (
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#f3ebe2]">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 768px) 90vw, 30vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-[#2f2420]/12 bg-white/45 px-6 text-center text-[#a3958d]">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#7a6b63]">
                          <Icon />
                        </span>
                        <span className="text-[11px] font-medium">{service.placeholder}</span>
                      </div>
                    )}
                    {service.image ? (
                      <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-[#2f2420]">
                        <Icon />
                      </span>
                    ) : null}
                    <span className="absolute right-5 top-5 rounded-full bg-[#2f2420]/75 px-3 py-1.5 text-[9px] font-semibold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-4 pb-3 pt-5">
                    <h3 className="text-[12px] font-semibold text-[#2f2420]">{service.title}</h3>
                    <p className="mt-3 text-[12px] text-[#7a6b63]">{service.description}</p>
                    <Link
                      href={service.href}
                      className="mt-5 flex items-center justify-between rounded-xl bg-[#3d302c] px-5 py-4 text-[12px] font-semibold text-white transition hover:bg-[#2f2420]"
                    >
                      {service.cta}
                      <ArrowUpRightIcon />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
