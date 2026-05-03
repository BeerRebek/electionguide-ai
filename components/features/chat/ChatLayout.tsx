"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useChatStore } from "@/lib/stores/chat-store";
import { useChatPersistence } from "@/lib/hooks/use-chat-persistence";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SourcesPanel } from "./SourcesPanel";
import { EmptyState } from "./EmptyState";

const NAV_LINKS = [
  { label: "Timeline", href: "/timeline" },
  { label: "Guides", href: "/guides" },
  { label: "Quizzes", href: "/quiz" },
  { label: "Dashboard", href: "/dashboard" },
];

export function ChatLayout() {
  const { hydrating, deleteSession } = useChatPersistence();
  const { messages, sidebarOpen, sourcesPanelOpen, toggleSidebar } =
    useChatStore();

  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface">
      {/* ── Global Chat Navbar ── */}
      <header className="flex items-center justify-between px-4 lg:px-6 h-16 shrink-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-outline-variant shadow-sm">
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors"
            aria-label="Toggle conversation history"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-primary font-semibold text-[18px] leading-none"
          >
            <span
              className="material-symbols-outlined text-[26px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              how_to_vote
            </span>
            <span className="hidden sm:block">ElectionGuide AI</span>
          </Link>
        </div>

        {/* Centre: nav links (desktop only) */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-[14px] font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: new chat + user avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => useChatStore.getState().clearMessages()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
            aria-label="Start new chat"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            New chat
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-semibold text-[15px] flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-expanded={userMenuOpen}
                aria-label="User menu"
              >
                {initials}
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-11 z-50 w-52 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1 text-[14px]">
                    <div className="px-4 py-2 border-b border-outline-variant">
                      <p className="font-medium text-on-surface truncate">{displayName}</p>
                      <p className="text-outline text-[12px] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-surface-container-low text-on-surface-variant transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">dashboard</span>
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-surface-container-low text-on-surface-variant transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-error-container/30 text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="px-4 py-2 rounded-lg text-[14px] font-medium bg-primary-container text-on-primary hover:bg-primary-container/90 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* ── Body: sidebar + chat ── */}
      <div className="flex flex-1 overflow-hidden">
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
        <main className="flex-1 flex flex-col relative bg-surface min-w-0 overflow-hidden">
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
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <p className="text-[14px] text-outline">Loading conversations...</p>
              </div>
            </div>
          ) : hasMessages ? (
            <MessageList />
          ) : (
            <EmptyState />
          )}

          <ChatInput />
        </main>

        {/* Right Sources Panel */}
        {sourcesPanelOpen && hasMessages && <SourcesPanel />}
      </div>
    </div>
  );
}
