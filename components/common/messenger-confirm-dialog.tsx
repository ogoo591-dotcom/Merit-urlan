"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";

import { MESSENGER_URL } from "@/lib/site-config";

// "Чат руу шилжих үү?" жижиг цонх. "Тийм" дарахад Messenger шинэ таб дээр нээгдэнэ.
export function MessengerConfirmDialog({ onClose }: { onClose: () => void }) {
  const confirmRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();
    return () => previous?.focus();
  }, []);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="messenger-confirm-title"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          // Арын drawer хаагдахгүй — зөвхөн энэ цонх.
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-[#1c1513]/50 animate-[fade-in_0.15s_ease-out]" onClick={onClose} />
      <div className="relative w-full max-w-[340px] rounded-[22px] bg-white p-6 text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f7e9ec] text-[#a24456]">
          <MessageCircle aria-hidden className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <h2 id="messenger-confirm-title" className="mt-4 text-[15px] font-semibold text-[#2f2420]">
          Чат руу шилжих үү?
        </h2>
        <p className="mt-2 text-[12px] leading-relaxed text-[#7a6b63]">Facebook Messenger шинэ таб дээр нээгдэнэ.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#e3d6cb] bg-white px-4 py-3 text-[12px] font-semibold text-[#2f2420] transition hover:border-[#a24456] hover:text-[#a24456]"
          >
            Үгүй
          </button>
          <a
            ref={confirmRef}
            href={MESSENGER_URL}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="rounded-xl bg-[#a24456] px-4 py-3 text-[12px] font-semibold text-white transition hover:bg-[#8a3748]"
          >
            Тийм
          </a>
        </div>
      </div>
    </div>
  );
}
