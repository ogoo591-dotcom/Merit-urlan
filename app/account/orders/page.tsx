import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import { OrdersList } from "@/components/account/orders-list";
import { PendingPayments, PurchasedCourses, PurchasedPatterns } from "@/components/account/purchased-items";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCourse } from "@/server/modules/courses/queries";
import type { CourseDetail } from "@/types/courses";
import { getOrdersByUser } from "@/server/modules/orders/queries";
import { getPaymentsByUser } from "@/server/modules/payments/queries";
import { getPattern } from "@/server/modules/patterns/queries";
import type { PatternDetail } from "@/types/patterns";
import { getPurchasedCourseIds, getPurchasedPatternIds } from "@/server/modules/purchases/queries";

export const metadata: Metadata = { title: "Миний захиалгууд | Merit Urlan" };

const isPresent = <T,>(item: T | null): item is T => item !== null;

// Хэрэглэгчийн авсан бүх зүйл нэг дор: бараа/материалын захиалга, худалдаж авсан сургалт, схем.
export default async function AccountOrdersPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const { userId } = await auth.protect();
  const [orders, { new: newId }, courseIds, patternIds, payments] = await Promise.all([
    getOrdersByUser(userId),
    searchParams,
    getPurchasedCourseIds(userId),
    getPurchasedPatternIds(userId),
    getPaymentsByUser(userId),
  ]);
  // Барааны захиалгын төлбөрийн төлөв захиалгын карт дээр харагдана; энд зөвхөн сургалт/схемийн шалгагдаж буй, татгалзсан төлбөр.
  const digitalPayments = payments.filter((payment) => !payment.orderId && payment.status !== "approved");
  const [courses, patterns] = await Promise.all([
    Promise.all(courseIds.map((id) => getCourse(id))).then((items) => items.filter(isPresent<CourseDetail>)),
    Promise.all(patternIds.map((id) => getPattern(id))).then((items) => items.filter(isPresent<PatternDetail>)),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0] px-6 py-12 lg:px-[60px]">
        <div className="mx-auto w-full max-w-[1100px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">Миний булан</p>
          <h1 className="mt-3 font-serif text-[40px] leading-tight text-[#2f2420]">Миний захиалгууд</h1>
          <p className="mt-2 text-[12px] text-[#7a6b63]">Авсан бараа, материал, сургалт, схем бүгд энд хадгалагдана.</p>

          <div className="mt-10 space-y-12">
            <PendingPayments payments={digitalPayments} />
            <section>
              <h2 className="text-[16px] font-semibold text-[#2f2420]">Бараа, материал ({orders.length})</h2>
              <div className="mt-4">
                <OrdersList orders={orders} newOrderId={Number(newId) || null} />
              </div>
            </section>
            <PurchasedCourses courses={courses} />
            <PurchasedPatterns patterns={patterns} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
