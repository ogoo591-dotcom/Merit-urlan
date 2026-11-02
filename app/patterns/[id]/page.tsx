import { auth } from "@clerk/nextjs/server";
import { ArrowRight, BadgeCheck, Download, Gift, Languages, Lock, PenLine, Ruler, Signal } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { purchasePattern } from "@/app/patterns/actions";
import { PurchaseButton } from "@/components/purchase-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPatternPrice, getPattern } from "@/lib/data/patterns";
import { hasPatternAccess } from "@/lib/data/purchases";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pattern = await getPattern((await params).id);
  return pattern ? { title: `${pattern.name} — схем | Merit Urlan`, description: pattern.description } : {};
}

export default async function PatternDetailPage({ params }: Props) {
  const { id } = await params;
  const pattern = await getPattern(id);
  if (!pattern) notFound();
  const { userId } = await auth();
  const owned = !pattern.isFree && (await hasPatternAccess(userId, pattern.id));
  const open = pattern.isFree || owned;
  const fileUrl = `/api/patterns/${pattern.id}/download`;

  // "Энэ схемд хэрэгтэй утас →" — дэлгүүрт байгаа эхний материал руу.
  const linked = pattern.materials.find((material) => material.href);
  const materialCta = linked
    ? linked.category?.toLowerCase().includes("утас")
      ? "Энэ схемд хэрэгтэй утас"
      : "Энэ схемд хэрэгтэй материал"
    : null;

  const facts = [
    { icon: Signal, label: "Түвшин", value: pattern.levelLabel },
    { icon: Ruler, label: "Хэмжээ", value: pattern.size },
    { icon: Languages, label: "Схемийн хэл", value: pattern.sourceLanguage },
    { icon: PenLine, label: "Эх зохиогч", value: pattern.credit },
  ].filter((fact) => fact.value);

  return (
    <>
      <SiteHeader />
      <main className="bg-[#fcf6f0]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:px-[60px]">
          {/* Бүтэн схем: зөвхөн эрхтэй үед route-оос ирнэ. Эрхгүй үед нийтэд нээлттэй бүтээлийн зураг л харагдана. */}
          <section aria-label="Схем">
            {open && pattern.fileKind === "image" ? (
              <a href={fileUrl} target="_blank" rel="noreferrer" title="Том хэмжээгээр нээх" className="block overflow-hidden rounded-[20px] border border-[#eadfd5] bg-white">
                {/* next/image нь нэвтрэлтийн cookie дамжуулдаггүй тул энгийн img. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fileUrl} alt={`${pattern.name} — бүтэн схем`} className="h-auto w-full" />
              </a>
            ) : (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-[#eadfd5] bg-white">
                <Image src={pattern.cover.src} alt={pattern.name} fill priority sizes="(max-width: 1024px) 90vw, 700px" className="object-cover" />
                {!open ? (
                  <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-[#2f2420]/85 px-5 py-4 text-white">
                    <Lock aria-hidden className="h-5 w-5 shrink-0" />
                    <p className="text-[12px] leading-relaxed">Бүтэн схем төлбөр төлсний дараа энд нээгдэнэ.</p>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          <div className="lg:sticky lg:top-[calc(var(--header-h,130px)+1.5rem)] lg:self-start">
            <Link href="/patterns" className="block text-[11px] text-[#9c8c84] hover:text-[#a24456]">← Бүх схем</Link>
            <p
              className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                pattern.isFree ? "bg-[#e7f4ea] text-[#1f7a3d]" : "bg-[#f7e9ec] text-[#a24456]"
              }`}
            >
              {pattern.isFree ? <Gift aria-hidden className="h-3.5 w-3.5" /> : <Lock aria-hidden className="h-3.5 w-3.5" />}
              {pattern.isFree ? "Үнэгүй схем" : "Төлбөртэй схем"}
            </p>
            <h1 className="mt-3 font-serif text-[34px] leading-tight text-[#2f2420] lg:text-[40px]">{pattern.name}</h1>
            <p className="mt-3 text-[13px] leading-[1.9] text-[#7a6b63]">{pattern.description}</p>

            <div className="mt-6">
              {open ? (
                <>
                  {owned ? (
                    <p className="mb-3 inline-flex items-center gap-2 text-[12px] font-semibold text-[#1f7a3d]">
                      <BadgeCheck aria-hidden className="h-4 w-4" /> Та энэ схемийг авсан · “Миний сан”-д хадгалагдсан
                    </p>
                  ) : null}
                  <a
                    href={`${fileUrl}?download=1`}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#a24456] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#8a3748]"
                  >
                    <Download aria-hidden className="h-5 w-5" /> {pattern.fileKind === "pdf" ? "PDF татах" : "Схем татах"}
                  </a>
                </>
              ) : (
                <>
                  <p className="text-[28px] font-bold text-[#a24456]">{formatPatternPrice(pattern.price)}</p>
                  <p className="mt-1 text-[11px] text-[#9c8c84]">Төлбөр төлөгдмөгц схем нээгдэж, “Миний сан”-д хадгалагдана.</p>
                  <PurchaseButton action={purchasePattern} itemId={pattern.id} price={pattern.price} label="Төлөөд авах" className="mt-4 w-full" />
                </>
              )}
            </div>

            <dl className="mt-6 divide-y divide-[#f1ebe5] border-y border-[#f1ebe5]">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-3 text-[12px]">
                  <Icon aria-hidden className="h-4 w-4 shrink-0 text-[#a24456]" />
                  <dt className="text-[#9c8c84]">{label}</dt>
                  <dd className="ml-auto font-medium text-[#2f2420]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <h2 className="text-[14px] font-semibold text-[#2f2420]">Шаардлагатай материал</h2>
              <ul className="mt-3 space-y-2">
                {pattern.materials.map((material) => (
                  <li key={material.name} className="flex items-center justify-between gap-4 text-[12px]">
                    <span className="text-[#4a3b35]">{material.name}</span>
                    {material.href ? (
                      <Link href={material.href} className="shrink-0 font-medium text-[#a24456] hover:underline">
                        Дэлгүүрээс авах
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
              {linked && materialCta ? (
                <Link href={linked.href!} className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#a24456] hover:underline">
                  {materialCta} <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
