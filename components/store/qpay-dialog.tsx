"use client";

import { Loader2, X } from "lucide-react";
import { useEffect } from "react";

import { formatPrice } from "@/lib/format";
import type { QPayInvoice } from "@/lib/data/payments";

// Жинхэнэ QR биш — invoice-ийн дугаараас тогтвортой хээ зурна (mock).
function MockQr({ seed }: { seed: string }) {
  const size = 25;
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const random = () => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    return hash / 2 ** 32;
  };
  const finder = (x: number, y: number) =>
    [[0, 0], [size - 7, 0], [0, size - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  const cells: Array<[number, number]> = [];
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) if (!finder(x, y) && random() > 0.52) cells.push([x, y]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" shapeRendering="crispEdges" aria-hidden>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#2f2420" />
      ))}
      {[[0, 0], [size - 7, 0], [0, size - 7]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#2f2420" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#2f2420" />
        </g>
      ))}
    </svg>
  );
}

export function QPayDialog({
  invoice,
  paying,
  error,
  onPay,
  onClose,
}: {
  invoice: QPayInvoice;
  paying: boolean;
  error?: string;
  onPay: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !paying) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [paying, onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1c1513]/60 p-4" role="dialog" aria-modal="true" aria-label="QPay төлбөр">
      <div className="relative w-full max-w-[400px] rounded-[28px] bg-white p-7 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={paying}
          aria-label="Хаах"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#7a6b63] transition hover:bg-[#f7f2ed] disabled:opacity-30"
        >
          <X aria-hidden className="h-5 w-5" />
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">QPay</p>
        <h2 className="mt-2 text-[16px] font-semibold text-[#2f2420]">Төлбөр төлөх</h2>
        <p className="mt-1 text-[12px] text-[#7a6b63]">Банкны апп-аараа QR кодыг уншуулна уу</p>

        <div className="mx-auto mt-6 h-52 w-52 rounded-2xl border border-[#efe4da] bg-white p-3">
          <MockQr seed={invoice.invoiceId} />
        </div>

        <p className="mt-5 text-[26px] font-bold text-[#2f2420]">{formatPrice(invoice.amount)}</p>
        <p className="mt-1 text-[10px] text-[#9c8c84]">Нэхэмжлэх: {invoice.invoiceId}</p>

        {error ? <p className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#a33a3a]">{error}</p> : null}

        <button
          type="button"
          onClick={onPay}
          disabled={paying}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#a24456] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#8a3748] disabled:opacity-70"
        >
          {paying ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
          {paying ? "Төлбөр шалгаж байна…" : "Төлөх"}
        </button>
        <p className="mt-3 text-[10px] text-[#b3a69e]">Туршилтын горим: “Төлөх” дарахад 2 секундын дараа амжилттай болно.</p>
      </div>
    </div>
  );
}
