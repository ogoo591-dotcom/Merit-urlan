import { BadgeCheck, Clock, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatCoursePrice, type CourseSummary } from "@/lib/data/courses";

export function CourseCard({ course, purchased }: { course: CourseSummary; purchased: boolean }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#ecd3d9] bg-white transition hover:-translate-y-1 hover:border-[#a24456] hover:shadow-[0_22px_45px_-30px_rgba(162,68,86,0.5)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#faf7f6]">
        <Image
          src={course.cover.src}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {purchased ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#3d302c] px-3 py-1.5 text-[10px] font-semibold text-white">
            <BadgeCheck aria-hidden className="h-3.5 w-3.5" /> Худалдаж авсан
          </span>
        ) : course.freeLessonCount ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#e3f4e8] px-3 py-1.5 text-[10px] font-semibold text-[#1f7a3d]">
            <PlayCircle aria-hidden className="h-3.5 w-3.5" /> 1-р хичээл үнэгүй
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] uppercase tracking-[0.12em] text-[#9c8c84]">{course.levelLabel}</p>
        <h3 className="mt-1.5 text-[15px] font-semibold text-[#2f2420]">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[#7a6b63]">{course.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="flex items-center gap-1.5 text-[11px] text-[#7a6b63]">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            {course.lessonCount} хичээл · {course.totalDuration}
          </p>
          <p className="text-[15px] font-bold text-[#a24456]">{formatCoursePrice(course.price)}</p>
        </div>
      </div>
    </Link>
  );
}
