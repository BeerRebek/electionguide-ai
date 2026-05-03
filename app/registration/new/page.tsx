import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import NewRegistrationClient from "./NewRegistrationClient";

export const metadata: Metadata = {
  title: "New Voter Registration (Form 6) — ElectionGuide AI",
  description: "Apply for fresh voter registration using Form 6.",
};

export default function NewRegistrationPage() {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="max-w-[720px] mx-auto px-6 pb-8 md:pb-12 pt-24" role="main">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/registration" className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Registration
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-2 leading-tight">New Voter Registration</h1>
        <p className="text-on-surface-variant mb-6">Complete Form 6 to enroll on the electoral roll of your constituency.</p>
        <NewRegistrationClient />
      </main>
      <Footer />
    </>
  );
}
