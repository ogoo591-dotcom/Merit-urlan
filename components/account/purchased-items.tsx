import { Clock, Download, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CourseProgressBar } from "@/components/courses/course-progress";
import type { CourseDetail } from "@/types/courses";
import { paymentStatusLabel, paymentStatusTone, type Payment } from "@/types/payments";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { PatternDetail } from "@/types/patterns";

const sectionTitle = "text-[16px] font-semibold text-[#2f2420]";

// "Миний захиалгууд" доторх худалдаж авсан сургалт, схем (хоосон бол харагдахгүй).
export function PurchasedCourses({ courses }: { courses: CourseDetail[] }) {
  if (!courses.length) return null;
  return (
    <section>
      <h2 className={sectionTitle}>Сургалт ({courses.length})</h2>
      <ul className="mt-4 grid gap-5 md:grid-cols-2">
        {courses.map((course) => (
          <li key={course.id} className="flex gap-5 rounded-[24px] border border-[#eadfd5] bg-white p-4">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#faf7f6]">
              <Image src={course.cover.src} alt="" fill sizes="112px" className="object-cover" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="text-[14px] font-semibold text-[#2f2420]">{course.title}</h3>
              <p className="mt-1 text-[11px] text-[#9c8c84]">
                {course.lessonCount} хичээл · {course.totalDuration}
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
    </section>
  );
}

export function PurchasedPatterns({ patterns }: { patterns: PatternDetail[] }) {
  if (!patterns.length) return null;
  return (
    <section>
      <h2 className={sectionTitle}>Схем заавар ({patterns.length})</h2>
      <ul className="mt-4 grid gap-5 md:grid-cols-2">
        {patterns.map((pattern) => (
          <li key={pattern.id} className="flex items-center gap-4 rounded-[24px] border border-[#eadfd5] bg-white p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#faf7f6]">
              <Image src={pattern.cover.src} alt="" fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/patterns/${pattern.id}`} className="text-[14px] font-semibold text-[#2f2420] hover:text-[#a24456]">
                {pattern.name}
              </Link>
              <p className="mt-1 text-[11px] text-[#9c8c84]">
                {pattern.typeLabel} · {pattern.levelLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {/* Файлыг сервер эрх шалгаад олгоно (/api/patterns/[id]/download). */}
                <a
                  href={`/api/patterns/${pattern.id}/download?download=1`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#a24456] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#8a3748]"
                >
                  <Download aria-hidden className="h-3.5 w-3.5" /> Татах
                </a>
                <Link
                  href={`/patterns/${pattern.id}/view`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#a24456] px-3 py-2 text-[11px] font-semibold text-[#a24456] transition hover:bg-[#f7e9ec]"
                >
                  <Eye aria-hidden className="h-3.5 w-3.5" /> Онлайнаар үзэх
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Админы шалгалтад хүлээгдэж буй / татгалзсан сургалт, схемийн төлбөр.
export function PendingPayments({ payments }: { payments: Payment[] }) {
  if (!payments.length) return null;
  return (
    <section>
      <h2 className={sectionTitle}>Төлбөр</h2>
      <ul className="mt-4 space-y-3">
        {payments.map((payment) => (
          <li key={payment.id} className="flex flex-wrap items-center gap-3 rounded-[20px] border border-[#eadfd5] bg-white px-5 py-4 text-[12px]">
            <Clock aria-hidden className="h-4 w-4 shrink-0 text-[#9a6412]" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#2f2420]">{payment.summary}</p>
              <p className="mt-0.5 text-[11px] text-[#9c8c84]">
                {payment.code} · {formatDateTime(payment.createdAt)}
              </p>
            </div>
            <p className="font-bold text-[#2f2420]">{formatPrice(payment.amount)}</p>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${paymentStatusTone[payment.status]}`}>{paymentStatusLabel[payment.status]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
