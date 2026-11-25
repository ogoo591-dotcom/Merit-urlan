import type { Metadata } from "next";

import { StoryTimeline } from "@/features/about/components/story-timeline";
import { AboutSection } from "@/features/home/components/about-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhySection } from "@/features/home/components/why-section";

export const metadata: Metadata = {
  title: "Бидний тухай | Merit Urlan",
  description: "Merit урлангийн танилцуулга, түүх болон давуу тал.",
};

// Танилцуулга (#about) → түүх (#story) → давуу тал (#why). Цэсний "Бидний тухай" дэд ангиллууд эдгээр рүү заана.
export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="[&_section]:scroll-mt-[var(--header-h,130px)]">
        <AboutSection headingLevel="h1" />
        <StoryTimeline />
        <WhySection />
      </main>
      <SiteFooter />
    </>
  );
}
