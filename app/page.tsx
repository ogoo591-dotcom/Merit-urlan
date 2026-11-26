import { AboutSection } from "@/features/home/components/about-section";
import { FaqSection } from "@/features/home/components/faq-section";
import { GallerySection } from "@/features/home/components/gallery-section";
import { HomeHero } from "@/features/home/components/home-hero";
import { ServicesSection } from "@/features/home/components/services-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhySection } from "@/features/home/components/why-section";
import { getPatterns } from "@/server/services/patterns/queries";

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
