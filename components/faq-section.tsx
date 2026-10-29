"use client";

import Link from "next/link";
import { useId, useState } from "react";

const faqs = [
  {
    question: "Захиалга хэрхэн хийх вэ?",
    answer:
      "Дэлгүүрээс хүссэн бараагаа сагсанд нэмээд \"Захиалах\" товч дарна. Утасны дугаар эсвэл имэйлээр нэвтэрч, хүргэлтийн хаягаа оруулан төлбөрөө төлснөөр захиалга баталгаажна.",
  },
  {
    question: "Өөрийн хүссэн загвар, өнгөөр захиалж болох уу?",
    answer:
      "Болно. Өнгө, хэмжээ, загвар эсвэл тоглоом дээр нэр хатгуулах хүсэлтээ Messenger-ээр зурагтай нь илгээгээрэй. Захиалгат бүтээлийн үнэ, хугацааг загварын нарийн төвөгтэй байдлаас хамааран тохирно.",
  },
  {
    question: "Хүргэлт хэрхэн хийгддэг вэ?",
    answer:
      "Улаанбаатар хотод болон орон нутагт хүргэлт гарах боломжтой. Хүргэлтийн хаягаа захиалгын үед оруулах ба хүргэлтийн нөхцөл, хугацааг захиалга баталгаажуулах үед танд мэдэгдэнэ. Бэлэн бараа 24–48 цагийн дотор, бэлэн бус захиалга 3–7 хоногийн дотор хийгдэн хүргэгдэнэ.",
  },
  {
    question: "Нэхэж сурч эхлэхэд юу хэрэгтэй вэ?",
    answer:
      "Дэгээ, утас, чихмэл, нүд зэрэг туслах материалыг манай дэлгүүрээс авч болно. Алхамчилсан заавар, видео сургалт манайд байдаг тул анх удаа нэхэж буй хүн ч эхнээс нь сурах боломжтой.",
  },
  {
    question: "Нэхмэл тоглоомыг хэрхэн арчлах вэ?",
    answer:
      "Бүлээн усанд зөөлөн угаалгын бодисоор гараар зөөлөн угааж, мушгилгүй шахаж усыг нь гаргаад хэлбэрийг нь засаж хэвтээгээр хатаана. Угаалгын машин, хатаагч ашиглахгүй байхыг зөвлөж байна.",
  },
] as const;

// Эхний хэдэн асуулт харагдаж, бусад нь "Бүх асуултыг харах" дарахад гарч ирнэ.
const visibleCount = 4;

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
      className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Өндрийг grid-template-rows (0fr → 1fr)-ээр зөөлөн нээж хаана.
function Collapse({ open, id, children }: { open: boolean; id?: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function FaqItem({
  index,
  question,
  answer,
  open,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <li
      className={`rounded-2xl border transition-colors duration-300 ${
        open
          ? "border-[#ecd3d9] bg-white shadow-[0_18px_40px_-30px_rgba(162,68,86,0.45)]"
          : "border-transparent hover:bg-white/50"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-5 px-5 py-5 text-left"
      >
        <span className={`text-[11px] font-semibold tabular-nums ${open ? "text-[#a24456]" : "text-[#a3958d]"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-[12px] font-semibold text-[#2f2420]">{question}</span>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
            open ? "border-[#a24456] bg-[#a24456] text-white" : "border-[#ead9d4] bg-[#fdf7f1] text-[#2f2420]"
          }`}
        >
          <PlusIcon open={open} />
        </span>
      </button>
      <Collapse open={open} id={panelId}>
        <p className="max-w-[820px] pb-6 pl-[3.6rem] pr-16 text-[12px] leading-[1.9] text-[#7a6b63]">{answer}</p>
      </Collapse>
    </li>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const hiddenCount = faqs.length - visibleCount;

  const renderItem = (index: number) => (
    <FaqItem
      key={faqs[index].question}
      index={index}
      question={faqs[index].question}
      answer={faqs[index].answer}
      open={openIndex === index}
      onToggle={() => setOpenIndex(openIndex === index ? null : index)}
    />
  );

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
            Захиалга, хүргэлт, арчилгаа болон сургалттай холбоотой хамгийн их асуудаг асуултуудад хариуллаа.
          </p>
          <Link
            href="https://m.me/meriturlan"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-4 rounded-2xl border border-[#efe0d6] bg-[#fdf7f1] p-5 pr-7 transition hover:border-[#a24456]"
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

        <div>
          <ul className="space-y-2">{faqs.slice(0, visibleCount).map((_, index) => renderItem(index))}</ul>

          {hiddenCount > 0 ? (
            <>
              <Collapse open={showAll}>
                <ul className="space-y-2 pt-2">
                  {faqs.slice(visibleCount).map((_, offset) => renderItem(visibleCount + offset))}
                </ul>
              </Collapse>

              <button
                type="button"
                onClick={() => {
                  // Хураахад нуугдах асуулт нээлттэй байвал хаана.
                  if (showAll && openIndex !== null && openIndex >= visibleCount) setOpenIndex(null);
                  setShowAll((value) => !value);
                }}
                aria-expanded={showAll}
                className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[#ead9d4] bg-[#fdf7f1] px-6 py-3 text-[12px] font-semibold text-[#2f2420] transition hover:border-[#a24456] hover:text-[#a24456]"
              >
                {showAll ? "Хураах" : `Бүх асуултыг харах (+${hiddenCount})`}
                <ChevronIcon open={showAll} />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
