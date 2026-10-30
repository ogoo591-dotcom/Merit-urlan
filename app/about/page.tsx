import type { Metadata } from "next";

import { AboutContact } from "@/components/about/about-contact";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStats } from "@/components/about/about-stats";
import { StoryTimeline } from "@/components/about/story-timeline";
import { FaqSection } from "@/components/faq-section";
import { GallerySection } from "@/components/gallery-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhySection } from "@/components/why-section";

export const metadata: Metadata = {
  title: "Бидний тухай | Merit Urlan",
  description: "Merit урлангийн түүх, давуу тал, бүтээлүүд болон холбоо барих мэдээлэл.",
};

// Хэсэг бүр #anchor-тай: #story, #stats, #why, #gallery, #faq, #contact (цэсний "Бидний тухай" дэд ангиллууд энд заана).
export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="[&_section]:scroll-mt-[var(--header-h,130px)]">
        <AboutHero />
        <StoryTimeline />
        <AboutStats />
        <WhySection />
        <GallerySection />
        <FaqSection />
        <AboutContact />
      </main>
      <SiteFooter id="site-footer" />
    </>
  );
}
