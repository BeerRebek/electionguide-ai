"use client";

import { useState } from "react";
import type { Citation } from "@/lib/stores/chat-store";

interface CitationCardProps {
  citation: Citation;
  compact?: boolean;
}

const SOURCE_TYPE_CONFIG: Record<
  string,
  { icon: string; label: string; color: string }
> = {
  act: { icon: "gavel", label: "Act/Legislation", color: "text-error" },
  rule: { icon: "rule", label: "Election Rule", color: "text-tertiary" },
  manual: { icon: "menu_book", label: "ECI Manual", color: "text-primary" },
  eci: { icon: "verified", label: "ECI Official", color: "text-tertiary-fixed-dim" },
  website: { icon: "language", label: "Website", color: "text-outline" },
};

/**
 * Standalone citation card used in SourcesPanel and MessageBubble.
 * Shows source title, type badge, snippet, link, and bookmark action.
 */
export function CitationCard({ citation, compact = false }: CitationCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const config = SOURCE_TYPE_CONFIG[citation.sourceType] || SOURCE_TYPE_CONFIG.website;
  const href = citation.sourceUrl || `https://${citation.domain || "eci.gov.in"}`;

  if (compact) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1.5 bg-white border border-outline-variant rounded-lg px-2.5 py-1.5 hover:border-primary hover:shadow-sm transition-all"
      >
        <span className="text-[11px] font-bold text-primary bg-primary/10 w-5 h-5 rounded flex items-center justify-center">
          {citation.number}
        </span>
        <span className="text-[12px] text-on-surface font-medium line-clamp-1 max-w-[180px]">
          {citation.title}
        </span>
        <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-primary transition-colors">
          open_in_new
        </span>
      </a>
    );
  }

  return (
    <div className="p-3 rounded-xl bg-white border border-outline-variant hover:border-primary-fixed-dim hover:shadow-sm transition-all group relative">
      <div className="flex items-start gap-2">
        {/* Number Badge */}
        <span className="w-5 h-5 rounded bg-primary-container text-on-primary text-[10px] flex items-center justify-center font-bold mt-0.5 flex-shrink-0">
          {citation.number}
        </span>

        <div className="min-w-0 flex-1">
          {/* Title */}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h4 className="text-[13px] font-medium text-on-surface group-hover:text-primary leading-tight mb-1">
              {citation.title}
            </h4>
          </a>

          {/* Snippet */}
          <p className="text-[11px] text-outline line-clamp-2 mb-1.5">
            {citation.snippet}
          </p>

          {/* Type Badge + Domain */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-medium bg-surface-container-highest/50 px-1.5 py-0.5 rounded ${config.color}`}
            >
              <span className="material-symbols-outlined text-[10px]">
                {config.icon}
              </span>
              {config.label}
            </span>
            <span className="text-[10px] text-outline">
              {citation.domain || "eci.gov.in"}
            </span>
          </div>

          {/* Relevance Score Bar */}
          {"score" in citation &&
            typeof citation.score === "number" && (
              <div className="mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 bg-surface-container-highest rounded-full h-1">
                    <div
                      className="bg-primary rounded-full h-1 transition-all"
                      style={{
                        width: `${Math.round(citation.score * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-outline font-mono">
                    {Math.round(citation.score * 100)}%
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="p-1 text-outline hover:text-primary rounded transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
          title={bookmarked ? "Remove bookmark" : "Bookmark this source"}
        >
          <span
            className="material-symbols-outlined text-[16px]"
            style={{
              fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            bookmark
          </span>
        </button>
      </div>

      {/* View on ECI Website link */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-1 text-[11px] text-primary hover:underline font-medium opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <span className="material-symbols-outlined text-[12px]">
          open_in_new
        </span>
        View on ECI website
      </a>
    </div>
  );
}
