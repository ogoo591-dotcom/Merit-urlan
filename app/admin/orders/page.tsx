import Link from "next/link";

import { setOrderStatus } from "@/app/admin/orders/actions";
import { StatusSelect } from "@/components/admin/status-select";
import { getAdminSupabase } from "@/lib/auth";
import { formatDate, orderStatusLabels, statusTone, type OrderRow, type OrderStatus } from "@/lib/orders";

export const runtime = "edge";

type AdminOrdersPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams;
  const supabase = await getAdminSupabase();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (status && status in orderStatusLabels) query = query.eq("status", status);
  const { data } = await query;
  const orders = (data ?? []) as OrderRow[];

  return (
    <div>
      <h1 className="text-[24px] font-semibold">Захиалга</h1>
      <p className="mt-1 text-[12px] text-[#8a7b73]">Цуцалсан захиалгын бараа үлдэгдэлд автоматаар буцаж нэмэгдэнэ.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/orders" className={`rounded-full px-4 py-2 text-[12px] ${!status ? "bg-[#2f2420] text-white" : "bg-white ring-1 ring-[#eadfd5]"}`}>
          Бүгд
        </Link>
        {(Object.keys(orderStatusLabels) as OrderStatus[]).map((key) => (
          <Link
            key={key}
            href={`/admin/orders?status=${key}`}
            className={`rounded-full px-4 py-2 text-[12px] ${status === key ? "bg-[#2f2420] text-white" : "bg-white ring-1 ring-[#eadfd5]"}`}
          >
            {orderStatusLabels[key]}
          </Link>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[20px] border border-[#eadfd5] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-semibold">#{order.id}</p>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] ${statusTone[order.status]}`}>{orderStatusLabels[order.status]}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#8a7b73]">{formatDate(order.created_at)}</p>
              </div>
              <form action={setOrderStatus}>
                <input type="hidden" name="id" value={order.id} />
                <StatusSelect name="status" defaultValue={order.status} options={orderStatusLabels} />
              </form>
            </div>

            <div className="mt-4 grid gap-6 text-[12px] md:grid-cols-2">
              <div className="space-y-1 text-[#4a3b35]">
                <p className="font-medium text-[#2f2420]">{order.customer_name}</p>
                <p>
                  <a href={`tel:${order.phone}`} className="underline">{order.phone}</a>
                  {order.email ? <> · {order.email}</> : null}
                </p>
                <p className="whitespace-pre-line">{order.address}</p>
                {order.note ? <p className="text-[#8a7b73]">Тайлбар: {order.note}</p> : null}
              </div>
              <div>
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li key={item.slug} className="flex justify-between gap-4">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString("en-US")}₮</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-[#f1ebe5] pt-2 text-right font-semibold">{order.total.toLocaleString("en-US")}₮</p>
              </div>
            </div>
          </article>
        ))}
        {orders.length === 0 ? (
          <p className="rounded-[20px] border border-[#eadfd5] bg-white p-10 text-center text-[12px] text-[#8a7b73]">Захиалга алга</p>
        ) : null}
      </div>
    </div>
  );
}
