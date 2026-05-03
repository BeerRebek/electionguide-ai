"use client";

import { useChatStore } from "@/lib/stores/chat-store";
import { useSendMessage } from "@/lib/hooks/use-send-message";
import { CitationCard } from "./CitationCard";

const FOLLOW_UP_SUGGESTIONS = [
  "How do I file a complaint with ECI?",
  "What is NOTA and how does it work?",
  "Explain the Model Code of Conduct",
];

export function SourcesPanel() {
  const { messages, ragCitations } = useChatStore();
  const { sendMessage } = useSendMessage();

  // Use RAG citations if available, otherwise extract from latest message
  const latestAI = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const citations =
    ragCitations.length > 0
      ? ragCitations
      : latestAI?.citations || [];

  return (
    <aside className="hidden xl:flex flex-col h-screen sticky right-0 top-0 py-6 px-4 w-[300px] border-l border-outline-variant bg-[#f8f9ff] flex-shrink-0 overflow-y-auto">
      {/* Cited Sources */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-2">
          <span className="material-symbols-outlined text-outline">
            library_books
          </span>
          <h3 className="text-[14px] leading-[1.4] tracking-[0.01em] font-semibold text-on-surface uppercase tracking-wide">
            Cited Sources
          </h3>
          {citations.length > 0 && (
            <span className="ml-auto bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
              {citations.length}
            </span>
          )}
        </div>
        <div className="space-y-3">
          {citations.length > 0 ? (
            citations.map((cite) => (
              <CitationCard key={cite.number} citation={cite} />
            ))
          ) : (
            <div className="p-4 text-center">
              <span className="material-symbols-outlined text-outline text-[32px] mb-2">
                library_books
              </span>
              <p className="text-[12px] leading-[1.4] text-outline">
                Sources will appear here when you ask a question
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Guides */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-2">
          <span className="material-symbols-outlined text-outline">map</span>
          <h3 className="text-[14px] leading-[1.4] tracking-[0.01em] font-semibold text-on-surface uppercase tracking-wide">
            Related Guides
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3 items-center group cursor-pointer p-2 hover:bg-surface-container rounded-lg transition-colors">
            <div className="w-14 h-14 rounded-md bg-primary-fixed flex items-center justify-center border border-outline-variant flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[24px]">
                how_to_reg
              </span>
            </div>
            <div>
              <h4 className="text-[14px] leading-[1.4] font-medium text-on-surface group-hover:text-primary">
                Voter Registration Guide
              </h4>
              <p className="text-[11px] text-outline">5 min read</p>
            </div>
          </div>
          <div className="flex gap-3 items-center group cursor-pointer p-2 hover:bg-surface-container rounded-lg transition-colors">
            <div className="w-14 h-14 rounded-md bg-tertiary-fixed flex items-center justify-center border border-outline-variant flex-shrink-0">
              <span className="material-symbols-outlined text-tertiary text-[24px]">
                how_to_vote
              </span>
            </div>
            <div>
              <h4 className="text-[14px] leading-[1.4] font-medium text-on-surface group-hover:text-primary">
                Understanding EVMs &amp; VVPATs
              </h4>
              <p className="text-[11px] text-outline">3 min read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-2">
          <span className="material-symbols-outlined text-outline">
            quick_reference_all
          </span>
          <h3 className="text-[14px] leading-[1.4] tracking-[0.01em] font-semibold text-on-surface uppercase tracking-wide">
            Suggested Follow-ups
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {FOLLOW_UP_SUGGESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="bg-white border border-outline-variant text-on-surface text-[12px] leading-[1.4] py-1.5 px-3 rounded-full hover:bg-surface-container hover:border-primary-fixed-dim transition-colors text-left flex items-center gap-1 group"
            >
              <span className="material-symbols-outlined text-[14px] text-primary group-hover:scale-110 transition-transform">
                add_circle
              </span>
              {q}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
