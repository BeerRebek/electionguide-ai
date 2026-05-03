"use client";

import Link from "next/link";

const COMPONENTS = [
  {
    title: "Control Unit (CU)",
    description:
      'The "brain" of the system, operated by the Polling Officer. It securely stores the votes and controls the Ballot Unit.',
    features: [
      "Independent power source (battery)",
      "Stores up to 3840 votes securely",
      "One-time programmable chip (OTP)",
      "No wireless connectivity",
    ],
    icon: "developer_board",
    color: "bg-primary/10",
    legalRef: "Section 61A, Representation of the People Act, 1951",
    chatQuery: "Explain the Control Unit of India's EVM and its security features",
  },
  {
    title: "Ballot Unit (BU)",
    description:
      "The interface used by the voter to cast their choice. Kept inside the voting compartment for absolute privacy.",
    features: [
      "16 candidate buttons per unit",
      "Includes Braille signage for accessibility",
      "Blue buttons for easy identification",
      "Linked to CU via 5m cable",
    ],
    icon: "how_to_vote",
    color: "bg-secondary/10",
    legalRef: "Section 61A, Rule 49A-49B, Conduct of Elections Rules",
    chatQuery: "How does the Ballot Unit work in Indian EVMs",
  },
  {
    title: "VVPAT",
    description:
      "Provides visual verification to the voter that their vote was recorded as intended via a printed paper slip.",
    features: [
      "Displays printed slip for exactly 7 seconds",
      "Slips securely fall into a sealed drop box",
      "Independent verification mechanism",
      "Mandatory since 2019 general elections",
    ],
    icon: "receipt_long",
    color: "bg-tertiary/10",
    legalRef: "Rule 49MA, Conduct of Elections Rules (VVPAT)",
    chatQuery: "What is VVPAT and how does it ensure vote verification in India",
  },
];

export function ComponentExplorer() {
  return (
    <section className="space-y-8" aria-label="EVM System Components">
      <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
        <h2 className="text-[32px] font-semibold text-on-surface leading-[1.3] tracking-[-0.01em]">
          System Components
        </h2>
        <span className="bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded text-xs font-medium">
          Interactive Diagram
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" role="list">
        {COMPONENTS.map((comp) => (
          <div
            key={comp.title}
            className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative group"
            role="listitem"
          >
            {/* Touch indicator */}
            <div className="absolute top-4 right-4 text-primary bg-primary-fixed p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
              <span className="material-symbols-outlined text-[18px]">touch_app</span>
            </div>

            {/* Icon placeholder (matching Stitch image area) */}
            <div
              className={`w-full h-48 ${comp.color} rounded-lg mb-6 border border-surface-container flex items-center justify-center`}
              role="img"
              aria-label={`Illustration of ${comp.title}`}
            >
              <span className="material-symbols-outlined text-[64px] text-primary/40" aria-hidden="true">
                {comp.icon}
              </span>
            </div>

            <h3 className="text-2xl font-semibold text-on-surface mb-2 leading-snug">
              {comp.title}
            </h3>
            <p className="text-base text-on-surface-variant mb-4 leading-relaxed">
              {comp.description}
            </p>

            <ul className="space-y-2 text-xs text-on-surface-variant mb-4" aria-label={`Features of ${comp.title}`}>
              {comp.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-tertiary flex-shrink-0 mt-0.5" aria-hidden="true">
                    check_circle
                  </span>
                  {feat}
                </li>
              ))}
            </ul>

            {/* Legal reference + Ask AI */}
            <div className="pt-3 border-t border-outline-variant space-y-2">
              <div className="flex items-start gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[14px] mt-0.5" aria-hidden="true">gavel</span>
                <span>{comp.legalRef}</span>
              </div>
              <Link
                href={`/chat?q=${encodeURIComponent(comp.chatQuery)}`}
                className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:text-primary-container transition-colors"
                aria-label={`Ask AI about ${comp.title}`}
              >
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">smart_toy</span>
                Ask AI about this
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
