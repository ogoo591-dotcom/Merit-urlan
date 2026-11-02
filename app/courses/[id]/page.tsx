import { auth } from "@clerk/nextjs/server";
import { BadgeCheck, Check, CheckCircle2, Clock, Layers, Lock, PlayCircle, Signal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CourseCartActions, CourseGallery, ShareButton } from "@/components/courses/course-buy";
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
  const perks = [
    `${course.lessonCount} видео хичээл, нийт ${course.totalDuration}`,
    "Эхнээс нь дуустал алхам алхмаар заасан",
    ...(course.level === "beginner" ? ["Анхан шатныхан ч хамрагдах боломжтой"] : []),
    "Материалын талаарх мэдээллийг хичээл бүрт өгнө",
    "Хүссэн үедээ, хэдэн ч удаа үзэх эрхтэй",
    "Асуух зүйлээ Messenger-ээр асууж болно",
  ];

  return (
    <>
      <SiteHeader />
      <main className="bg-[#fcf6f0]">
        <section className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-[60px]">
          <CourseGallery title={course.title} images={course.images} />

          <div>
            <Link href="/courses" className="text-[11px] text-[#9c8c84] hover:text-[#a24456]">← Бүх сургалт</Link>
            <div className="mt-3 flex items-start justify-between gap-4">
              <h1 className="font-serif text-[34px] leading-tight text-[#2f2420] lg:text-[44px]">{course.title}</h1>
              <ShareButton title={course.title} />
            </div>
            <ul className="mt-4 flex flex-wrap gap-2 text-[11px] text-[#4a3b35]">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#eadfd5]"><Signal aria-hidden className="h-3.5 w-3.5" />{course.levelLabel}</li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#eadfd5]"><Layers aria-hidden className="h-3.5 w-3.5" />{course.lessonCount} хичээл</li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#eadfd5]"><Clock aria-hidden className="h-3.5 w-3.5" />{course.totalDuration}</li>
            </ul>

            {!owned ? <p className="mt-6 text-[30px] font-bold text-[#a24456]">{formatCoursePrice(course.price)}</p> : null}

            <p className="mt-5 text-[13px] leading-[1.9] text-[#7a6b63]">{course.description}</p>
            <ul className="mt-5 space-y-2.5">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-[12px] leading-relaxed text-[#4a3b35]">
                  <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#a24456]" strokeWidth={2.5} />
                  {perk}
                </li>
              ))}
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
              <div className="mt-8 space-y-4">
                <CourseCartActions course={{ id: course.id, title: course.title, price: course.price, image: course.cover.src }} />
                {firstFree ? (
                  <Link
                    href={`/courses/${course.id}/learn?lesson=${firstFree.id}`}
                    className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#a24456] underline-offset-4 hover:underline"
                  >
                    <PlayCircle aria-hidden className="h-4 w-4" /> 1-р хичээлийг үнэгүй үзэх
                  </Link>
                ) : null}
                <p className="text-[11px] leading-relaxed text-[#9c8c84]">
                  QPay-ээр төлсний дараа бүх хичээл шууд нээгдэж, “Миний сан” хэсэгт хадгалагдана.
                </p>
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
