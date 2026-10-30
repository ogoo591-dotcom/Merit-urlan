import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import { OrdersList } from "@/components/account/orders-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOrdersByUser } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Миний захиалгууд | Merit Urlan" };

export default async function AccountOrdersPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const { userId } = await auth.protect();
  const [orders, { new: newId }] = await Promise.all([getOrdersByUser(userId), searchParams]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0] px-6 py-12 lg:px-[60px]">
        <div className="mx-auto w-full max-w-[960px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">Миний булан</p>
          <h1 className="mt-3 font-serif text-[40px] leading-tight text-[#2f2420]">Миний захиалгууд</h1>
          <div className="mt-8">
            <OrdersList orders={orders} newOrderId={Number(newId) || null} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
