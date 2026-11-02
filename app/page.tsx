import { AboutSection } from "@/components/about-section";
import { FaqSection } from "@/components/faq-section";
import { GallerySection } from "@/components/gallery-section";
import { HomeHero } from "@/components/home-hero";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhySection } from "@/components/why-section";
import { getPatterns } from "@/lib/data/patterns";

export default async function HomePage() {
  const [latestPattern] = await getPatterns({ sort: "new" });

  return (
    <>
      <SiteHeader />
      <main className="snap-page text-stone-900">
        <HomeHero />
        <AboutSection />
        <ServicesSection patternImage={latestPattern?.cover.src ?? null} />
        <GallerySection />
        <WhySection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
