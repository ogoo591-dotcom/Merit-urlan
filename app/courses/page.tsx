export const runtime = "edge";

import { CoursesCarousel } from "@/components/courses-carousel";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { courseHighlights, featuredCourses } from "@/lib/site-data";

export default function CoursesPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f7f0ea] text-stone-900">
        <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading
              eyebrow="Courses"
              title="Practical crochet education with an atelier feel."
              description="Each Merit Urlan course balances clear instruction, refined visual presentation, and real-world making confidence."
            />
            <div className="grid gap-4">
              {courseHighlights.map((highlight) => (
                <div key={highlight} className="rounded-[1.75rem] border border-black/5 bg-white/80 p-6 text-stone-700 shadow-[0_24px_70px_-50px_rgba(59,34,20,0.35)]">
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <CoursesCarousel courses={featuredCourses} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
