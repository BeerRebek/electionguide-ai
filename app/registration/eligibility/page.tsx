import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import { EligibilityClient } from "./EligibilityClient";

export const metadata: Metadata = {
  title: "Check Eligibility — Voter Registration — ElectionGuide AI",
  description: "Verify your eligibility to vote in the upcoming Indian elections.",
};

export default function EligibilityPage() {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="max-w-[700px] mx-auto px-6 pb-8 md:pb-12 pt-24" role="main">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/registration"
            className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Registration
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-2 leading-tight">Check Your Eligibility</h1>
        <p className="text-on-surface-variant mb-6">Answer a few questions to find out if you can vote in the upcoming elections.</p>
        <EligibilityClient />
      </main>
      <Footer />
    </>
  );
}
