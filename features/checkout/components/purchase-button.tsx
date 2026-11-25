"use client";

import { useUser } from "@clerk/nextjs";
import { Clock } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useAuthModal } from "@/features/auth/components/auth-modal-provider";
import { BankTransferDialog } from "@/features/checkout/components/bank-transfer-dialog";
import { newPaymentCode, type PaymentInvoice, type PurchaseResult } from "@/types/payments";

// Сургалт, схем худалдаж авах товч: (нэвтрэх) → дансаар шилжүүлэх цонх → "Төлбөр шилжүүлсэн" →
// `action` хүлээгдэж буй төлбөр үүсгэж, админ баталгаажуулмагц нээгдэнэ (types/payments.ts).
export function PurchaseButton({
  action,
  itemId,
  price,
  label,
  className = "",
  pending = false,
}: {
  action: (itemId: string, code: string) => Promise<PurchaseResult>;
  itemId: string;
  price: number;
  label: string;
  className?: string;
  // Төлбөр нь аль хэдийн шалгагдаж байгаа бол товчны оронд мэдээлэл харуулна.
  pending?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isSignedIn } = useUser();
  const { requireAuth } = useAuthModal();
  const [invoice, setInvoice] = useState<PaymentInvoice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();

  if (pending) {
    return (
      <p className={`flex items-center justify-center gap-2 rounded-2xl bg-[#fdf0dc] px-6 py-4 text-[12px] font-semibold text-[#9a6412] ${className}`}>
        <Clock aria-hidden className="h-4 w-4 shrink-0" /> Төлбөр шалгагдаж байна. Баталгаажмагц нээгдэнэ.
      </p>
    );
  }

  const start = () => {
    if (!isSignedIn) {
      const query = searchParams.toString();
      requireAuth(query ? `${pathname}?${query}` : pathname);
      return;
    }
    setError(undefined);
    setDone(false);
    setInvoice({ code: newPaymentCode(), amount: price });
  };

  const confirm = async () => {
    if (!invoice) return;
    setSubmitting(true);
    setError(undefined);
    const result = await action(itemId, invoice.code).catch(() => ({ ok: false as const, error: "Илгээж чадсангүй. Дахин оролдоно уу." }));
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.pending) setDone(true);
    else close();
  };

  const close = () => {
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
      {invoice ? (
        <BankTransferDialog
          invoice={invoice}
          submitting={submitting}
          done={done}
          error={error}
          doneText="Админ шилжүүлгийг шалгаад баталгаажуулмагц танд мэдэгдэл очиж, энэ хуудсанд нээгдэнэ."
          onConfirm={confirm}
          onClose={close}
        />
      ) : null}
    </>
  );
}
