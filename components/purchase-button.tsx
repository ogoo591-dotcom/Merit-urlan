"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useAuthModal } from "@/components/auth/auth-modal-provider";
import { QPayDialog } from "@/components/store/qpay-dialog";
import { createQPayInvoice, type QPayInvoice } from "@/lib/data/payments";

export type PurchaseResult = { ok: true } | { ok: false; error: string };

// Сургалт, схем худалдаж авах товч: (нэвтрэх) → mock QPay → `action` (server action) худалдан авалтыг бүртгэж,
// хуудас шинэчлэгдэн хичээл нээгдэх / PDF татах товч гарна.
export function PurchaseButton({
  action,
  itemId,
  price,
  label,
  className = "",
}: {
  action: (itemId: string) => Promise<PurchaseResult>;
  itemId: string;
  price: number;
  label: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isSignedIn } = useUser();
  const { requireAuth } = useAuthModal();
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string>();

  const start = async () => {
    if (!isSignedIn) {
      const query = searchParams.toString();
      requireAuth(query ? `${pathname}?${query}` : pathname);
      return;
    }
    setError(undefined);
    setInvoice(await createQPayInvoice(price));
  };

  const pay = async () => {
    setPaying(true);
    setError(undefined);
    const result = await action(itemId);
    setPaying(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setInvoice(null);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={start}
        className={`rounded-2xl bg-[#a24456] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#8a3748] ${className}`}
      >
        {label}
      </button>
      {invoice ? <QPayDialog invoice={invoice} paying={paying} error={error} onPay={pay} onClose={() => setInvoice(null)} /> : null}
    </>
  );
}
