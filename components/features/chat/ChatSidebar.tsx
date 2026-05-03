"use client";

import { useState } from "react";
import { useChatStore } from "@/lib/stores/chat-store";

interface ChatSidebarProps {
  onDeleteSession?: (sessionId: string) => void;
}

export function ChatSidebar({ onDeleteSession }: ChatSidebarProps) {
  const {
    sessions,
    currentSessionId,
    setCurrentSession,
    sidebarOpen,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    newChat,
    isAuthenticated,
    usage,
  } = useChatStore();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Group sessions by time
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const grouped: Record<string, typeof sessions> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Older: [],
  };

  // Filter by search query
  const filtered = searchQuery
    ? sessions.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sessions;

  filtered.forEach((s) => {
    const d = new Date(s.updatedAt).toDateString();
    if (d === todayStr) grouped["Today"].push(s);
    else if (d === yesterdayStr) grouped["Yesterday"].push(s);
    else {
      const diff =
        (now.getTime() - new Date(s.updatedAt).getTime()) / 86400000;
      if (diff <= 7) grouped["Previous 7 Days"].push(s);
      else grouped["Older"].push(s);
    }
  });

  const filteredGroups = Object.entries(grouped).filter(
    ([, items]) => items.length > 0
  );

  // Demo sessions when no real data
  const demoGroups =
    filteredGroups.length === 0 && !searchQuery
      ? [
          {
            label: "Today",
            items: [
              { id: "demo-1", title: "Voter ID requirements", time: "2:30 PM" },
              { id: "demo-2", title: "EVM working process", time: "10:15 AM" },
            ],
          },
          {
            label: "Yesterday",
            items: [
              { id: "demo-3", title: "Polling booth location", time: "Yesterday" },
            ],
          },
          {
            label: "Previous 7 Days",
            items: [
              { id: "demo-4", title: "How to register online", time: "Apr 24" },
              { id: "demo-5", title: "VVPAT verification", time: "Apr 22" },
            ],
          },
        ]
      : null;

  const handleDelete = (sessionId: string) => {
    if (confirmDeleteId === sessionId) {
      onDeleteSession?.(sessionId);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(sessionId);
      // Auto-cancel after 3s
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  return (
    <nav
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative z-50 lg:z-auto flex flex-col h-screen py-6 px-4 w-[280px] border-r border-outline-variant bg-[#f8fafc] flex-shrink-0 transition-transform duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <span
          className="material-symbols-outlined text-primary text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          how_to_vote
        </span>
        <div>
          <h1 className="text-xl font-black text-primary tracking-tight">
            ElectionGuide AI
          </h1>
          <p className="text-[12px] leading-[1.4] text-outline">
            Civic Intelligence
          </p>
        </div>
      </div>

      {/* New Chat */}
      <button
        onClick={() => {
          newChat();
          if (window.innerWidth < 1024) toggleSidebar();
        }}
        className="w-full bg-primary text-on-primary text-[14px] leading-[1.4] tracking-[0.01em] font-medium py-3 px-4 rounded-full flex items-center justify-center gap-2 mb-6 hover:bg-primary-container transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined">add</span>
        New Chat
      </button>

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
          search
        </span>
        <input
          className="w-full bg-surface-container-high border-none rounded-full py-2.5 pl-9 pr-4 text-[16px] leading-[1.6] text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
          placeholder="Search conversations..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
        {demoGroups
          ? demoGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-[12px] font-medium text-outline px-3 mb-2 uppercase tracking-wider">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentSession(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[14px] leading-[1.4] font-medium flex flex-col transition-all duration-200 group ${
                        currentSessionId === item.id
                          ? "bg-white text-primary border border-outline-variant shadow-sm"
                          : "text-[#475569] hover:bg-[#e2e8f0]"
                      }`}
                    >
                      <span className="font-medium truncate w-full">
                        {item.title}
                      </span>
                      <span className="text-[12px] leading-[1.4] text-outline">
                        {item.time}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          : filteredGroups.map(([label, items]) => (
              <div key={label}>
                <h3 className="text-[12px] leading-[1.4] font-medium text-outline px-3 mb-2 uppercase tracking-wider">
                  {label}
                </h3>
                <div className="space-y-1">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[14px] leading-[1.4] font-medium flex items-center gap-1 transition-all duration-200 group ${
                        currentSessionId === s.id
                          ? "bg-white text-primary border border-outline-variant shadow-sm"
                          : "text-[#475569] hover:bg-[#e2e8f0]"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setCurrentSession(s.id);
                          if (window.innerWidth < 1024) toggleSidebar();
                        }}
                        className="flex-1 min-w-0 flex flex-col text-left"
                      >
                        <span className="font-medium truncate w-full">
                          {s.title}
                        </span>
                        <span className="text-[12px] leading-[1.4] text-outline">
                          {new Date(s.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(s.id);
                        }}
                        className={`p-1 rounded transition-all flex-shrink-0 ${
                          confirmDeleteId === s.id
                            ? "text-error bg-error-container"
                            : "text-outline opacity-0 group-hover:opacity-100 hover:text-error hover:bg-error-container/30"
                        }`}
                        title={
                          confirmDeleteId === s.id
                            ? "Click again to confirm delete"
                            : "Delete conversation"
                        }
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {confirmDeleteId === s.id ? "delete_forever" : "delete"}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

        {/* Empty search state */}
        {searchQuery && filteredGroups.length === 0 && (
          <div className="text-center py-8 px-4">
            <span className="material-symbols-outlined text-outline text-[28px] mb-2">
              search_off
            </span>
            <p className="text-[13px] text-outline">
              No conversations matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Token Usage Bar (Feature 5) */}
      {usage.totalRequests > 0 && (
        <div className="mt-4 pt-3 border-t border-outline-variant">
          <div className="flex items-center gap-1.5 px-2 mb-1.5">
            <span className="material-symbols-outlined text-[14px] text-outline">
              monitoring
            </span>
            <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
              Session Usage
            </span>
          </div>
          <div className="bg-surface-container rounded-lg px-3 py-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-primary">
                  arrow_upward
                </span>
                Input
              </span>
              <span className="text-[11px] font-mono text-on-surface font-medium">
                {formatTokens(usage.totalInputTokens)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-tertiary">
                  arrow_downward
                </span>
                Output
              </span>
              <span className="text-[11px] font-mono text-on-surface font-medium">
                {formatTokens(usage.totalOutputTokens)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-outline-variant">
              <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-secondary">
                  request_quote
                </span>
                Est. Cost
              </span>
              <span className="text-[11px] font-mono text-on-surface font-medium">
                ${usage.estimatedCostUSD.toFixed(4)}
              </span>
            </div>
            <p className="text-[9px] text-outline text-center pt-0.5">
              {usage.totalRequests} request{usage.totalRequests !== 1 ? "s" : ""} • Gemini 2.5 Flash
            </p>
          </div>
        </div>
      )}

      {/* Bottom: Quick Links */}
      <div className="mt-4 pt-4 border-t border-outline-variant space-y-1">
        <button className="w-full text-left px-3 py-2 rounded-lg text-[#475569] hover:bg-[#e2e8f0] text-[14px] leading-[1.4] font-medium flex items-center gap-3 transition-all">
          <span className="material-symbols-outlined text-lg">
            verified_user
          </span>
          Fact Check
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg text-[#475569] hover:bg-[#e2e8f0] text-[14px] leading-[1.4] font-medium flex items-center gap-3 transition-all">
          <span className="material-symbols-outlined text-lg">info</span>
          Voting Info
        </button>
      </div>

      {/* User Profile */}
      <div className="mt-4 pt-4 border-t border-outline-variant flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-semibold text-sm">
          {isAuthenticated ? "U" : "G"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] leading-[1.4] font-semibold text-on-surface truncate">
            {isAuthenticated ? "Voter" : "Guest"}
          </p>
          <p className="text-[12px] leading-[1.4] text-outline truncate">
            {isAuthenticated ? "Free Plan" : "Sign in to save chats"}
          </p>
        </div>
        <button className="text-outline hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </nav>
  );
}

// ── Helper ────────────────────────────────────────────────────
function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
