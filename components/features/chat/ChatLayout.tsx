"use client";

import { useChatStore } from "@/lib/stores/chat-store";
import { useChatPersistence } from "@/lib/hooks/use-chat-persistence";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SourcesPanel } from "./SourcesPanel";
import { EmptyState } from "./EmptyState";

export function ChatLayout() {
  // Hydrate session list + detect auth on mount
  const { hydrating, deleteSession } = useChatPersistence();
  const { messages, sidebarOpen, sourcesPanelOpen, toggleSidebar } =
    useChatStore();

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Left Sidebar */}
      <ChatSidebar onDeleteSession={deleteSession} />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen relative bg-surface min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex justify-between items-center px-4 h-16 w-full sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              how_to_vote
            </span>
            <span className="text-[18px] font-bold text-primary">
              ElectionGuide AI
            </span>
          </div>
          <button onClick={toggleSidebar} className="text-on-surface">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {/* Chat Content */}
        {hydrating ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 pb-40">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary-fixed flex items-center justify-center animate-pulse">
              <span
                className="material-symbols-outlined text-primary text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                how_to_vote
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <p className="text-[14px] text-outline">Loading conversations...</p>
            </div>
          </div>
        ) : hasMessages ? (
          <MessageList />
        ) : (
          <EmptyState />
        )}

        {/* Input Area */}
        <ChatInput />
      </main>

      {/* Right Sources Panel */}
      {sourcesPanelOpen && hasMessages && <SourcesPanel />}
    </div>
  );
}
