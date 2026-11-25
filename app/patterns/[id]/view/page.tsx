import { auth } from "@clerk/nextjs/server";
import { ChevronLeft, Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPattern } from "@/server/modules/patterns/queries";
import { hasPatternAccess } from "@/server/modules/purchases/queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pattern = await getPattern((await params).id);
  return pattern ? { title: `${pattern.name} — онлайнаар үзэх | Merit Urlan`, robots: { index: false } } : {};
}

// Худалдаж авсан схемийг сайт дотор үзэх. Файл нь /api/patterns/[id]/download-оос (сервер эрх шалгана) inline ирнэ.
export default async function PatternViewPage({ params }: Props) {
  const { id } = await params;
  const pattern = await getPattern(id);
  if (!pattern) notFound();
  const { userId } = await auth();
  if (!pattern.isFree && !(await hasPatternAccess(userId, pattern.id))) redirect(`/patterns/${pattern.id}`);

  const fileUrl = `/api/patterns/${pattern.id}/download`;

  return (
    <>
      <SiteHeader />
      <main className="bg-[#fcf6f0]">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-[60px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Link href={`/patterns/${pattern.id}`} className="inline-flex items-center gap-1 text-[11px] text-[#9c8c84] hover:text-[#a24456]">
                <ChevronLeft aria-hidden className="h-3.5 w-3.5" /> Схемийн хуудас
              </Link>
              <h1 className="mt-2 font-serif text-[28px] leading-tight text-[#2f2420] lg:text-[34px]">{pattern.name}</h1>
            </div>
            <a
              href={`${fileUrl}?download=1`}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#a24456] px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-[#8a3748]"
            >
              <Download aria-hidden className="h-4 w-4" /> {pattern.fileKind === "pdf" ? "PDF татах" : "Схем татах"}
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-[20px] border border-[#eadfd5] bg-white">
            {pattern.fileKind === "pdf" ? (
              // Хөтчийн PDF viewer. Утсан дээр хуудас бүрэн харагдахгүй бол "PDF татах" товчоор нээнэ.
              <iframe src={fileUrl} title={`${pattern.name} — схем`} className="h-[calc(100svh-var(--header-h,130px)-10rem)] min-h-[480px] w-full" />
            ) : (
              // next/image нь нэвтрэлтийн cookie дамжуулдаггүй тул энгийн img.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fileUrl} alt={`${pattern.name} — бүтэн схем`} className="mx-auto h-auto w-full max-w-[1000px]" />
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
