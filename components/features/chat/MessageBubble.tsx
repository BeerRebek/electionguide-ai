"use client";

import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage, Citation } from "@/lib/stores/chat-store";
import { useChatStore } from "@/lib/stores/chat-store";
import { saveFeedback } from "@/lib/supabase/feedback";
import { VoiceOutput } from "./VoiceOutput";
import { ChatExport } from "./ChatExport";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const [showMeal, setShowMeal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);
  const { ragCitations, currentLanguage } = useChatStore();
  const citations = message.citations?.length ? message.citations : ragCitations;

  const handleFeedback = useCallback(async (rating: "positive" | "negative") => {
    const newRating = feedback === rating ? null : rating;
    setFeedback(newRating);
    if (newRating) {
      await saveFeedback(message.id, newRating);
    }
  }, [feedback, message.id]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, [message.content, message.id]);

  // ── User Message ──────────────────────────────────────────
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] lg:max-w-[70%] space-y-2">
          <div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm text-[16px] leading-[1.6]">
            {message.content}
          </div>
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-col items-end gap-2">
              <MessageAttachments attachments={message.attachments} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── AI Message ────────────────────────────────────────────
  // Parse Bite-Snack-Meal structure
  const { bite, snack, meal, legalRefs, sources } = parseBiteSnackMeal(
    message.content
  );

  const confidence = message.confidence || "high";
  const sourceCount = message.sourceCount || 1;

  return (
    <div className="flex items-start gap-4 max-w-[95%] lg:max-w-[85%]">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-primary-fixed flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
        <span
          className="material-symbols-outlined text-primary text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          how_to_vote
        </span>
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        <div className="bg-white border border-outline-variant rounded-2xl rounded-tl-sm shadow-sm overflow-hidden">
          {/* Confidence Header */}
          <div className="bg-surface-container flex items-center gap-2 px-4 py-2 border-b border-outline-variant">
            <span
              className={`material-symbols-outlined text-sm ${
                confidence === "high"
                  ? "text-tertiary-fixed-dim"
                  : confidence === "medium"
                  ? "text-secondary-container"
                  : "text-outline"
              }`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="text-[12px] leading-[1.4] text-on-surface-variant font-medium">
              {confidence === "high" ? "High" : confidence === "medium" ? "Medium" : "Low"}{" "}
              Confidence • Based on {sourceCount} official{" "}
              {sourceCount === 1 ? "source" : "sources"}
            </span>
          </div>

          {/* Message Content */}
          <div className="p-5 text-[16px] leading-[1.6] text-on-surface">
            {bite ? (
              <>
                {/* BITE - Always visible */}
                <div className="mb-4">
                  <MarkdownContent content={bite} />
                </div>

                {/* SNACK - Collapsible */}
                {snack && (
                  <div className="mb-4">
                    <MarkdownContent content={snack} />
                  </div>
                )}

                {/* MEAL - Expandable */}
                {meal && (
                  <div>
                    {!showMeal && (
                      <button
                        onClick={() => setShowMeal(true)}
                        className="text-[14px] leading-[1.4] text-primary hover:text-primary-container font-medium flex items-center gap-1 mb-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          expand_more
                        </span>
                        Show full explanation
                      </button>
                    )}
                    {showMeal && (
                      <div className="border-t border-outline-variant pt-4 mt-2 animate-in slide-in-from-top-2">
                        <MarkdownContent content={meal} />

                        {legalRefs && (
                          <div className="mt-4 p-4 bg-surface-variant rounded-lg border border-outline-variant">
                            <MarkdownContent content={legalRefs} />
                          </div>
                        )}

                        {sources && (
                          <div className="mt-3">
                            <MarkdownContent content={sources} citations={citations} />
                          </div>
                        )}

                        <button
                          onClick={() => setShowMeal(false)}
                          className="text-[14px] leading-[1.4] text-primary hover:text-primary-container font-medium flex items-center gap-1 mt-2 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            expand_less
                          </span>
                          Show less
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Unstructured response / streaming
              <div>
                <MarkdownContent content={message.content} citations={citations} />
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-4">
                    <MessageAttachments attachments={message.attachments} />
                  </div>
                )}
                {isStreaming && (
                  <span className="inline-block w-[2px] h-5 bg-primary ml-1 animate-pulse" />
                )}
              </div>
            )}
          </div>

          {/* Inline Citations Footer */}
          {!isStreaming && citations.length > 0 && (
            <div className="px-4 py-3 border-t border-outline-variant bg-[#f8f9ff]">
              <p className="text-[11px] font-semibold text-outline uppercase tracking-wider mb-2">Sources cited</p>
              <div className="flex flex-wrap gap-2">
                {citations.slice(0, 5).map((c, i) => (
                  <a
                    key={c.id || i}
                    href={c.sourceUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 bg-white border border-outline-variant rounded-lg px-2.5 py-1.5 hover:border-primary hover:shadow-sm transition-all"
                  >
                    <span className="text-[11px] font-bold text-primary bg-primary/10 w-5 h-5 rounded flex items-center justify-center">
                      {c.number || i + 1}
                    </span>
                    <span className="text-[12px] text-on-surface font-medium line-clamp-1 max-w-[180px]">
                      {c.title}
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-primary transition-colors">
                      open_in_new
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          {!isStreaming && (
            <div className="px-4 py-2 border-t border-outline-variant bg-[#f8f9ff] flex justify-between items-center">
              <div className="flex gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded transition-colors"
                  title="Copy"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copiedId === message.id ? "check" : "content_copy"}
                  </span>
                </button>
                <button
                  className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded transition-colors"
                  title="Regenerate"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    refresh
                  </span>
                </button>
                <VoiceOutput text={message.content} language={currentLanguage} />
                <div className="w-px h-4 bg-outline-variant mx-1 self-center" />
                <button
                  onClick={() => handleFeedback("positive")}
                  className={`p-1.5 rounded transition-colors ${
                    feedback === "positive"
                      ? "text-tertiary-fixed-dim bg-tertiary-container/30"
                      : "text-outline hover:text-on-surface hover:bg-surface-container"
                  }`}
                  title="Helpful"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={feedback === "positive" ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    thumb_up
                  </span>
                </button>
                <button
                  onClick={() => handleFeedback("negative")}
                  className={`p-1.5 rounded transition-colors ${
                    feedback === "negative"
                      ? "text-error bg-error-container/30"
                      : "text-outline hover:text-on-surface hover:bg-surface-container"
                  }`}
                  title="Not Helpful"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={feedback === "negative" ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    thumb_down
                  </span>
                </button>
              </div>
              <div className="flex gap-1">
                <ChatExport />
                <button
                  className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded transition-colors"
                  title="Share"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    share
                  </span>
                </button>
                <button
                  className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded transition-colors"
                  title="Bookmark"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    bookmark_border
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Citation Tooltip ──────────────────────────────────────
function CitationChip({ number, citation }: { number: number; citation?: Citation }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const chipRef = useRef<HTMLSpanElement>(null);

  const typeLabel: Record<string, string> = {
    act: "📜 Legislation",
    rule: "📋 Rule",
    manual: "📖 Manual",
    eci: "🏛️ ECI Official",
    website: "🌐 Website",
  };

  return (
    <span className="relative inline-block" ref={chipRef}>
      <span
        className="inline-flex items-center justify-center w-[18px] h-[18px] rounded bg-primary/15 text-primary text-[11px] font-bold cursor-pointer hover:bg-primary/25 transition-colors align-middle mx-0.5"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => {
          if (citation?.sourceUrl) window.open(citation.sourceUrl, "_blank");
        }}
      >
        {number}
      </span>
      {showTooltip && citation && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[260px] bg-white border border-outline-variant rounded-xl shadow-lg p-3 z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150">
          <p className="text-[13px] font-semibold text-on-surface line-clamp-2 mb-1">{citation.title}</p>
          <span className="text-[10px] text-outline">{typeLabel[citation.sourceType || ""] || "📄 Reference"}</span>
          {citation.snippet && (
            <p className="text-[11px] text-on-surface-variant mt-1.5 line-clamp-2 leading-[1.4]">{citation.snippet}</p>
          )}
          {citation.sourceUrl && (
            <p className="text-[10px] text-primary mt-1.5 truncate">{citation.domain || citation.sourceUrl}</p>
          )}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white border-r border-b border-outline-variant rotate-45" />
        </div>
      )}
    </span>
  );
}

// ── Markdown Renderer ─────────────────────────────────────
function MarkdownContent({ content, citations = [] }: { content: string; citations?: Citation[] }) {
  // Transform [Source N] patterns into citation chip placeholders
  const processText = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\[Source \d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[Source (\d+)\]/);
      if (match) {
        const num = parseInt(match[1], 10);
        const citation = citations.find((c) => c.number === num);
        return <CitationChip key={i} number={num} citation={citation} />;
      }
      return part;
    });
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => {
          const processed = processChildren(children, processText);
          return <p className="mb-3 last:mb-0">{processed}</p>;
        },
        strong: ({ children }) => (
          <strong className="font-semibold text-on-surface">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-on-surface-variant">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 space-y-1 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 space-y-1 mb-4">{children}</ol>
        ),
        li: ({ children }) => {
          const processed = processChildren(children, processText);
          return <li className="text-on-surface">{processed}</li>;
        },
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-primary-container underline hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="bg-surface-variant px-1.5 py-0.5 rounded text-[13px] font-mono text-on-surface">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-surface-variant p-4 rounded-lg font-mono text-[12px] text-on-surface overflow-x-auto my-3 border border-outline-variant">
            {children}
          </pre>
        ),
        h2: ({ children }) => (
          <h2 className="text-[18px] font-semibold text-on-surface mt-4 mb-2">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[16px] font-semibold text-on-surface mt-3 mb-1">
            {children}
          </h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary-fixed-dim pl-4 my-3 text-on-surface-variant italic">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// Helper: walk React children, transform string nodes with [Source N]
function processChildren(
  children: React.ReactNode,
  processText: (text: string) => React.ReactNode[]
): React.ReactNode {
  if (typeof children === "string") {
    return <>{processText(children)}</>;
  }
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      typeof child === "string" ? <span key={i}>{processText(child)}</span> : child
    );
  }
  return children;
}

// ── Bite-Snack-Meal Parser ────────────────────────────────
function parseBiteSnackMeal(text: string) {
  const biteMatch = text.match(
    /🍿\s*\*{0,2}Quick Answer\*{0,2}:?\s*([\s\S]*?)(?=🥪|$)/
  );
  const snackMatch = text.match(
    /🥪\s*\*{0,2}Key Details\*{0,2}:?\s*([\s\S]*?)(?=🍽️|$)/
  );
  const mealMatch = text.match(
    /🍽️\s*\*{0,2}Full Explanation\*{0,2}:?\s*([\s\S]*?)(?=📚|$)/
  );
  const legalMatch = text.match(
    /📚\s*\*{0,2}Legal References\*{0,2}:?\s*([\s\S]*?)(?=🔗|$)/
  );
  const sourcesMatch = text.match(/🔗\s*\*{0,2}Sources\*{0,2}:?\s*([\s\S]*)/);

  return {
    bite: biteMatch?.[1]?.trim() || null,
    snack: snackMatch?.[1]?.trim() || null,
    meal: mealMatch?.[1]?.trim() || null,
    legalRefs: legalMatch?.[1]?.trim() || null,
    sources: sourcesMatch?.[1]?.trim() || null,
  };
}

function MessageAttachments({ attachments }: { attachments: NonNullable<ChatMessage["attachments"]> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((file, i) => {
        const isImage = file.type.startsWith("image/");
        return (
          <a
            key={i}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 bg-white border border-outline-variant rounded-xl p-2 hover:border-primary hover:shadow-md transition-all max-w-[240px]"
          >
            {isImage ? (
              <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-outline text-[24px]">
                  description
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-[13px] font-medium text-on-surface truncate">
                {file.name}
              </p>
              <p className="text-[11px] text-outline">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[16px] text-primary">
                download
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
