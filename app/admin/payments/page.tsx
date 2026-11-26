import Link from "next/link";

import { approvePaymentAction, rejectPaymentAction } from "@/server/services/payments/admin-actions";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { PageHeader, StatusPill } from "@/features/admin/components/ui";
import { requireAdmin } from "@/server/auth";
import { getPayments } from "@/server/services/payments/queries";
import { formatDateTime, formatPrice } from "@/lib/format";
import { paymentStatusLabel, paymentStatusTone, type PaymentStatus } from "@/types/payments";
import { BANK } from "@/lib/site-config";

const filters: Array<{ key?: PaymentStatus; label: string }> = [
  { key: "pending", label: "Шалгах" },
  { key: "approved", label: "Баталгаажсан" },
  { key: "rejected", label: "Татгалзсан" },
  { label: "Бүгд" },
];

// Дансаар шилжүүлсэн төлбөрүүд. Банкны хуулгаас гүйлгээний утга (MU-XXXXXX), дүнг тулгаад баталгаажуулна.
export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status: statusParam } = await searchParams;
  const status = statusParam === "all" ? undefined : (filters.find((item) => item.key === statusParam)?.key ?? "pending");
  const all = await getPayments();
  const payments = status ? all.filter((item) => item.status === status) : all;

  return (
    <div>
      <PageHeader
        title="Төлбөр"
        description={`${BANK.name} ${BANK.account} дансны хуулгаас гүйлгээний утга, дүнг тулгаад баталгаажуулна. Баталгаажмагц захиалга төлөгдөж, сургалт/схем нээгдэнэ.`}
      />

      <nav aria-label="Статусаар шүүх" className="mt-6 flex flex-wrap gap-2 text-[12px]">
        {filters.map((item) => {
          const count = item.key ? all.filter((payment) => payment.status === item.key).length : all.length;
          const active = item.key === status;
          return (
            <Link
              key={item.label}
              href={`/admin/payments?status=${item.key ?? "all"}`}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-4 py-2 ${active ? "bg-[#a24456] text-white" : "bg-white ring-1 ring-[#eadfd5] hover:ring-[#a24456]"}`}
            >
              {item.label} ({count})
            </Link>
          );
        })}
      </nav>

      <ul className="mt-6 space-y-3">
        {payments.map((payment) => (
          <li key={payment.id} className="flex flex-wrap items-center gap-4 rounded-[20px] border border-[#eadfd5] bg-white p-5 text-[12px]">
            <div className="min-w-[140px]">
              <p className="font-mono text-[14px] font-semibold text-[#a24456]">{payment.code}</p>
              <p className="mt-1 text-[11px] text-[#9c8c84]">{formatDateTime(payment.createdAt)}</p>
            </div>
            <div className="min-w-[200px] flex-1">
              <p className="font-medium text-[#2f2420]">
                {payment.orderId ? (
                  <Link href={`/admin/orders/${payment.orderId}`} className="text-[#a24456] hover:underline">
                    {payment.summary}
                  </Link>
                ) : (
                  payment.summary
                )}
              </p>
              <p className="mt-1 text-[11px] text-[#9c8c84]">
                {payment.customer ? `${payment.customer.name} · ${payment.customer.phone}` : `Хэрэглэгч: ${payment.userId.slice(-8)}`}
              </p>
            </div>
            <p className="text-[16px] font-bold text-[#2f2420]">{formatPrice(payment.amount)}</p>
            <StatusPill className={paymentStatusTone[payment.status]}>{paymentStatusLabel[payment.status]}</StatusPill>
            {payment.status === "pending" ? (
              <div className="flex gap-2">
                <form action={rejectPaymentAction}>
                  <input type="hidden" name="id" value={payment.id} />
                  <ConfirmButton
                    message={`${payment.code} төлбөрөөс татгалзах уу? Захиалгын бараа үлдэгдэлд буцна.`}
                    className="rounded-xl border border-[#eadfd5] px-4 py-2 font-semibold text-[#a33a3a] transition hover:border-[#a33a3a]"
                  >
                    Татгалзах
                  </ConfirmButton>
                </form>
                <form action={approvePaymentAction}>
                  <input type="hidden" name="id" value={payment.id} />
                  <ConfirmButton
                    message={`${payment.code} — ${formatPrice(payment.amount)} дансанд орсныг шалгасан уу? Баталгаажуулах уу?`}
                    className="rounded-xl bg-[#2e7a43] px-4 py-2 font-semibold text-white transition hover:bg-[#25653a]"
                  >
                    Баталгаажуулах
                  </ConfirmButton>
                </form>
              </div>
            ) : null}
          </li>
        ))}
        {!payments.length ? (
          <li className="rounded-[20px] border border-dashed border-[#eadfd5] bg-white px-5 py-10 text-center text-[12px] text-[#9c8c84]">
            {status === "pending" ? "Шалгах төлбөр алга" : "Төлбөр алга"}
          </li>
        ) : null}
      </ul>
    </div>
  );
}
