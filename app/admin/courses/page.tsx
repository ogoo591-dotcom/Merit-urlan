import { Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Notice, PageHeader, primaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getCourses } from "@/lib/data/courses";
import { getAllPurchases } from "@/lib/data/purchases";
import { formatPrice } from "@/lib/format";

export default async function AdminCoursesPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const [courses, purchases] = await Promise.all([getCourses(), getAllPurchases()]);

  return (
    <div>
      <PageHeader
        title="Сургалт"
        description="Сургалт, хичээл нэмэх, засах, видео линк оруулах"
        action={
          <Link href="/admin/courses/new" className={primaryButton}>
            <Plus aria-hidden className="h-4 w-4" /> Шинэ сургалт
          </Link>
        }
      />
      <div className="mt-4 space-y-2">
        {params.saved ? <Notice>Хадгаллаа.</Notice> : null}
        {params.deleted ? <Notice>Устгалаа.</Notice> : null}
      </div>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {courses.map((course) => {
          const sold = purchases.filter((item) => item.kind === "course" && item.itemId === course.id).length;
          return (
            <li key={course.id} className="flex gap-4 rounded-[20px] border border-[#eadfd5] bg-white p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#faf7f6]">
                <Image src={course.cover.src} alt="" fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold">{course.title}</p>
                <p className="mt-1 text-[11px] text-[#7a6b63]">
                  {course.levelLabel} · {course.lessonCount} хичээл ({course.freeLessonCount} үнэгүй)
                </p>
                <p className="mt-1 text-[12px]">
                  {formatPrice(course.price)} · <span className="text-[#7a6b63]">{sold} борлуулалт</span>
                </p>
                <Link href={`/admin/courses/${course.id}`} className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#a24456]">
                  <Pencil aria-hidden className="h-3.5 w-3.5" /> Засах
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
