import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type EmptyPageProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  actions: Array<{ label: string; href: string }>;
};

// Агуулга нь хараахан бэлэн болоогүй хэсгүүдийн (Схем, Хадгалсан, Миний сан) нийтлэг хуудас.
export function EmptyPage({ icon: Icon, eyebrow, title, description, actions }: EmptyPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[calc(100svh-var(--header-h,130px))] items-center justify-center bg-[#fcf6f0] bg-[radial-gradient(#efe2d7_1px,transparent_1px)] px-6 py-20 [background-size:28px_28px]">
        <div className="w-full max-w-[560px] rounded-[28px] border border-[#efe4da] bg-white p-10 text-center shadow-[0_30px_70px_-45px_rgba(70,45,35,0.45)]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7e9ec] text-[#a24456]">
            <Icon aria-hidden className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-[32px] leading-tight text-[#2f2420]">{title}</h1>
          <p className="mx-auto mt-4 max-w-[420px] text-[12px] leading-[1.9] text-[#7a6b63]">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {actions.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className={
                  index === 0
                    ? "rounded-xl bg-[#a24456] px-6 py-3.5 text-[12px] font-semibold text-white transition hover:bg-[#8a3748]"
                    : "rounded-xl border border-[#e3d6cb] px-6 py-3.5 text-[12px] font-semibold text-[#2f2420] transition hover:border-[#a24456] hover:text-[#a24456]"
                }
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
