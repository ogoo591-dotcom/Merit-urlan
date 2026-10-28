import Link from "next/link";

import { formatDate, orderStatusLabels, statusTone, type OrderRow } from "@/lib/orders";
import type { ProductRow } from "@/lib/products";
import { getAdminSupabase } from "@/lib/auth";

export const runtime = "edge";

const lowStockLimit = 5;

export default async function AdminDashboardPage() {
  const supabase = await getAdminSupabase();
  const [products, orders, enrollments] = await Promise.all([
    supabase.from("products").select("slug, name, stock, is_active"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("course_enrollments").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const productRows = (products.data ?? []) as Pick<ProductRow, "slug" | "name" | "stock" | "is_active">[];
  const orderRows = (orders.data ?? []) as OrderRow[];
  const lowStock = productRows.filter((product) => product.is_active && product.stock <= lowStockLimit);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthRevenue = orderRows
    .filter((order) => order.status !== "cancelled" && new Date(order.created_at) >= monthStart)
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { label: "Шинэ захиалга", value: orderRows.filter((order) => order.status === "new").length, href: "/admin/orders" },
    { label: "Энэ сарын борлуулалт", value: `${monthRevenue.toLocaleString("en-US")}₮`, href: "/admin/orders" },
    { label: "Үлдэгдэл бага бараа", value: lowStock.length, href: "/admin/products?filter=low" },
    { label: "Шинэ сургалтын бүртгэл", value: enrollments.count ?? 0, href: "/admin/courses" },
  ];

  return (
    <div>
      <h1 className="text-[24px] font-semibold">Хяналтын самбар</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-[20px] border border-[#eadfd5] bg-white p-5 transition hover:border-[#6e4f45]">
            <p className="text-[11px] text-[#8a7b73]">{stat.label}</p>
            <p className="mt-2 text-[24px] font-semibold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-[20px] border border-[#eadfd5] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold">Сүүлийн захиалгууд</h2>
            <Link href="/admin/orders" className="text-[11px] text-[#6e4f45] underline">Бүгд</Link>
          </div>
          <ul className="mt-4 divide-y divide-[#f1ebe5]">
            {orderRows.slice(0, 6).map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-4 py-3 text-[12px]">
                <div>
                  <p className="font-medium">#{order.id} · {order.customer_name}</p>
                  <p className="text-[11px] text-[#8a7b73]">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span>{order.total.toLocaleString("en-US")}₮</span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] ${statusTone[order.status]}`}>{orderStatusLabels[order.status]}</span>
                </div>
              </li>
            ))}
            {orderRows.length === 0 ? <li className="py-6 text-center text-[12px] text-[#8a7b73]">Захиалга алга</li> : null}
          </ul>
        </section>

        <section className="rounded-[20px] border border-[#eadfd5] bg-white p-6">
          <h2 className="text-[14px] font-semibold">Үлдэгдэл бага (≤ {lowStockLimit})</h2>
          <ul className="mt-4 divide-y divide-[#f1ebe5]">
            {lowStock.map((product) => (
              <li key={product.slug} className="flex items-center justify-between gap-4 py-3 text-[12px]">
                <Link href={`/admin/products/${product.slug}`} className="line-clamp-1 hover:underline">{product.name}</Link>
                <span className={product.stock === 0 ? "font-semibold text-[#a04848]" : "text-[#9a6412]"}>{product.stock} ш</span>
              </li>
            ))}
            {lowStock.length === 0 ? <li className="py-6 text-center text-[12px] text-[#8a7b73]">Бүх бараа хангалттай</li> : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
