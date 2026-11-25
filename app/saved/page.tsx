import type { Metadata } from "next";

import { SavedList } from "@/features/saved/components/saved-list";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = { title: "Хадгалсан | Merit Urlan" };

export default function SavedPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0] px-6 py-14 lg:px-[60px]">
        <div className="mx-auto w-full max-w-[1600px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]">Хадгалсан</p>
          <h1 className="mt-3 font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[48px]">Таны хадгалсан бараа</h1>
          <div className="mt-10">
            <SavedList />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
