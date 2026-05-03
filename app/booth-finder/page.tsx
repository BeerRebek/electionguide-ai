import { Metadata } from "next";
import { BoothFinderClient } from "./BoothFinderClient";

export const metadata: Metadata = {
  title: "Find Polling Booth | ElectionGuide AI",
  description:
    "Locate your nearest polling booth with real-time wait times, accessibility info, and interactive maps.",
};

export default function BoothFinderPage() {
  return (
    <>
      <main className="min-h-screen bg-background pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BoothFinderClient />
        </div>
      </main>
    </>
  );
}
