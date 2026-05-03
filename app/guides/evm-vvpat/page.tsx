import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVMPageClient } from "./EVMPageClient";

export const metadata: Metadata = {
  title: "EVM & VVPAT Lifecycle Guide — ElectionGuide AI",
  description:
    "Understand the complete 9-stage lifecycle of Electronic Voting Machines (EVMs) and Voter Verifiable Paper Audit Trail (VVPAT) — from manufacturing to disposal. Interactive simulator included.",
};

export default function EvmVvpatGuidePage() {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <main
        id="main-content"
        className="max-w-[1200px] mx-auto px-6 pb-8 md:pb-12 pt-24"
        role="main"
      >
        <EVMPageClient />
      </main>
      <Footer />
    </>
  );
}
