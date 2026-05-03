import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import { QuickVoterSearch } from "./QuickVoterSearch";

export const metadata: Metadata = {
  title: "Voter Registration — ElectionGuide AI",
  description: "Check your voter registration status and complete the registration wizard step-by-step.",
};

export default function RegistrationPage() {
  return (
    <>
      <SkipToContent />
      <main id="main-content" className="max-w-[800px] mx-auto px-6 pb-8 md:pb-12 pt-6" role="main">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3 leading-tight">Voter Registration</h1>
          <p className="text-lg text-on-surface-variant">Check your eligibility and complete your voter registration</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/registration/eligibility"
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-all group text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">how_to_reg</span>
            </div>
            <h2 className="text-xl font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">Check Eligibility</h2>
            <p className="text-sm text-on-surface-variant">Verify if you are eligible to vote in the upcoming elections</p>
          </Link>

          <Link
            href="/registration/new"
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-all group text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">person_add</span>
            </div>
            <h2 className="text-xl font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">New Registration</h2>
            <p className="text-sm text-on-surface-variant">Register as a first-time voter with Form 6</p>
          </Link>

          <Link
            href="/registration/status"
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-all group text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">fact_check</span>
            </div>
            <h2 className="text-xl font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">Check Status</h2>
            <p className="text-sm text-on-surface-variant">Track the status of your pending registration application</p>
          </Link>

          <Link
            href="/registration/correction"
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-all group text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">edit_note</span>
            </div>
            <h2 className="text-xl font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">Corrections</h2>
            <p className="text-sm text-on-surface-variant">Update your name, address, or other details using Form 8</p>
          </Link>
        </div>

        {/* Quick Check */}
        <QuickVoterSearch />
      </main>
      <Footer />
    </>
  );
}
