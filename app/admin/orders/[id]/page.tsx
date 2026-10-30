import { CalendarClock, MapPin, Phone, StickyNote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { changeOrderStatus, changeReadyDate } from "@/app/admin/orders/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { PageHeader, StatusPill, cardClass, inputClass, primaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getOrder } from "@/lib/data/orders";
import { formatDateTime, formatPrice, formatReadyDate } from "@/lib/format";
import { formatOrderAddress, orderStatusLabel, orderStatuses, orderStatusTone } from "@/lib/orders";

const dateInputValue = (iso?: string) =>
  iso ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar" }).format(new Date(iso)) : "";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const order = await getOrder(Number((await params).id));
  if (!order) notFound();
  const currentIndex = orderStatuses.findIndex((item) => item.key === order.status);

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-[12px] text-[#7a6b63] hover:text-[#a24456]">← Захиалгууд</Link>
      <PageHeader
        title={`Захиалга #${order.id}`}
        description={formatDateTime(order.createdAt)}
        action={<StatusPill className={orderStatusTone[order.status]}>{orderStatusLabel(order.status)}</StatusPill>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className={cardClass}>
            <h2 className="text-[14px] font-semibold">Бараанууд</h2>
            <ul className="mt-3 divide-y divide-[#f1ebe5]">
              {order.items.map((line) => (
                <li key={line.id} className="flex items-center gap-4 py-3">
                  <Image src={line.image} alt="" width={48} height={48} className="h-12 w-12 rounded-lg bg-[#faf7f6] object-contain" />
                  <div className="min-w-0 flex-1 text-[12px]">
                    {line.name}
                    {line.madeToOrder ? (
                      <span className="ml-2 rounded-full bg-[#fdf1d6] px-2 py-0.5 text-[10px] font-semibold text-[#8a5a00]">
                        Захиалгаар · {line.leadDays} хоног
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[12px] text-[#7a6b63]">
                    {line.quantity} × {formatPrice(line.price)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-[#f1ebe5] pt-4 text-[13px]">
              <span className="text-[#7a6b63]">Нийт (QPay · {order.payment.transactionId})</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-[14px] font-semibold">Захиалагч</h2>
            <dl className="mt-4 space-y-3 text-[12px]">
              <div className="flex gap-3">
                <Phone aria-hidden className="h-4 w-4 shrink-0 text-[#a24456]" />
                <div>
                  <dt className="sr-only">Утас</dt>
                  <dd>
                    {order.customer.name} ·{" "}
                    <a href={`tel:${order.customer.phone.replace(/\s/g, "")}`} className="font-medium text-[#a24456] hover:underline">
                      {order.customer.phone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin aria-hidden className="h-4 w-4 shrink-0 text-[#a24456]" />
                <div>
                  <dt className="sr-only">Хаяг</dt>
                  <dd>{formatOrderAddress(order.address)}</dd>
                </div>
              </div>
              {order.note ? (
                <div className="flex gap-3">
                  <StickyNote aria-hidden className="h-4 w-4 shrink-0 text-[#a24456]" />
                  <div>
                    <dt className="sr-only">Тэмдэглэл</dt>
                    <dd className="whitespace-pre-line">{order.note}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <section className={cardClass}>
            <h2 className="text-[14px] font-semibold">Статус солих</h2>
            <p className="mt-1 text-[11px] text-[#9c8c84]">Солих бүрд захиалагчид мэдэгдэл очно.</p>
            <ol className="mt-4 space-y-2">
              {orderStatuses.map((status, index) => {
                const at = order.history.findLast((entry) => entry.status === status.key)?.at;
                const current = status.key === order.status;
                return (
                  <li key={status.key}>
                    <form action={changeOrderStatus} className="flex items-center gap-3">
                      <input type="hidden" name="id" value={order.id} />
                      <input type="hidden" name="status" value={status.key} />
                      <SubmitButton
                        className={`flex flex-1 items-center justify-between rounded-xl border px-4 py-2.5 text-left text-[12px] transition disabled:opacity-60 ${
                          current
                            ? "border-[#a24456] bg-[#f7e9ec] font-semibold text-[#a24456]"
                            : index < currentIndex
                              ? "border-[#eadfd5] bg-[#faf6f3] text-[#7a6b63]"
                              : "border-[#eadfd5] bg-white hover:border-[#a24456]"
                        }`}
                      >
                        <span>
                          {index + 1}. {status.label}
                        </span>
                        <span className="text-[10px] font-normal text-[#9c8c84]">{at ? formatDateTime(at) : current ? "" : "Сонгох"}</span>
                      </SubmitButton>
                    </form>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className={cardClass}>
            <h2 className="flex items-center gap-2 text-[14px] font-semibold">
              <CalendarClock aria-hidden className="h-4 w-4 text-[#a24456]" /> Бэлэн болох огноо
            </h2>
            <p className="mt-1 text-[11px] text-[#9c8c84]">
              {order.readyBy ? `Одоогийн: ${formatReadyDate(order.readyBy)}` : "Тохируулаагүй"} · Хадгалахад захиалагчид мэдэгдэл очно.
            </p>
            <form action={changeReadyDate} className="mt-4 flex gap-3">
              <input type="hidden" name="id" value={order.id} />
              <label className="sr-only" htmlFor="readyBy">Бэлэн болох огноо</label>
              <input id="readyBy" type="date" name="readyBy" required defaultValue={dateInputValue(order.readyBy)} className={`${inputClass} mt-0`} />
              <SubmitButton className={primaryButton}>Хадгалах</SubmitButton>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
