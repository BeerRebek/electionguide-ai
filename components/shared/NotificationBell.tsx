"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// ── Types ──────────────────────────────────────────────────────────────────
interface Notification {
  id: string;
  type: "election" | "quiz" | "guide" | "booth" | "milestone" | "alert";
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  href?: string;
}

const ICON_MAP: Record<string, string> = {
  election: "how_to_vote",
  quiz: "quiz",
  guide: "menu_book",
  booth: "location_on",
  milestone: "celebration",
  alert: "warning",
};

const COLOR_MAP: Record<string, string> = {
  election: "text-primary",
  quiz: "text-secondary",
  guide: "text-tertiary",
  booth: "text-primary",
  milestone: "text-yellow-500",
  alert: "text-error",
};

// Fallback demo data for logged-out users
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "demo-1",
    type: "election",
    title: "Phase 4 Voting Tomorrow",
    body: "Polling in 96 constituencies opens at 7 AM. Have your EPIC ready.",
    time: "2h ago",
    isRead: false,
    href: "/timeline",
  },
  {
    id: "demo-2",
    type: "quiz",
    title: "Daily Quiz Challenge is Live!",
    body: "Today's question: What is the minimum age to vote in India?",
    time: "6h ago",
    isRead: false,
    href: "/quiz",
  },
  {
    id: "demo-3",
    type: "guide",
    title: "New Guide: Understanding NOTA",
    body: "A comprehensive guide on the None of the Above option has been published.",
    time: "1d ago",
    isRead: true,
    href: "/guides",
  },
];

// ── Time formatter ─────────────────────────────────────────────────────────
function relativeTime(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(isoString).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

// ── Map DB row → Notification ──────────────────────────────────────────────
interface NotificationRow {
  id: string;
  type?: string;
  title: string;
  body?: string;
  message?: string;
  created_at: string;
  is_read?: boolean;
  action_url?: string;
}
function mapRow(row: NotificationRow): Notification {
  return {
    id: row.id,
    type: row.type ?? "alert",
    title: row.title,
    body: row.body ?? row.message ?? "",
    time: relativeTime(row.created_at),
    isRead: row.is_read ?? false,
    href: row.action_url ?? undefined,
  };
}

// ── Supabase client (anon key — RLS protected) ─────────────────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function NotificationBell() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const channelRef = useRef<import("@supabase/supabase-js").RealtimeChannel | null>(null);

  // ── Load notifications from Supabase or fall back to demo ──────────────
  const loadNotifications = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setNotifs(DEMO_NOTIFICATIONS);
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsAuthed(false);
      setNotifs(DEMO_NOTIFICATIONS);
      setLoading(false);
      return;
    }

    setIsAuthed(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("id, type, title, body, message, is_read, action_url, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[NotificationBell] fetch error:", error.message);
      setNotifs(DEMO_NOTIFICATIONS);
    } else {
      setNotifs((data ?? []).map(mapRow));
    }
    setLoading(false);
  }, []);

  // ── Subscribe to realtime inserts ──────────────────────────────────────
  const subscribeRealtime = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const channel = supabase
      .channel("notification-bell")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const newNotif = mapRow(payload.new);
          setNotifs((prev) => [newNotif, ...prev.slice(0, 19)]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          setNotifs((prev) =>
            prev.map((n) => (n.id === payload.new.id ? mapRow(payload.new) : n))
          );
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications().then(() => subscribeRealtime());
    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [loadNotifications, subscribeRealtime]);

  // ── Close dropdown on outside click ───────────────────────────────────
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter((n) => !n.isRead).length;

  // ── Mark all read ──────────────────────────────────────────────────────
  const markAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));

    if (!isAuthed) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", session.user.id)
      .eq("is_read", false);
  };

  // ── Mark single read ───────────────────────────────────────────────────
  const markRead = async (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    if (!isAuthed || id.startsWith("demo-")) return;

    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
          open
            ? "bg-primary-container text-primary"
            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
        }`}
      >
        <span className="material-symbols-outlined text-xl">
          {unread > 0 ? "notifications_active" : "notifications"}
        </span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-on-error text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-[360px] bg-surface border border-outline-variant rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-down">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">
                notifications
              </span>
              Notifications
              {unread > 0 && (
                <span className="bg-error text-on-error text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {unread} new
                </span>
              )}
              {/* Live indicator when authed */}
              {isAuthed && (
                <span className="flex items-center gap-1 text-[10px] text-tertiary font-normal ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse inline-block" />
                  Live
                </span>
              )}
            </h3>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <ul className="max-h-[360px] overflow-y-auto divide-y divide-outline-variant/50">
            {loading ? (
              // Skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex gap-3 px-4 py-3 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-surface-container flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-surface-container rounded w-3/4" />
                    <div className="h-2 bg-surface-container rounded w-full" />
                    <div className="h-2 bg-surface-container rounded w-1/4" />
                  </div>
                </li>
              ))
            ) : notifs.length === 0 ? (
              <li className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 block opacity-40">
                  notifications_off
                </span>
                <p className="text-sm">No notifications yet</p>
              </li>
            ) : (
              notifs.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href ?? "#"}
                    onClick={() => {
                      markRead(n.id);
                      setOpen(false);
                    }}
                    className={`flex gap-3 px-4 py-3 hover:bg-surface-container transition-colors ${
                      !n.isRead ? "bg-primary-container/10" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 ${
                        COLOR_MAP[n.type] ?? "text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {ICON_MAP[n.type] ?? "info"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug mb-0.5 ${
                          !n.isRead
                            ? "font-semibold text-on-surface"
                            : "font-medium text-on-surface-variant"
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {n.body}
                      </p>
                      <span className="text-[10px] text-outline mt-0.5 block">
                        {n.time}
                      </span>
                    </div>

                    {/* Unread dot */}
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    )}
                  </Link>
                </li>
              ))
            )}
          </ul>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-outline-variant">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-xs text-primary font-medium hover:underline"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
