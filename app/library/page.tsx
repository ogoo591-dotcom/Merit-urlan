import { auth } from "@clerk/nextjs/server";
import { Download, Library } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CourseProgressBar } from "@/components/courses/course-progress";
import { EmptyPage } from "@/components/empty-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCourse, type CourseDetail } from "@/lib/data/courses";
import { getPattern, type PatternDetail } from "@/lib/data/patterns";
import { getPurchasedCourseIds, getPurchasedPatternIds } from "@/lib/data/purchases";

export const metadata: Metadata = { title: "Миний сан | Merit Urlan" };

export default async function LibraryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <EmptyPage
        icon={Library}
        eyebrow="Миний сан"
        title="Сангаа харахын тулд нэвтэрнэ үү"
        description="Худалдаж авсан сургалт, схем заавар тань энд хадгалагдана."
        actions={[
          { label: "Нэвтрэх", href: "/sign-in?redirect_url=/library" },
          { label: "Сургалт үзэх", href: "/courses" },
        ]}
      />
    );
  }

  const [courseIds, patternIds] = await Promise.all([getPurchasedCourseIds(userId), getPurchasedPatternIds(userId)]);
  const [courses, patterns] = await Promise.all([
    Promise.all(courseIds.map((id) => getCourse(id))).then((items) => items.filter((item): item is CourseDetail => Boolean(item))),
    Promise.all(patternIds.map((id) => getPattern(id))).then((items) => items.filter((item): item is PatternDetail => Boolean(item))),
  ]);

  if (!courses.length && !patterns.length) {
    return (
      <EmptyPage
        icon={Library}
        eyebrow="Миний сан"
        title="Таны сан хоосон байна"
        description="Худалдаж авсан сургалт, схем заавар тань энд хадгалагдана. Хүссэн үедээ орж үзэж, татаж аваарай."
        actions={[
          { label: "Сургалт үзэх", href: "/courses" },
          { label: "Схем үзэх", href: "/patterns" },
        ]}
      />
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0] px-6 py-12 lg:px-[60px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">Миний сан</p>
          <h1 className="mt-3 font-serif text-[40px] leading-tight text-[#2f2420]">Миний сан</h1>

          <h2 className="mt-10 text-[16px] font-semibold text-[#2f2420]">Сургалт ({courses.length})</h2>
          {!courses.length ? (
            <p className="mt-4 text-[12px] text-[#7a6b63]">
              Одоогоор сургалт аваагүй байна. <Link href="/courses" className="font-medium text-[#a24456] underline underline-offset-4">Сургалт үзэх</Link>
            </p>
          ) : null}
          <ul className="mt-4 grid gap-5 md:grid-cols-2">
            {courses.map((course) => (
              <li key={course.id} className="flex gap-5 rounded-[24px] border border-[#eadfd5] bg-white p-4">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#faf7f6]">
                  <Image src={course.cover.src} alt="" fill sizes="112px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="text-[14px] font-semibold text-[#2f2420]">{course.title}</h2>
                  <p className="mt-1 text-[11px] text-[#9c8c84]">
                    {course.levelLabel} · {course.totalDuration}
                  </p>
                  <div className="mt-3">
                    <CourseProgressBar courseId={course.id} lessonIds={course.lessons.map((lesson) => lesson.id)} />
                  </div>
                  <Link
                    href={`/courses/${course.id}/learn`}
                    className="mt-3 self-start rounded-xl bg-[#a24456] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#8a3748]"
                  >
                    Үргэлжлүүлэх
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-[16px] font-semibold text-[#2f2420]">Схем заавар ({patterns.length})</h2>
          {!patterns.length ? (
            <p className="mt-4 text-[12px] text-[#7a6b63]">
              Одоогоор схем аваагүй байна. <Link href="/patterns" className="font-medium text-[#a24456] underline underline-offset-4">Схем үзэх</Link>
            </p>
          ) : null}
          <ul className="mt-4 grid gap-5 md:grid-cols-2">
            {patterns.map((pattern) => (
              <li key={pattern.id} className="flex items-center gap-5 rounded-[24px] border border-[#eadfd5] bg-white p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#faf7f6]">
                  <Image src={pattern.cover.src} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/patterns/${pattern.id}`} className="text-[14px] font-semibold text-[#2f2420] hover:text-[#a24456]">
                    {pattern.name}
                  </Link>
                  <p className="mt-1 text-[11px] text-[#9c8c84]">
                    PDF · {pattern.pages} хуудас · Монгол орчуулга
                  </p>
                </div>
                {/* Татах линкийг сервер эрх шалгаад олгоно (/api/patterns/[id]/download). */}
                <a
                  href={`/api/patterns/${pattern.id}/download`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#a24456] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#8a3748]"
                >
                  <Download aria-hidden className="h-4 w-4" /> PDF татах
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
