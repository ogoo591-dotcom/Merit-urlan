import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireUserId } from "@/lib/auth";
import {
  enrollmentStatusLabels,
  formatDate,
  orderStatusLabels,
  statusTone,
  type EnrollmentRow,
  type OrderRow,
} from "@/lib/orders";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "edge";

export default async function AccountPage() {
  const userId = await requireUserId();

  let orders: OrderRow[] = [];
  let enrollments: EnrollmentRow[] = [];
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const [ordersResult, enrollmentsResult] = await Promise.all([
      supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("course_enrollments").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    orders = (ordersResult.data ?? []) as OrderRow[];
    enrollments = (enrollmentsResult.data ?? []) as EnrollmentRow[];
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#fcf6f0]">
        <div className="mx-auto w-full max-w-[1000px] px-6 py-12">
          <h1 className="font-serif text-[40px] text-[#2f2420]">Миний захиалгууд</h1>

          {orders.length === 0 && enrollments.length === 0 ? (
            <div className="mt-8 rounded-[24px] border border-[#eadfd5] bg-white p-10 text-center text-[12px] text-[#7a6b63]">
              Одоогоор захиалга алга.{" "}
              <Link href="/shop" className="font-medium text-[#6e4f45] underline">
                Дэлгүүр хэсэх
              </Link>
            </div>
          ) : null}

          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-[20px] border border-[#eadfd5] bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold text-[#2f2420]">Захиалга #{order.id}</p>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusTone[order.status]}`}>
                    {orderStatusLabels[order.status]}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#8a7b73]">{formatDate(order.created_at)}</p>
                <ul className="mt-4 space-y-1 text-[12px] text-[#4a3b35]">
                  {order.items.map((item) => (
                    <li key={item.slug} className="flex justify-between gap-4">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString("en-US")}₮</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-[#f1ebe5] pt-3 text-right text-[13px] font-semibold text-[#2f2420]">
                  Нийт: {order.total.toLocaleString("en-US")}₮
                </p>
              </article>
            ))}

            {enrollments.map((enrollment) => (
              <article key={`course-${enrollment.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[#eadfd5] bg-white p-6">
                <div>
                  <p className="text-[13px] font-semibold text-[#2f2420]">Сургалт: {enrollment.course_title}</p>
                  <p className="mt-1 text-[11px] text-[#8a7b73]">{formatDate(enrollment.created_at)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusTone[enrollment.status]}`}>
                  {enrollmentStatusLabels[enrollment.status]}
                </span>
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
