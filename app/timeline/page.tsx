import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Footer } from "@/components/shared/Footer";
import { ElectionTimeline } from "@/components/features/timeline";

export const metadata: Metadata = {
  title: "Election Timeline — ElectionGuide AI",
  description:
    "Understand every step of the Indian election lifecycle — from voter roll preparation to results declaration. Interactive phase cards with EVM/VVPAT lifecycle guide.",
};

export default function TimelinePage() {
  return (
    <>
      <SkipToContent />
      <main
        id="main-content"
        className="max-w-[1200px] mx-auto px-6 pb-8 md:pb-12 pt-6"
        role="main"
      >
        <ElectionTimeline />
      </main>
      <Footer />
    </>
  );
}
