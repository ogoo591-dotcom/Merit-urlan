import type { Course } from "@/lib/site-data";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="h-full overflow-hidden rounded-[2.2rem] border border-[#e7d2d0] bg-white shadow-[0_24px_55px_-35px_rgba(90,41,52,0.28)]">
      <div
        className="space-y-5 p-8 lg:p-10"
        style={{
          background: `linear-gradient(140deg, ${course.palette[0]}, ${course.palette[1]})`,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#a24457]">
            {course.level}
          </span>
          <span className="text-sm uppercase tracking-[0.18em] text-[#7f5f66]">{course.seats}</span>
        </div>
        <h3 className="font-serif text-3xl text-[#31202b] lg:text-[2.5rem]">{course.title}</h3>
        <p className="text-base leading-7 text-[#6b5058] lg:text-lg lg:leading-8">{course.description}</p>
      </div>

      <div className="flex items-center justify-between gap-4 p-6 lg:p-8">
        <p className="text-base font-medium text-[#9e7981] lg:text-lg">{course.duration}</p>
        <button className="rounded-full border-2 border-[#3a375d] px-6 py-3 text-base font-semibold text-[#3a375d] transition hover:bg-[#3a375d] hover:text-white lg:px-7 lg:text-lg">
          Сургалт үзэх
        </button>
      </div>
    </article>
  );
}
