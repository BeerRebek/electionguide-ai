"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { EVM_LIFECYCLE_STAGES } from "@/lib/data/evm-lifecycle";
import { VoiceNarrationButton } from "@/components/ui/VoiceNarrationButton";

const COLOR_MAP: Record<string, { accent: string; bg: string; border: string }> = {
  primary: { accent: "bg-primary text-on-primary", bg: "bg-primary-container/5", border: "border-primary/30" },
  secondary: { accent: "bg-secondary text-on-secondary", bg: "bg-secondary-container/5", border: "border-secondary/30" },
  tertiary: { accent: "bg-tertiary text-on-tertiary", bg: "bg-tertiary-container/5", border: "border-tertiary/30" },
};

type ContentLevel = "bite" | "snack" | "meal";

export function LifecycleStages() {
  const [expanded, setExpanded] = useState<Record<string, ContentLevel>>({});
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  function toggleLevel(id: string) {
    setExpanded((prev) => {
      const current = prev[id] || "bite";
      if (current === "bite") return { ...prev, [id]: "snack" };
      if (current === "snack") return { ...prev, [id]: "meal" };
      return { ...prev, [id]: "bite" };
    });
  }

  const toggleBookmark = useCallback((id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-on-surface mb-2">9-Stage Lifecycle</h2>
      <p className="text-sm text-on-surface-variant mb-8">From concept to post-election disposal — every stage is supervised and auditable.</p>

      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-outline-variant hidden md:block" aria-hidden="true" />

        <div className="space-y-6" role="list" aria-label="EVM Lifecycle Stages">
          {EVM_LIFECYCLE_STAGES.map((stage) => {
            const colors = COLOR_MAP[stage.color];
            const level = expanded[stage.id] || "bite";
            const isBookmarked = bookmarked.has(stage.id);

            return (
              <article
                key={stage.id}
                className="relative flex items-start gap-4 md:gap-6"
                role="listitem"
                aria-label={`Stage ${stage.number}: ${stage.title}`}
              >
                {/* Timeline node */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-md ${colors.accent}`}
                  aria-hidden="true"
                >
                  <span className="text-sm font-bold">{stage.number}</span>
                </div>

                {/* Card */}
                <div className={`flex-1 ${colors.bg} border ${colors.border} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="p-5 md:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden="true">{stage.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-on-surface">{stage.title}</h3>
                          <p className="text-xs text-on-surface-variant">{stage.subtitle}</p>
                        </div>
                      </div>

                      {/* Bookmark button */}
                      <button
                        onClick={() => toggleBookmark(stage.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked
                            ? "text-primary bg-primary-container/20"
                            : "text-on-surface-variant hover:bg-surface-container"
                        }`}
                        aria-label={isBookmarked ? `Remove ${stage.title} from bookmarks` : `Bookmark ${stage.title}`}
                        aria-pressed={isBookmarked}
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                          bookmark
                        </span>
                      </button>
                    </div>

                    {/* BITE — always visible */}
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{stage.bite}</p>

                    {/* SNACK — expanded */}
                    {(level === "snack" || level === "meal") && (
                      <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant mb-4 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-sm text-on-surface leading-relaxed">{stage.snack}</p>
                      </div>
                    )}

                    {/* MEAL — full details */}
                    {level === "meal" && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant">
                          <p className="text-sm text-on-surface leading-relaxed">{stage.meal}</p>
                        </div>

                        {/* Authorities */}
                        <div>
                          <p className="text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Authorities</p>
                          <div className="flex flex-wrap gap-1.5">
                            {stage.authorities.map((a) => (
                              <span key={a} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container border border-outline-variant rounded-full text-[11px] text-on-surface">
                                <span className="material-symbols-outlined text-[12px]" aria-hidden="true">badge</span>
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Security */}
                        <div>
                          <p className="text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Security Protocols</p>
                          <div className="space-y-1">
                            {stage.securityProtocols.map((s, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-tertiary text-[14px] mt-0.5" aria-hidden="true">shield</span>
                                <p className="text-xs text-on-surface-variant">{s}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Legal */}
                        <div>
                          <p className="text-xs font-semibold text-on-surface uppercase tracking-wider mb-2">Legal Provisions</p>
                          <div className="space-y-1">
                            {stage.legalProvisions.map((l, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-secondary text-[14px] mt-0.5" aria-hidden="true">gavel</span>
                                <p className="text-xs text-on-surface-variant">{l}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Party */}
                        <div className="bg-secondary-container/10 border border-secondary-container/30 rounded-lg p-3">
                          <p className="text-xs font-semibold text-on-surface mb-1">Political Party Involvement</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed">{stage.partyInvolvement}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions row */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {/* Expand button */}
                      <button
                        onClick={() => toggleLevel(stage.id)}
                        className="flex items-center gap-1.5 text-primary text-sm font-medium hover:text-primary-container transition-colors"
                        aria-expanded={level !== "bite"}
                        aria-label={level === "bite" ? `Read more about ${stage.title}` : level === "snack" ? `Show full details of ${stage.title}` : `Show less about ${stage.title}`}
                      >
                        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                          {level === "meal" ? "expand_less" : "expand_more"}
                        </span>
                        {level === "bite" ? "Read More" : level === "snack" ? "Full Details" : "Show Less"}
                      </button>

                      {/* Voice narration */}
                      <VoiceNarrationButton
                        text={`Stage ${stage.number}: ${stage.title}. ${level === "bite" ? stage.bite : level === "snack" ? stage.snack : stage.meal}`}
                        label="Listen"
                      />

                      {/* Ask AI about this stage */}
                      <Link
                        href={`/chat?q=Explain%20${encodeURIComponent(stage.title)}%20stage%20of%20EVM%20lifecycle`}
                        className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors px-2 py-1 rounded hover:bg-surface-container"
                        aria-label={`Ask AI about ${stage.title}`}
                      >
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">smart_toy</span>
                        Ask AI
                      </Link>

                      {/* Cross-reference to timeline */}
                      {stage.number <= 6 && (
                        <Link
                          href="/timeline"
                          className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors px-2 py-1 rounded hover:bg-surface-container"
                          aria-label={`View ${stage.title} in election timeline`}
                        >
                          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">timeline</span>
                          Timeline
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
