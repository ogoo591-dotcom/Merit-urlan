import { auth } from "@clerk/nextjs/server";
import { Bell } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { markMyNotificationsRead } from "@/app/actions";
import { MarkReadOnView } from "@/components/mark-read-on-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCustomerNotifications } from "@/lib/data/notifications";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Мэдэгдэл | Merit Urlan" };

export default async function AccountNotificationsPage() {
  const { userId } = await auth.protect();
  const notifications = await getCustomerNotifications(userId);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0] px-6 py-12 lg:px-[60px]">
        <div className="mx-auto w-full max-w-[760px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">Миний булан</p>
          <h1 className="mt-3 font-serif text-[40px] leading-tight text-[#2f2420]">Мэдэгдэл</h1>
          {notifications.some((item) => !item.read) ? <MarkReadOnView action={markMyNotificationsRead} /> : null}

          {notifications.length ? (
            <ul className="mt-8 divide-y divide-[#f1ebe5] overflow-hidden rounded-[24px] border border-[#eadfd5] bg-white">
              {notifications.map((item) => (
                <li key={item.id} className={`flex items-center gap-4 px-5 py-4 ${item.read ? "" : "bg-[#fdf3f5]"}`}>
                  <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${item.read ? "bg-transparent" : "bg-[#a24456]"}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] ${item.read ? "text-[#4a3b35]" : "font-semibold text-[#2f2420]"}`}>{item.message}</p>
                    <p className="mt-1 text-[11px] text-[#9c8c84]">{formatDateTime(item.createdAt)}</p>
                  </div>
                  {item.href ? (
                    <Link href={item.href} className="shrink-0 text-[12px] font-medium text-[#a24456]">
                      Харах
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-[24px] border border-[#eadfd5] bg-white p-10 text-center text-[12px] text-[#7a6b63]">
              <Bell aria-hidden className="mx-auto mb-3 h-8 w-8 text-[#b3a69e]" strokeWidth={1.5} />
              Одоогоор мэдэгдэл алга
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
