import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import CorrectionClient from "./CorrectionClient";

export const metadata: Metadata = {
  title: "Correct Voter Details — ElectionGuide AI",
  description: "Submit a correction request for your voter registration details.",
};

export default function CorrectionPage() {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="max-w-[700px] mx-auto px-6 pb-8 md:pb-12 pt-24" role="main">
        <div className="mb-6">
          <Link href="/registration" className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors w-fit">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Registration
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-2 leading-tight">Correct Your Details</h1>
        <p className="text-on-surface-variant mb-6">
          Submit a correction for your voter registration information such as name, address, photo, or date of birth.
        </p>
        <CorrectionClient />
      </main>
      <Footer />
    </>
  );
}
