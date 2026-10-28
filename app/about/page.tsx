export const runtime = "edge";

import { AboutSection } from "@/components/about-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <AboutSection />
      </main>
      <SiteFooter />
    </>
  );
}
