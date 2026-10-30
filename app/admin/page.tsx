import { Bell, CalendarClock, Clock, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { PageHeader, StatusPill, cardClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getAdminNotifications } from "@/lib/data/notifications";
import { getAllOrders } from "@/lib/data/orders";
import { getAllPurchases } from "@/lib/data/purchases";
import { formatDateTime, formatPrice } from "@/lib/format";
import { orderStatusLabel, orderStatusTone } from "@/lib/orders";

// Улаанбаатарын цагаар өнөөдөр / энэ сар эсэх.
const ubDate = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar" }).format(new Date(iso));

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [orders, purchases, notifications] = await Promise.all([getAllOrders(), getAllPurchases(), getAdminNotifications()]);

  const today = ubDate(new Date().toISOString());
  const month = today.slice(0, 7);
  const todayOrders = orders.filter((order) => ubDate(order.createdAt) === today);
  const pending = orders.filter((order) => order.status !== "delivered");
  const revenue = {
    products: orders.filter((order) => ubDate(order.createdAt).startsWith(month)).reduce((sum, order) => sum + order.total, 0),
    courses: purchases.filter((item) => item.kind === "course" && ubDate(item.createdAt).startsWith(month)).reduce((sum, item) => sum + item.price, 0),
    patterns: purchases.filter((item) => item.kind === "pattern" && ubDate(item.createdAt).startsWith(month)).reduce((sum, item) => sum + item.price, 0),
  };

  const stats = [
    { label: "Өнөөдрийн захиалга", value: String(todayOrders.length), icon: ShoppingBag, href: "/admin/orders" },
    { label: "Хүлээгдэж буй захиалга", value: String(pending.length), icon: Clock, href: "/admin/orders?status=received" },
    { label: "Уншаагүй мэдэгдэл", value: String(notifications.filter((item) => !item.read).length), icon: Bell, href: "/admin/notifications" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Хянах самбар" description="Захиалга, орлого, мэдэгдлийн товч мэдээлэл" />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className={`${cardClass} transition hover:border-[#a24456]`}>
            <Icon aria-hidden className="h-5 w-5 text-[#a24456]" />
            <p className="mt-4 text-[28px] font-semibold">{value}</p>
            <p className="mt-1 text-[12px] text-[#7a6b63]">{label}</p>
          </Link>
        ))}
      </div>

      <section className={cardClass}>
        <h2 className="flex items-center gap-2 text-[14px] font-semibold">
          <CalendarClock aria-hidden className="h-4 w-4 text-[#a24456]" /> Энэ сарын орлого
        </h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Бараа, материал", value: revenue.products },
            { label: "Сургалт", value: revenue.courses },
            { label: "Схем", value: revenue.patterns },
            { label: "Нийт", value: revenue.products + revenue.courses + revenue.patterns },
          ].map((item, index) => (
            <div key={item.label} className={`rounded-2xl p-4 ${index === 3 ? "bg-[#3d302c] text-white" : "bg-[#faf6f3]"}`}>
              <dt className={`text-[11px] ${index === 3 ? "text-white/70" : "text-[#7a6b63]"}`}>{item.label}</dt>
              <dd className="mt-2 text-[20px] font-semibold">{formatPrice(item.value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cardClass}>
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold">Хүлээгдэж буй захиалга</h2>
            <Link href="/admin/orders" className="text-[12px] text-[#a24456]">Бүгд →</Link>
          </div>
          <ul className="mt-4 divide-y divide-[#f1ebe5]">
            {pending.slice(0, 6).map((order) => (
              <li key={order.id}>
                <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-3 py-3 text-[12px] hover:text-[#a24456]">
                  <span className="font-semibold">#{order.id}</span>
                  <span className="min-w-0 flex-1 truncate text-[#7a6b63]">{order.customer.name}</span>
                  <StatusPill className={orderStatusTone[order.status]}>{orderStatusLabel(order.status)}</StatusPill>
                  <span className="w-24 text-right font-medium">{formatPrice(order.total)}</span>
                </Link>
              </li>
            ))}
            {!pending.length ? <li className="py-6 text-center text-[12px] text-[#9c8c84]">Хүлээгдэж буй захиалга алга</li> : null}
          </ul>
        </section>

        <section className={cardClass}>
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold">Сүүлийн мэдэгдэл</h2>
            <Link href="/admin/notifications" className="text-[12px] text-[#a24456]">Бүгд →</Link>
          </div>
          <ul className="mt-4 divide-y divide-[#f1ebe5]">
            {notifications.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3">
                <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.read ? "bg-[#eadfd5]" : "bg-[#a24456]"}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-[12px] ${item.read ? "" : "font-semibold"}`}>{item.message}</p>
                  <p className="mt-0.5 text-[10px] text-[#9c8c84]">{formatDateTime(item.createdAt)}</p>
                </div>
              </li>
            ))}
            {!notifications.length ? <li className="py-6 text-center text-[12px] text-[#9c8c84]">Мэдэгдэл алга</li> : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
