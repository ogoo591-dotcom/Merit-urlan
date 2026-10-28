"use client";

import { useEffect, useRef, useState } from "react";

import { AddressFields, readAddressFields } from "@/components/address-fields";
import { shortAddress, useDeliveryAddress } from "@/components/delivery-address-provider";

function PinIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

// Header дээрх "Хүргэлтийн хаяг" товч ба доош нээгдэх засах цонх.
export function AddressButton() {
  const { address, saveAddress } = useDeliveryAddress();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex max-w-[150px] items-center sm:max-w-[220px] gap-2 rounded-[14px] bg-[#6e4f45] px-4 py-2.5 text-left text-white shadow-[0_6px_16px_-8px_rgba(70,45,35,0.6)] transition hover:bg-[#5c4038]"
      >
        <PinIcon />
        <span className="min-w-0 leading-tight">
          <span className="block text-[9px] text-white/70">Хүргэлтийн хаяг</span>
          <span className="block truncate text-[11px] font-medium">{address ? shortAddress(address) : "Хаяг нэмэх"}</span>
        </span>
      </button>

      {open ? (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setSaving(true);
            try {
              await saveAddress(readAddressFields(new FormData(event.currentTarget)));
              setOpen(false);
            } finally {
              setSaving(false);
            }
          }}
          className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[min(340px,calc(100vw-2rem))] rounded-[18px] border border-[#eadfd5] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]"
        >
          <p className="text-[13px] font-semibold text-[#2f2420]">Хүргэлтийн хаяг</p>
          <p className="mb-4 mt-1 text-[11px] text-[#8a7b73]">Захиалга өгөхөд энэ хаяг автоматаар бөглөгдөнө.</p>
          <AddressFields value={address} idPrefix="header-address" />
          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full rounded-[12px] bg-[#6e4f45] px-4 py-3 text-[12px] font-medium text-white transition hover:bg-[#5c4038] disabled:opacity-60"
          >
            {saving ? "Хадгалж байна…" : "Хадгалах"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
