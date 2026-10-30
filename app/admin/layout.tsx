import { UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { getAdminUser } from "@/lib/auth";
import { countUnread } from "@/lib/data/notifications";

export const metadata: Metadata = { title: "Админ | Merit Urlan" };

// Middleware аль хэдийн шалгасан ч layout, хуудас, action бүр дахин шалгана.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getAdminUser();

  if (!admin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fcf6f0] px-6 text-center">
        <h1 className="text-[20px] font-semibold text-[#2f2420]">Хандах эрхгүй</h1>
        <p className="max-w-sm text-[12px] text-[#7a6b63]">Энэ хэсэгт зөвхөн админ эрхтэй хэрэглэгч орно.</p>
        <Link href="/" className="rounded-xl bg-[#a24456] px-6 py-3 text-[12px] font-semibold text-white">
          Нүүр хуудас руу буцах
        </Link>
      </main>
    );
  }

  const unread = await countUnread({ admin: true });

  return (
    <div className="flex min-h-screen bg-[#f7f3ef] text-[#2f2420]">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#eadfd5] bg-white p-6 md:flex">
        <Link href="/admin" className="font-serif text-[20px]">
          Merit урлан
          <span className="block font-sans text-[10px] uppercase tracking-[0.2em] text-[#a24456]">Админ</span>
        </Link>
        <AdminNav unread={unread} />
        <div className="mt-auto space-y-4">
          <Link href="/" className="block text-[12px] text-[#7a6b63] hover:text-[#2f2420]">
            ← Сайт руу буцах
          </Link>
          <div className="flex items-center gap-3 text-[12px]">
            <UserButton />
            <span className="truncate">{admin.fullName ?? admin.primaryEmailAddress?.emailAddress ?? "Админ"}</span>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="border-b border-[#eadfd5] bg-white px-4 py-3 md:hidden">
          <AdminNav compact unread={unread} />
        </div>
        <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
