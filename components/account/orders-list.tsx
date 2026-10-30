import { Check, CircleCheck, Clock, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatDateTime, formatPrice, formatReadyDate } from "@/lib/format";
import { formatOrderAddress, orderStatuses, type Order } from "@/lib/orders";

// Хүлээн авсан → Хийгдэж байна → Бэлэн → Хүргэлтэнд гарсан → Хүргэгдсэн
function StatusSteps({ order }: { order: Order }) {
  const current = orderStatuses.findIndex((status) => status.key === order.status);

  return (
    <ol className="grid grid-cols-5 gap-1" aria-label="Захиалгын явц">
      {orderStatuses.map((status, index) => {
        const done = index <= current;
        const at = order.history.find((entry) => entry.status === status.key)?.at;
        return (
          <li key={status.key} className="relative flex flex-col items-center text-center" aria-current={index === current ? "step" : undefined}>
            {index > 0 ? (
              <span
                aria-hidden
                className={`absolute right-1/2 top-[13px] h-0.5 w-full ${index <= current ? "bg-[#a24456]" : "bg-[#eadfd5]"}`}
              />
            ) : null}
            <span
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                done ? "border-[#a24456] bg-[#a24456] text-white" : "border-[#eadfd5] bg-white text-[#b3a69e]"
              } ${index === current ? "ring-4 ring-[#a24456]/15" : ""}`}
            >
              {done ? <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} /> : <span className="text-[10px]">{index + 1}</span>}
            </span>
            <span className={`mt-2 text-[10px] leading-tight sm:text-[11px] ${done ? "font-semibold text-[#2f2420]" : "text-[#9c8c84]"}`}>
              {status.label}
            </span>
            {at ? <span className="mt-0.5 hidden text-[9px] text-[#9c8c84] sm:block">{formatDateTime(at)}</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

export function OrdersList({ orders, newOrderId }: { orders: Order[]; newOrderId: number | null }) {
  return (
    <div className="space-y-6">
      {newOrderId && orders.some((order) => order.id === newOrderId) ? (
        <div className="flex items-start gap-3 rounded-[20px] border border-[#cfe9d7] bg-[#eef8f1] px-5 py-4 text-[12px] text-[#1f6b3a]">
          <CircleCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            <strong className="font-semibold">Төлбөр амжилттай. Захиалга #{newOrderId} хүлээн авлаа.</strong>
            <br />
            Явцыг нь эндээс харах боломжтой.
          </p>
        </div>
      ) : null}

      {!orders.length ? (
        <div className="rounded-[24px] border border-[#eadfd5] bg-white p-10 text-center">
          <Package aria-hidden className="mx-auto h-10 w-10 text-[#b3a69e]" strokeWidth={1.5} />
          <p className="mt-4 text-[13px] font-semibold text-[#2f2420]">Танд одоогоор захиалга алга</p>
          <Link href="/products" className="mt-6 inline-block rounded-xl bg-[#a24456] px-6 py-3 text-[12px] font-semibold text-white">
            Бүтээгдэхүүн үзэх
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <article
            key={order.id}
            className={`rounded-[24px] border bg-white p-6 lg:p-8 ${order.id === newOrderId ? "border-[#a24456]" : "border-[#eadfd5]"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#2f2420]">Захиалга #{order.id}</h2>
                <p className="mt-1 text-[11px] text-[#9c8c84]">{formatDateTime(order.createdAt)}</p>
              </div>
              <p className="text-[18px] font-bold text-[#2f2420]">{formatPrice(order.total)}</p>
            </div>

            {order.readyBy && order.status !== "delivered" ? (
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-[#fdf6e6] px-4 py-3 text-[12px] text-[#7a5200]">
                <Clock aria-hidden className="h-4 w-4 shrink-0" />
                Ойролцоогоор {formatReadyDate(order.readyBy)} бэлэн болно
              </p>
            ) : null}

            <div className="mt-6">
              <StatusSteps order={order} />
            </div>

            <ul className="mt-6 divide-y divide-[#f1ebe5] border-t border-[#f1ebe5]">
              {order.items.map((line) => (
                <li key={line.id} className="flex items-center gap-4 py-3">
                  <Image src={line.image} alt="" width={48} height={48} className="h-12 w-12 rounded-lg bg-[#faf7f6] object-contain" />
                  <p className="min-w-0 flex-1 text-[12px] text-[#2f2420]">
                    {line.name}
                    {line.madeToOrder ? <span className="ml-2 text-[10px] text-[#8a5a00]">Захиалгаар</span> : null}
                  </p>
                  <p className="text-[12px] text-[#7a6b63]">
                    {line.quantity} × {formatPrice(line.price)}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[11px] leading-relaxed text-[#9c8c84]">
              Хүргэх хаяг: {formatOrderAddress(order.address)}
            </p>
          </article>
        ))
      )}
    </div>
  );
}
