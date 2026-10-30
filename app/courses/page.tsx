import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";

import { CourseCard } from "@/components/courses/course-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCourses } from "@/lib/data/courses";
import { getPurchasedCourseIds } from "@/lib/data/purchases";

export const metadata: Metadata = { title: "Сургалт | Merit Urlan" };

const filters = [
  { label: "Бүгд", query: "" },
  { label: "Эхлэгчдэд", query: "level=beginner" },
  { label: "Дунд шат", query: "level=intermediate" },
  { label: "Ахисан шат", query: "level=advanced" },
  { label: "Amigurumi", query: "topic=amigurumi" },
];

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ level?: string; topic?: string }> }) {
  const { level, topic } = await searchParams;
  const { userId } = await auth();
  const [courses, purchased] = await Promise.all([getCourses({ level, topic }), getPurchasedCourseIds(userId)]);
  const activeQuery = level ? `level=${level}` : topic ? `topic=${topic}` : "";

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0]">
        <section className="mx-auto w-full max-w-[1600px] px-6 py-12 lg:px-[60px]">
          <div className="border-b border-[#eadfd5] pb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a24456]">Онлайн сургалт</p>
            <h1 className="mt-2 font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[48px]">Сургалт</h1>
            <p className="mt-2 text-[12px] text-[#7a6b63]">
              Видео хичээлээр алхам алхмаар сураарай. Сургалт бүрийн 1-р хичээлийг үнэгүй үзэж болно.
            </p>
          </div>

          <nav aria-label="Сургалт шүүх" className="mt-8 flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = filter.query === activeQuery;
              return (
                <Link
                  key={filter.label}
                  href={filter.query ? `/courses?${filter.query}` : "/courses"}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-[12px] font-medium transition ${
                    active ? "bg-[#a24456] text-white" : "bg-white text-[#4a3b35] ring-1 ring-[#eadfd5] hover:ring-[#a24456]"
                  }`}
                >
                  {filter.label}
                </Link>
              );
            })}
          </nav>

          {courses.length ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {courses.map((course) => (
                <li key={course.id}>
                  <CourseCard course={course} purchased={purchased.includes(course.id)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-[22px] border border-dashed border-[#e3d6cb] bg-white/60 px-6 py-16 text-center text-[13px] text-[#7a6b63]">
              Энэ ангилалд одоогоор сургалт алга
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
