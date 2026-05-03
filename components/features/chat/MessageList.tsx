"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { MessageBubble } from "./MessageBubble";

export function MessageList() {
  const { messages, isStreaming, streamingContent } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or streaming
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Format date for the divider
  const firstMsgDate = messages[0]
    ? new Date(messages[0].createdAt)
    : new Date();
  const timeLabel = firstMsgDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 lg:px-8 py-8 space-y-6 pb-52"
      id="chat-container"
    >
      {/* Date Divider */}
      <div className="flex justify-center">
        <span className="bg-surface-container-high text-on-surface-variant text-[12px] leading-[1.4] px-3 py-1 rounded-full shadow-sm">
          Today, {timeLabel}
        </span>
      </div>

      {/* Messages */}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Streaming Message */}
      {isStreaming && streamingContent && (
        <MessageBubble
          message={{
            id: "streaming",
            role: "assistant",
            content: streamingContent,
            createdAt: new Date().toISOString(),
          }}
          isStreaming
        />
      )}

      {/* Loading indicator when streaming but no content yet */}
      {isStreaming && !streamingContent && (
        <div className="flex items-start gap-4 max-w-[95%] lg:max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-primary-fixed flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
            <span
              className="material-symbols-outlined text-primary text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              how_to_vote
            </span>
          </div>
          <div className="flex-1">
            <div className="bg-white border border-outline-variant rounded-2xl rounded-tl-sm shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span className="text-[14px] leading-[1.4] text-outline">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
