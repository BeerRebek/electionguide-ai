import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import StatusClient from "./StatusClient";

export const metadata: Metadata = {
  title: "Registration Status — ElectionGuide AI",
  description: "Check if your name is on the electoral roll.",
};

export default function StatusPage() {
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
        <h1 className="text-3xl font-bold text-on-surface mb-2 leading-tight">Check Registration Status</h1>
        <p className="text-on-surface-variant mb-6">Verify if your name is on the electoral roll and find your polling booth.</p>
        <StatusClient />
      </main>
      <Footer />
    </>
  );
}
