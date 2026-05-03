import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CandidateCompare } from "@/components/features/candidates/CandidateCompare";

export const metadata: Metadata = {
  title: "Compare Candidates — ElectionGuide AI",
  description:
    "Side-by-side comparison of candidates contesting in your constituency. Compare criminal records, financial declarations, education, and track records.",
};

export default function CandidateComparePage() {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <main
        id="main-content"
        className="max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-8 md:pb-12"
        role="main"
      >
        <CandidateCompare />
      </main>
      <Footer />
    </>
  );
}
