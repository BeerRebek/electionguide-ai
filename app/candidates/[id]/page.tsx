import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CandidateProfile } from "@/components/features/candidates";

export const metadata: Metadata = {
  title: "Candidate Profile — ElectionGuide AI",
  description:
    "Deep-dive into a candidate's criminal cases, financial profile, education, and track record with AI-powered insights.",
};

export default function CandidateProfilePage() {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="pt-24" role="main">
        <CandidateProfile />
      </main>
      <Footer />
    </>
  );
}
