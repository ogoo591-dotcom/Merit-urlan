import type { Metadata } from "next";

import { StoryTimeline } from "@/components/about/story-timeline";
import { AboutSection } from "@/components/about-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhySection } from "@/components/why-section";

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
