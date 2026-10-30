import { auth } from "@clerk/nextjs/server";
import { ArrowRight, BadgeCheck, Download, FileText, Languages, Ruler, Signal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { purchasePattern } from "@/app/patterns/actions";
import { PatternGallery } from "@/components/patterns/pattern-gallery";
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
  const owned = await hasPatternAccess(userId, pattern.id);

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
    { icon: Languages, label: "Хэл", value: `${pattern.sourceLanguage} → Монгол орчуулга` },
    { icon: FileText, label: "Формат", value: `PDF · ${pattern.pages} хуудас` },
  ];

  return (
    <>
      <SiteHeader />
      <main className="bg-[#fcf6f0]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-[60px]">
          <PatternGallery
            name={pattern.name}
            images={[
              { src: pattern.cover.src, label: "Бүтээл" },
              ...pattern.previews.map((src, index) => ({ src, label: `${index + 1}-р хуудас` })),
            ]}
          />

          <div>
            <Link href="/patterns" className="text-[11px] text-[#9c8c84] hover:text-[#a24456]">← Бүх схем</Link>
            <p className="mt-4 text-[10px] uppercase tracking-[0.15em] text-[#9c8c84]">{pattern.typeLabel}</p>
            <h1 className="mt-2 font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[48px]">{pattern.name}</h1>
            <p className="mt-4 text-[13px] leading-[1.9] text-[#7a6b63]">{pattern.description}</p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 rounded-2xl border border-[#efe4da] bg-white px-4 py-3">
                  <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#a24456]" />
                  <div>
                    <dt className="text-[10px] text-[#9c8c84]">{label}</dt>
                    <dd className="mt-0.5 text-[12px] font-medium text-[#2f2420]">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-8 rounded-[24px] border border-[#eadfd5] bg-white p-6">
              {owned ? (
                <>
                  <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#1f7a3d]">
                    <BadgeCheck aria-hidden className="h-4 w-4" /> Та энэ схемийг авсан
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <a
                      href={`/api/patterns/${pattern.id}/download`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#a24456] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#8a3748]"
                    >
                      <Download aria-hidden className="h-5 w-5" /> PDF татах
                    </a>
                    <Link
                      href="/library"
                      className="inline-flex items-center justify-center rounded-2xl border-2 border-[#3d302c] px-6 py-4 text-[13px] font-semibold text-[#3d302c] transition hover:bg-[#3d302c] hover:text-white"
                    >
                      Миний сан
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[28px] font-bold text-[#a24456]">{formatPatternPrice(pattern.price)}</p>
                  <p className="mt-1 text-[11px] text-[#9c8c84]">Төлбөр төлөгдмөгц PDF “Миний сан”-д нэмэгдэнэ.</p>
                  <PurchaseButton
                    action={purchasePattern}
                    itemId={pattern.id}
                    price={pattern.price}
                    label="Худалдаж авах"
                    className="mt-4 w-full"
                  />
                </>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-[15px] font-semibold text-[#2f2420]">Шаардлагатай материал</h2>
              <ul className="mt-4 divide-y divide-[#f1ebe5] rounded-2xl border border-[#efe4da] bg-white">
                {pattern.materials.map((material) => (
                  <li key={material.name} className="flex items-center justify-between gap-4 px-5 py-3 text-[12px]">
                    <span className="text-[#2f2420]">{material.name}</span>
                    {material.href ? (
                      <Link href={material.href} className="shrink-0 font-medium text-[#a24456] hover:underline">
                        Дэлгүүрээс авах
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
              {linked && materialCta ? (
                <Link
                  href={linked.href!}
                  className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#a24456] hover:underline"
                >
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
