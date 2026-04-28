"use client";

import { useEffect, useRef, useState } from "react";

import { CourseCard } from "@/components/course-card";
import type { Course } from "@/lib/site-data";

type CoursesCarouselProps = {
  courses: Course[];
};

export function CoursesCarousel({ courses }: CoursesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const onScroll = () => {
      const slides = Array.from(node.children) as HTMLElement[];
      if (!slides.length) return;

      const viewportCenter = node.scrollLeft + node.clientWidth / 2;
      let nextIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const distance = Math.abs(slideCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          nextIndex = index;
        }
      });

      setCurrentIndex(nextIndex);
    };

    onScroll();
    node.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [courses.length]);

  const scrollToIndex = (index: number) => {
    const node = trackRef.current;
    if (!node) return;
    const slides = Array.from(node.children) as HTMLElement[];
    const clampedIndex = Math.max(0, Math.min(index, slides.length - 1));
    const target = slides[clampedIndex];
    if (!target) return;

    node.scrollTo({
      left: target.offsetLeft - (node.clientWidth - target.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-14">
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="Өмнөх сургалт"
          className="absolute left-0 top-1/2 z-10 hidden h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-[#2f3742] text-4xl text-white shadow-[0_20px_45px_-28px_rgba(20,20,20,0.5)] transition hover:bg-[#232933] disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        >
          ←
        </button>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-0 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:px-20"
        >
          {courses.map((course) => (
            <div
              key={course.title}
              className="w-[82vw] min-w-[82vw] snap-center sm:w-[28rem] sm:min-w-[28rem] lg:w-[40rem] lg:min-w-[40rem]"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex === courses.length - 1}
          aria-label="Дараах сургалт"
          className="absolute right-0 top-1/2 z-10 hidden h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-[#2f3742] text-4xl text-white shadow-[0_20px_45px_-28px_rgba(20,20,20,0.5)] transition hover:bg-[#232933] disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        >
          →
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-5 text-3xl text-[#676c75]">
        <button
          type="button"
          onClick={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="transition disabled:opacity-35"
          aria-label="Өмнөх сургалт"
        >
          ←
        </button>
        <p className="min-w-20 text-center text-2xl font-medium">
          {currentIndex + 1} / {courses.length}
        </p>
        <button
          type="button"
          onClick={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex === courses.length - 1}
          className="transition disabled:opacity-35"
          aria-label="Дараах сургалт"
        >
          →
        </button>
      </div>
    </section>
  );
}
