import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Hero } from "@/components/features/landing/Hero";
import { TrustBadges } from "@/components/features/landing/TrustBadges";
import { FeatureGrid } from "@/components/features/landing/FeatureGrid";
import { StatsBar } from "@/components/features/landing/StatsBar";
import { Footer } from "@/components/shared/Footer";

export default function LandingPage() {
  return (
    <>
      <SkipToContent />
      <Navbar />

      <main
        id="main-content"
        className="flex-grow flex flex-col gap-12 pb-12 pt-24"
        role="main"
      >
        <Hero />
        <TrustBadges />
        <FeatureGrid />
        <StatsBar />
      </main>

      <Footer />
    </>
  );
}
