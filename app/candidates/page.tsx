import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CandidatesOverview } from "@/components/features/candidates";

export const metadata: Metadata = {
  title: "Know Your Candidates — ElectionGuide AI",
  description:
    "Research candidates contesting in your constituency. View criminal records, financial declarations, education qualifications, and voting track records.",
};

export default function CandidatesPage() {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <main
        id="main-content"
        className="max-w-[1200px] mx-auto px-4 md:px-8 pt-24 pb-8 md:pb-12"
        role="main"
      >
        <CandidatesOverview />
      </main>
      <Footer />
    </>
  );
}
