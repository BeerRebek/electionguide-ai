"use client";

import Link from "next/link";

interface EVMHeroProps {
  activeSection?: string;
  onTrySimulator?: () => void;
}

export function EVMHero({ activeSection, onTrySimulator }: EVMHeroProps) {
  return (
    <section className="relative rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/30 p-8 md:p-12 min-h-[400px] flex items-center">
      {/* Abstract background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-surface-container-low" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/90 to-transparent z-0" />

      <div className="relative z-10 w-full md:w-2/3 space-y-6">
        <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-sm font-medium">
          <span className="material-symbols-outlined text-[16px]">info</span>
          Deep Dive Guide
        </div>

        <h1 className="text-4xl md:text-[40px] font-bold text-on-surface leading-[1.2] tracking-[-0.02em]">
          How EVM & VVPAT Work
        </h1>

        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          A comprehensive look at the technology ensuring every vote is recorded securely,
          verifiably, and accurately. Explore the Control Unit, Ballot Unit, and Voter
          Verifiable Paper Audit Trail.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          {/* Show "Try the EVM Simulator" only on the simulator tab */}
          {activeSection === "simulator" ? (
            <button
              onClick={() => {
                const el = document.getElementById("evm-simulator-content");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-container transition-colors min-h-[48px] shadow-sm"
            >
              <span className="material-symbols-outlined">play_circle</span>
              Try the EVM Simulator
            </button>
          ) : (
            <button
              onClick={() => onTrySimulator?.()}
              className="bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-container transition-colors min-h-[48px] shadow-sm"
            >
              <span className="material-symbols-outlined">play_circle</span>
              Explore This Section
            </button>
          )}
          <Link
            href="/chat?q=Explain%20EVM%20and%20VVPAT%20technology%20in%20Indian%20elections"
            className="bg-transparent text-primary border border-primary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-container transition-colors min-h-[48px]"
          >
            <span className="material-symbols-outlined">smart_toy</span>
            Ask AI Assistant
          </Link>
        </div>
      </div>
    </section>
  );
}
