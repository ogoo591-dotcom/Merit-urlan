import { AboutSection } from "@/components/about-section";
import { FaqSection } from "@/components/faq-section";
import { GallerySection } from "@/components/gallery-section";
import { HomeHero } from "@/components/home-hero";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhySection } from "@/components/why-section";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="snap-page text-stone-900">
        <HomeHero />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <WhySection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
