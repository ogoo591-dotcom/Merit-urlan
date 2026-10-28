"use client";

import { useAuthModal } from "@/components/auth/auth-modal-provider";
import type { Course } from "@/lib/site-data";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  const { requireAuth } = useAuthModal();

  return (
    <article className="h-full overflow-hidden rounded-[2.2rem] border border-[#e7d2d0] bg-white shadow-[0_24px_55px_-35px_rgba(90,41,52,0.28)]">
      <div
        className="space-y-5 p-8 lg:p-10"
        style={{
          background: `linear-gradient(140deg, ${course.palette[0]}, ${course.palette[1]})`,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-white/70 px-4 py-2 text-[10px] font-semibold text-[#a24457]">
            {course.level}
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#7f5f66]">{course.seats}</span>
        </div>
        <h3 className="font-serif text-[12px] text-[#31202b]">{course.title}</h3>
        <p className="text-[12px] leading-7 text-[#6b5058] lg:leading-8">{course.description}</p>
      </div>

      <div className="flex items-center justify-between gap-4 p-6 lg:p-8">
        <p className="text-[12px] font-medium text-[#9e7981]">{course.duration}</p>
        <button
          type="button"
          onClick={() => requireAuth(`/courses/enroll?course=${encodeURIComponent(course.title)}`)}
          className="rounded-full border-2 border-[#3a375d] px-6 py-3 text-[12px] font-semibold text-[#3a375d] transition hover:bg-[#3a375d] hover:text-white lg:px-7">
          Бүртгүүлэх
        </button>
      </div>
    </article>
  );
}
