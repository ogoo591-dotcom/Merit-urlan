import { auth } from "@clerk/nextjs/server";
import { BadgeCheck, CheckCircle2, Clock, Layers, Lock, PlayCircle, Signal } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { purchaseCourse } from "@/app/courses/actions";
import { PurchaseButton } from "@/components/purchase-button";
import { CourseProgressBar } from "@/components/courses/course-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCoursePrice, getCourse } from "@/lib/data/courses";
import { hasAccess } from "@/lib/data/purchases";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse((await params).id);
  return course ? { title: `${course.title} | Merit Urlan`, description: course.description } : {};
}

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) notFound();
  const { userId } = await auth();
  const owned = await hasAccess(userId, course.id);
  const firstFree = course.lessons.find((lesson) => lesson.isFree);

  return (
    <>
      <SiteHeader />
      <main className="bg-[#fcf6f0]">
        <section className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_1.1fr] lg:px-[60px]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#faf7f6]">
            <Image src={course.cover.src} alt={course.title} fill priority sizes="(max-width: 1024px) 90vw, 640px" className="object-cover" />
          </div>
          <div>
            <Link href="/courses" className="text-[11px] text-[#9c8c84] hover:text-[#a24456]">← Бүх сургалт</Link>
            <h1 className="mt-3 font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[52px]">{course.title}</h1>
            <p className="mt-4 text-[13px] leading-[1.9] text-[#7a6b63]">{course.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-[11px] text-[#4a3b35]">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#eadfd5]"><Signal aria-hidden className="h-3.5 w-3.5" />{course.levelLabel}</li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#eadfd5]"><Layers aria-hidden className="h-3.5 w-3.5" />{course.lessonCount} хичээл</li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#eadfd5]"><Clock aria-hidden className="h-3.5 w-3.5" />{course.totalDuration}</li>
            </ul>

            {owned ? (
              <div className="mt-8 rounded-2xl border border-[#eadfd5] bg-white p-5">
                <p className="mb-4 inline-flex items-center gap-2 text-[12px] font-semibold text-[#1f7a3d]">
                  <BadgeCheck aria-hidden className="h-4 w-4" /> Та энэ сургалтыг авсан
                </p>
                <CourseProgressBar courseId={course.id} lessonIds={course.lessons.map((lesson) => lesson.id)} />
                <Link href={`/courses/${course.id}/learn`} className="mt-5 block rounded-2xl bg-[#a24456] px-6 py-4 text-center text-[13px] font-semibold text-white transition hover:bg-[#8a3748]">
                  Үргэлжлүүлэн үзэх
                </Link>
              </div>
            ) : (
              <div className="mt-8">
                <p className="text-[28px] font-bold text-[#a24456]">{formatCoursePrice(course.price)}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {firstFree ? (
                    <Link
                      href={`/courses/${course.id}/learn?lesson=${firstFree.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#3d302c] px-6 py-4 text-[13px] font-semibold text-[#3d302c] transition hover:bg-[#3d302c] hover:text-white"
                    >
                      <PlayCircle aria-hidden className="h-5 w-5" /> 1-р хичээл үнэгүй үзэх
                    </Link>
                  ) : null}
                  <PurchaseButton action={purchaseCourse} itemId={course.id} price={course.price} label="Сургалт авах" />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 pb-20 lg:grid-cols-2 lg:px-[60px]">
          <div className="rounded-[24px] border border-[#eadfd5] bg-white p-7">
            <h2 className="text-[16px] font-semibold text-[#2f2420]">Юу сурах вэ</h2>
            <ul className="mt-5 grid gap-3">
              {course.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3 text-[12px] leading-relaxed text-[#4a3b35]">
                  <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#a24456]" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-[#eadfd5] bg-white p-7">
            <h2 className="text-[16px] font-semibold text-[#2f2420]">Хичээлүүд</h2>
            <ol className="mt-4 divide-y divide-[#f1ebe5]">
              {course.lessons.map((lesson, index) => {
                const open = owned || lesson.isFree;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/courses/${course.id}/learn?lesson=${lesson.id}`}
                      className="flex items-center gap-3 py-3.5 transition hover:text-[#a24456]"
                    >
                      {open ? (
                        <PlayCircle aria-label="Үзэх боломжтой" className="h-5 w-5 shrink-0 text-[#a24456]" />
                      ) : (
                        <Lock aria-label="Түгжээтэй" className="h-5 w-5 shrink-0 text-[#b3a69e]" />
                      )}
                      <span className="flex-1 text-[12px] text-[#2f2420]">
                        {index + 1}. {lesson.title}
                        {lesson.isFree && !owned ? (
                          <span className="ml-2 rounded-full bg-[#e3f4e8] px-2 py-0.5 text-[10px] font-semibold text-[#1f7a3d]">Үнэгүй</span>
                        ) : null}
                      </span>
                      <span className="text-[11px] text-[#9c8c84]">{lesson.duration}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
