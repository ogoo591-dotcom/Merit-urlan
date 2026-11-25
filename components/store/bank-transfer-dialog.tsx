"use client";

import { Check, Clock, Copy, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { formatPrice } from "@/lib/format";
import type { PaymentInvoice } from "@/types/payments";
import { BANK } from "@/lib/site-config";

// Дансаар шилжүүлэх цонх (урсгал: lib/payments.ts).
// 1-р алхам: данс, дүн, гүйлгээний утга → "Төлбөр шилжүүлсэн". 2-р алхам (done): "Шалгагдаж байна".
export function BankTransferDialog({
  invoice,
  submitting,
  done,
  error,
  doneText = "Админ шилжүүлгийг шалгаад баталгаажуулмагц танд мэдэгдэл очно.",
  onConfirm,
  onClose,
}: {
  invoice: PaymentInvoice;
  submitting: boolean;
  done: boolean;
  error?: string;
  doneText?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [submitting, onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#1c1513]/60 p-4" role="dialog" aria-modal="true" aria-label="Төлбөр төлөх">
      <div className="relative w-full max-w-[420px] rounded-[28px] bg-white p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Хаах"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#7a6b63] transition hover:bg-[#f7f2ed] disabled:opacity-30"
        >
          <X aria-hidden className="h-5 w-5" />
        </button>

        {done ? (
          <div className="py-4 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf0dc] text-[#9a6412]">
              <Clock aria-hidden className="h-7 w-7" strokeWidth={1.7} />
            </span>
            <h2 className="mt-4 text-[16px] font-semibold text-[#2f2420]">Төлбөр шалгагдаж байна</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#7a6b63]">{doneText}</p>
            <p className="mt-3 text-[11px] text-[#9c8c84]">
              Гүйлгээний утга: <b className="text-[#2f2420]">{invoice.code}</b>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-[#a24456] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#8a3748]"
            >
              Ойлголоо
            </button>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">Дансаар шилжүүлэх</p>
            <h2 className="mt-2 text-[16px] font-semibold text-[#2f2420]">Төлбөр төлөх</h2>
            <p className="mt-1 text-[26px] font-bold text-[#2f2420]">{formatPrice(invoice.amount)}</p>

            <dl className="mt-5 divide-y divide-[#f1ebe5] rounded-2xl border border-[#efe4da] text-[12px]">
              <Row label="Банк" value={BANK.name} />
              <Row label="Дансны дугаар" value={BANK.account} copy />
              <Row label="IBAN" value={BANK.iban} copy />
              <Row label="Дүн" value={String(invoice.amount)} display={formatPrice(invoice.amount)} copy />
              <Row label="Гүйлгээний утга" value={invoice.code} copy highlight />
            </dl>

            <ol className="mt-4 list-decimal space-y-1 pl-5 text-[11px] leading-relaxed text-[#7a6b63]">
              <li>Дээрх данс руу яг энэ дүнг шилжүүлнэ.</li>
              <li>
                Гүйлгээний утгад <b className="text-[#2f2420]">{invoice.code}</b> гэж заавал бичнэ.
              </li>
              <li>Шилжүүлсний дараа доорх товчийг дарна. Админ шалгаад баталгаажуулна.</li>
            </ol>

            {error ? <p className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#a33a3a]">{error}</p> : null}

            <button
              type="button"
              onClick={onConfirm}
              disabled={submitting}
              className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#a24456] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#8a3748] disabled:opacity-70"
            >
              {submitting ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
              {submitting ? "Илгээж байна…" : "Төлбөр шилжүүлсэн"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, display, copy, highlight }: { label: string; value: string; display?: string; copy?: boolean; highlight?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 ${highlight ? "bg-[#fdf6f7]" : ""}`}>
      <dt className="text-[#9c8c84]">{label}</dt>
      <dd className={`ml-auto text-right font-semibold ${highlight ? "text-[#a24456]" : "text-[#2f2420]"}`}>{display ?? value}</dd>
      {copy ? (
        <button
          type="button"
          aria-label={`${label} хуулах`}
          onClick={() => {
            void navigator.clipboard?.writeText(value).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#9c8c84] transition hover:bg-[#f7e9ec] hover:text-[#a24456]"
        >
          {copied ? <Check aria-hidden className="h-3.5 w-3.5" /> : <Copy aria-hidden className="h-3.5 w-3.5" />}
        </button>
      ) : null}
    </div>
  );
}
