"use client";

import { useSendMessage } from "@/lib/hooks/use-send-message";

const SUGGESTED_PROMPTS = [
  {
    icon: "🗳️",
    title: "How do I register to vote in India?",
    subtitle: "Registration process",
  },
  {
    icon: "📅",
    title: "When is the next Lok Sabha election?",
    subtitle: "Election timeline",
  },
  {
    icon: "📋",
    title: "What documents do I need on voting day?",
    subtitle: "Voter checklist",
  },
  {
    icon: "🔧",
    title: "How does an EVM machine work?",
    subtitle: "EVM/VVPAT guide",
  },
];

const QUICK_CHIPS = [
  "Voter ID",
  "EVM/VVPAT",
  "Model Code of Conduct",
  "Form 6",
  "NOTA",
  "Postal Ballot",
];

export function EmptyState() {
  const { sendMessage } = useSendMessage();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 lg:px-8 pb-40">
      {/* Logo & Tagline */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/5 border border-primary-fixed flex items-center justify-center">
          <span
            className="material-symbols-outlined text-primary text-[40px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            how_to_vote
          </span>
        </div>
        <h2 className="text-[32px] leading-[1.3] tracking-[-0.01em] font-semibold text-on-surface mb-2">
          How can I help you today?
        </h2>
        <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-lg">
          Ask me anything about Indian elections, voter registration, EVMs, or
          your civic rights.
        </p>
      </div>

      {/* Suggested Prompts - 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-8">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt.title}
            onClick={() => sendMessage(prompt.title)}
            className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-left hover:border-primary-fixed-dim hover:shadow-md transition-all duration-200"
          >
            <span className="text-2xl mb-2 block">{prompt.icon}</span>
            <h3 className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface group-hover:text-primary mb-1">
              {prompt.title}
            </h3>
            <p className="text-[12px] leading-[1.4] text-outline">
              {prompt.subtitle}
            </p>
          </button>
        ))}
      </div>

      {/* Quick Category Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => sendMessage(`Tell me about ${chip}`)}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface text-[12px] leading-[1.4] py-1.5 px-4 rounded-full hover:bg-surface-container hover:border-primary-fixed-dim transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
