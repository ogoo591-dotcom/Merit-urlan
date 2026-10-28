"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "Ямар бүтээгдэхүүн, үйлчилгээ санал болгодог вэ?",
    answer:
      "Гараар нэхсэн чихмэл тоглоом, бэлэг дурсгалын бүтээл, нэхмэлийн утас, товч зэрэг туслах материал болон алхамчилсан онлайн видео сургалт санал болгодог.",
  },
  {
    question: "Танай бизнестэй хэрхэн холбоо барих вэ?",
    answer:
      "99129445 дугаарт залгах эсвэл Facebook, Instagram хуудас болон Messenger-ээр бидэнд бичээрэй.",
  },
  {
    question: "Үнийн санал хэрхэн авах вэ?",
    answer:
      "Бэлэн бүтээгдэхүүний үнэ дэлгүүр хэсэгт харагдана. Захиалгат бүтээлийн үнэ загвар, хэмжээнээс хамаарах тул Messenger-ээр бидэнд бичиж тохирно уу.",
  },
  {
    question: "Захиалга хэрхэн хийх вэ?",
    answer:
      "Дэлгүүрээс хүссэн бараагаа сагсанд нэмээд захиалаарай. Захиалгат бүтээл хийлгэх бол өнгө, хэмжээ, загвараа бидэнд илгээгээрэй.",
  },
] as const;

function QuestionIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.7 9.5a2.4 2.4 0 1 1 3.4 2.2c-.7.3-1.1.9-1.1 1.6v.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r=".9" fill="currentColor" />
    </svg>
  );
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 transition-transform ${open ? "rotate-45" : ""}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="screen-section bg-[#f7ebe8] px-6 py-10 lg:px-[160px]">
      <div className="mx-auto grid w-full max-w-[1600px] gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-[120px]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]">Асуулт, хариулт</p>
          <h2 className="mt-6 font-serif text-[40px] leading-[1.2] text-[#2f2420] lg:text-[48px]">
            Түгээмэл
            <br />
            асуулт, хариулт
          </h2>
          <p className="mt-8 text-[12px] leading-[1.9] text-[#7a6b63]">
            Үйлчлүүлэгчдийн хамгийн их асуудаг асуултуудад товч, ойлгомжтой хариуллаа.
          </p>
          <Link
            href="https://m.me/meriturlan"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-4 rounded-2xl border border-[#efe0d6] bg-[#fdf7f1] p-5 pr-7 transition hover:border-[#6e4f45]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ecd3dd] text-[#2f2420]">
              <QuestionIcon />
            </span>
            <span className="text-[12px] leading-relaxed text-[#7a6b63]">
              Өөр асуулт байна уу?
              <br />
              <span className="font-semibold text-[#2f2420]">Messenger-ээр бичээрэй</span>
            </span>
          </Link>
        </div>

        <ul className="border-t border-[#ead9d4]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <li key={faq.question} className="border-b border-[#ead9d4]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-6 py-6 text-left"
                >
                  <span className="text-[12px] font-medium text-[#7a6b63]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[12px] font-semibold text-[#2f2420]">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition ${
                      isOpen
                        ? "border-[#3d302c] bg-[#3d302c] text-white"
                        : "border-[#efe0d6] bg-[#fdf7f1] text-[#2f2420]"
                    }`}
                  >
                    <PlusIcon open={isOpen} />
                  </span>
                </button>
                {isOpen ? (
                  <p className="-mt-2 max-w-[820px] pb-6 pl-[3.25rem] text-[12px] leading-[1.9] text-[#7a6b63]">
                    {faq.answer}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
