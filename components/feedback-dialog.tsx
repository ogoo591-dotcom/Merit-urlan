"use client";

import { ArrowUpRight, CheckCircle2, Clock, MapPin, MessageCircle, MessageSquareText, Phone, Send, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";

import { sendFeedback, type FeedbackState } from "@/app/actions";
import { SubmitButton } from "@/components/admin/submit-button";

const labelClass = "block text-[12px] font-semibold text-[#2f2420]";
const inputClass =
  "mt-2 w-full rounded-xl border border-[#ead9d4] bg-white/60 px-4 py-3 text-[12px] text-[#2f2420] outline-none transition placeholder:text-[#a3958d] focus:border-[#a24456]";

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 border-t border-white/10 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-[#d9b8a8]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-[#b5a59c]">{label}</p>
        <div className="mt-1 text-[12px] font-medium leading-relaxed text-white">{children}</div>
      </div>
    </li>
  );
}

// Хаагдахад устаж, дахин нээхэд хоосон маягт (мөн алдаа, амжилтын төлөв) гарна.
function FeedbackForm({ onClose }: { onClose: () => void }) {
  const [state, action] = useActionState<FeedbackState, FormData>(sendFeedback, {});

  if (state.sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 aria-hidden className="h-12 w-12 text-[#2e7a43]" />
        <h2 className="mt-5 text-[22px] font-semibold text-[#2f2420]">Баярлалаа!</h2>
        <p role="status" className="mt-3 max-w-[320px] text-[12px] leading-[1.9] text-[#7a6b63]">
          Таны санал хүсэлт бидэнд ирлээ. Шаардлагатай бол таны дугаарт эргэн холбогдоно.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-xl bg-[#3d302c] px-8 py-3.5 text-[12px] font-semibold text-white transition hover:bg-[#2f2420]"
        >
          Хаах
        </button>
      </div>
    );
  }

  return (
    <form action={action}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]">Санал хүсэлтийн маягт</p>
      <h2 id="feedback-title" className="mt-3 text-[26px] font-semibold text-[#2f2420]">
        Санал хүсэлт илгээх
      </h2>
      <p className="mt-2 text-[12px] leading-[1.9] text-[#7a6b63]">Талбаруудыг бөглөөд илгээнэ үү.</p>

      {state.error ? (
        <p role="alert" className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#a33a3a]">
          {state.error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Таны нэр
          <input
            name="name"
            required
            autoFocus
            maxLength={80}
            autoComplete="name"
            defaultValue={state.values?.name}
            placeholder="Нэрээ оруулна уу"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Утасны дугаар
          <input
            name="phone"
            type="tel"
            required
            maxLength={20}
            autoComplete="tel"
            defaultValue={state.values?.phone}
            placeholder="Утасны дугаараа оруулна уу"
            className={inputClass}
          />
        </label>
      </div>

      <label className={`${labelClass} mt-5`}>
        Сонирхож буй бүтээгдэхүүн / үйлчилгээ
        <input
          name="interest"
          maxLength={120}
          defaultValue={state.values?.interest}
          placeholder="Юу сонирхож байгаагаа бичнэ үү"
          className={inputClass}
        />
      </label>

      <label className={`${labelClass} mt-5`}>
        Мессеж
        <textarea
          name="message"
          required
          rows={5}
          maxLength={2000}
          defaultValue={state.values?.message}
          placeholder="Санал хүсэлтээ дэлгэрэнгүй бичнэ үү"
          className={inputClass}
        />
      </label>

      {/* Хүнд харагдахгүй — автомат спам бот л бөглөнө. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <SubmitButton
        pendingText="Илгээж байна…"
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#3d302c] px-6 py-4 text-[12px] font-semibold text-white transition hover:bg-[#2f2420] disabled:opacity-70"
      >
        Санал хүсэлт илгээх
        <Send aria-hidden className="h-4 w-4" />
      </SubmitButton>
    </form>
  );
}

export function FeedbackDialog() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-[#efe0d6] bg-[#fdf7f1] p-3 text-left transition hover:border-[#a24456]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ecd3dd] text-[#2f2420]">
          <MessageSquareText aria-hidden className="h-5 w-5" strokeWidth={1.6} />
        </span>
        <span className="min-w-0 text-[11px] leading-snug text-[#7a6b63]">
          Санал байна уу?
          <br />
          <span className="font-semibold text-[#2f2420]">Санал хүсэлт</span>
        </span>
      </button>

      {/* Бичсэн текст санамсаргүй устахгүйн тулд гадна дарахад хаагдахгүй: зөвхөн X эсвэл Esc. */}
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1c1513]/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            aria-label="Санал хүсэлт"
            className="relative grid max-h-full w-full max-w-[1000px] overflow-y-auto rounded-[28px] bg-[#fdf7f1] shadow-2xl md:grid-cols-[0.8fr_1fr]"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Хаах"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[#7a6b63] transition hover:bg-[#f1e4da]"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>

            <div className="order-last flex flex-col bg-[#3d302c] p-8 md:order-first md:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b5a59c]">Холбоо барих мэдээлэл</p>
              <p className="mt-4 text-[26px] font-semibold leading-tight text-white">
                Танд хэрэгтэй
                <br />
                мэдээллийг ярилцъя.
              </p>
              <p className="mt-4 text-[12px] leading-[1.9] text-[#cfc3bc]">Санал, хүсэлт, асуултаа бичээрэй. Эсвэл доорх сувгаар холбогдоорой.</p>

              <ul className="mt-6 border-b border-white/10">
                <ContactRow icon={<Phone aria-hidden className="h-[18px] w-[18px]" />} label="Утас">
                  <a href="tel:+97699129445" className="transition hover:text-[#ecd3dd]">
                    +976 9912 9445
                  </a>
                </ContactRow>
                <ContactRow icon={<ArrowUpRight aria-hidden className="h-[18px] w-[18px]" />} label="Facebook">
                  <a href="https://www.facebook.com/meriturlan" target="_blank" rel="noreferrer" className="transition hover:text-[#ecd3dd]">
                    Facebook хуудсыг нээх
                  </a>
                </ContactRow>
                <ContactRow icon={<MapPin aria-hidden className="h-[18px] w-[18px]" />} label="Хаяг">
                  Улаанбаатар хот, БГД, 11-р хороо, Богд арын 813-32 тоот
                </ContactRow>
                <ContactRow icon={<Clock aria-hidden className="h-[18px] w-[18px]" />} label="Захиалга">
                  Сайтаар 24/7 захиалж болно
                </ContactRow>
              </ul>

              <a
                href="https://m.me/meriturlan"
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center gap-2.5 rounded-xl bg-[#75574f] px-6 py-3.5 text-[12px] font-semibold text-white transition hover:bg-[#866459]"
              >
                <MessageCircle aria-hidden className="h-4 w-4" />
                Messenger-ээр холбогдох
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </a>
            </div>

            <div className="p-8 md:p-10">
              <FeedbackForm onClose={close} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
