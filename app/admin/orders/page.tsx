import Link from "next/link";

import { PageHeader, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getAllOrders } from "@/lib/data/orders";
import { formatDateTime, formatPrice } from "@/lib/format";
import { orderStatusLabel, orderStatuses, orderStatusTone, type OrderStatus } from "@/lib/orders";

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status: statusParam } = await searchParams;
  const status = orderStatuses.find((item) => item.key === statusParam)?.key as OrderStatus | undefined;
  const all = await getAllOrders();
  const orders = status ? all.filter((order) => order.status === status) : all;

  return (
    <div>
      <PageHeader title="Захиалгууд" description="Захиалга дээр дарж дэлгэрэнгүйг харах, статус солих" />

      <nav aria-label="Статусаар шүүх" className="mt-6 flex flex-wrap gap-2 text-[12px]">
        {[{ key: undefined, label: "Бүгд" }, ...orderStatuses].map((item) => {
          const count = item.key ? all.filter((order) => order.status === item.key).length : all.length;
          const active = item.key === status;
          return (
            <Link
              key={item.label}
              href={item.key ? `/admin/orders?status=${item.key}` : "/admin/orders"}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-4 py-2 ${active ? "bg-[#a24456] text-white" : "bg-white ring-1 ring-[#eadfd5] hover:ring-[#a24456]"}`}
            >
              {item.label} ({count})
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 overflow-x-auto rounded-[20px] border border-[#eadfd5] bg-white">
        <table className="w-full min-w-[720px] text-left text-[12px]">
          <thead className="border-b border-[#f1ebe5] text-[11px] text-[#9c8c84]">
            <tr>
              <th className="px-5 py-3 font-medium">№</th>
              <th className="px-5 py-3 font-medium">Огноо</th>
              <th className="px-5 py-3 font-medium">Захиалагч</th>
              <th className="px-5 py-3 font-medium">Бараа</th>
              <th className="px-5 py-3 font-medium">Статус</th>
              <th className="px-5 py-3 text-right font-medium">Дүн</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1ebe5]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#faf6f3]">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-semibold text-[#a24456] hover:underline">
                    #{order.id}
                  </Link>
                </td>
                <td className="px-5 py-3 text-[#7a6b63]">{formatDateTime(order.createdAt)}</td>
                <td className="px-5 py-3">
                  {order.customer.name}
                  <span className="block text-[11px] text-[#9c8c84]">{order.customer.phone}</span>
                </td>
                <td className="px-5 py-3 text-[#7a6b63]">{order.items.reduce((sum, line) => sum + line.quantity, 0)} ширхэг</td>
                <td className="px-5 py-3">
                  <StatusPill className={orderStatusTone[order.status]}>{orderStatusLabel(order.status)}</StatusPill>
                </td>
                <td className="px-5 py-3 text-right font-semibold">{formatPrice(order.total)}</td>
              </tr>
            ))}
            {!orders.length ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-[#9c8c84]">
                  Захиалга алга
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
