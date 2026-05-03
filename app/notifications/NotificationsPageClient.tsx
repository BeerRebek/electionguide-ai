"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotifications,
  subscribeToNotifications,
  toDisplayType,
  type DBNotification,
} from "@/lib/supabase/notifications";

// ── Display Types ──────────────────────────────────────────────────────────
type DisplayType = "election" | "quiz" | "guide" | "booth" | "milestone" | "alert";

interface DisplayNotification {
  id: string;
  type: DisplayType;
  title: string;
  body: string;
  time: string;
  fullDate: string;
  isRead: boolean;
  href?: string;
}

const ICON_MAP: Record<DisplayType, string> = {
  election: "how_to_vote",
  quiz: "quiz",
  guide: "menu_book",
  booth: "location_on",
  milestone: "celebration",
  alert: "warning",
};

const COLOR_MAP: Record<DisplayType, string> = {
  election: "bg-primary-container text-primary",
  quiz: "bg-secondary-container text-secondary",
  guide: "bg-tertiary-container text-tertiary",
  booth: "bg-primary-container text-primary",
  milestone: "bg-yellow-100 text-yellow-700",
  alert: "bg-error-container text-error",
};

const LABEL_MAP: Record<DisplayType, string> = {
  election: "Election",
  quiz: "Quiz",
  guide: "Guide",
  booth: "Booth",
  milestone: "Milestone",
  alert: "Alert",
};

// ── Mock data (shown when user is not authenticated) ──────────────────────
const MOCK_NOTIFICATIONS: DisplayNotification[] = [
  {
    id: "n1", type: "election",
    title: "Phase 4 Voting Tomorrow",
    body: "Polling in 96 constituencies across 5 states opens at 7 AM tomorrow. Ensure you have your EPIC or valid photo ID ready.",
    time: "2h ago", fullDate: "Today, 2:30 PM",
    isRead: false, href: "/timeline",
  },
  {
    id: "n2", type: "quiz",
    title: "Daily Quiz Challenge is Live!",
    body: "Today's civic knowledge question has been unlocked. Challenge yourself and earn 10 XP.",
    time: "6h ago", fullDate: "Today, 10:00 AM",
    isRead: false, href: "/quiz",
  },
  {
    id: "n3", type: "guide",
    title: "New Guide: Understanding NOTA",
    body: "A comprehensive guide explaining the 'None of the Above' voting option has been published.",
    time: "1d ago", fullDate: "Yesterday, 3:15 PM",
    isRead: false, href: "/guides",
  },
  {
    id: "n4", type: "booth",
    title: "Your Polling Booth Location Changed",
    body: "Booth PB-0012 has been relocated from Ward 12 Primary School to Ward 12 Municipal School (North Block).",
    time: "2d ago", fullDate: "May 1, 9:00 AM",
    isRead: true, href: "/booth-finder",
  },
  {
    id: "n5", type: "milestone",
    title: "Voter Readiness: 75% Complete!",
    body: "Great progress! You've completed 6 out of 8 voter readiness steps.",
    time: "3d ago", fullDate: "Apr 30, 11:20 AM",
    isRead: true, href: "/dashboard",
  },
  {
    id: "n6", type: "alert",
    title: "Last Date to Register: May 10",
    body: "The deadline to register as a first-time voter is May 10. Submit your Form 6 online or at your local ERO.",
    time: "5d ago", fullDate: "Apr 28, 8:00 AM",
    isRead: true, href: "/registration",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return `${Math.floor(diffD / 7)}w ago`;
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + `, ${time}`;
}

function dbToDisplay(n: DBNotification): DisplayNotification {
  return {
    id: n.id,
    type: toDisplayType(n.type),
    title: n.title,
    body: n.body ?? "",
    time: formatRelativeTime(n.created_at),
    fullDate: formatFullDate(n.created_at),
    isRead: n.is_read,
    href: n.href ?? n.action_url ?? undefined,
  };
}

// ── Filter Types ────────────────────────────────────────────────────────────
const FILTER_TYPES = ["all", "election", "quiz", "guide", "booth", "milestone", "alert"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

// ═══════════════════════════════════════════════════════════════════════════
export function NotificationsPageClient() {
  const [notifs, setNotifs] = useState<DisplayNotification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ── Show a short toast ────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Load notifications from Supabase ──────────────────────────────────────
  const loadFromDB = useCallback(async () => {
    const data = await fetchNotifications();
    if (data.length > 0) {
      setNotifs(data.map(dbToDisplay));
    }
  }, []);

  // ── On mount: check auth, load data, subscribe to realtime ───────────────
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoading(false);
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.id);
        loadFromDB();

        // Subscribe to realtime inserts
        const unsubscribe = subscribeToNotifications(user.id, (newNotif) => {
          setNotifs((prev) => [dbToDisplay(newNotif), ...prev]);
          showToast(`🔔 ${newNotif.title}`);
        });
        return unsubscribe;
      } else {
        // Not authenticated — use mock data
        setNotifs(MOCK_NOTIFICATIONS);
      }
    });
  }, [loadFromDB]);

  // ── Computed values ────────────────────────────────────────────────────────
  const filtered = notifs.filter(
    (n) =>
      (filter === "all" || n.type === filter) &&
      (!showUnreadOnly || !n.isRead)
  );

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  // ── Actions ────────────────────────────────────────────────────────────────
  const markRead = async (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    if (isAuthenticated) await markNotificationRead(id);
  };

  const markAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (isAuthenticated) {
      await markAllNotificationsRead();
      showToast("All notifications marked as read");
    }
  };

  const deleteSelected = async () => {
    if (isAuthenticated) {
      await deleteNotifications(selected);
    }
    setNotifs((prev) => prev.filter((n) => !selected.includes(n.id)));
    showToast(`${selected.length} notification${selected.length > 1 ? "s" : ""} deleted`);
    setSelected([]);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelected(filtered.map((n) => n.id));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-dim">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-surface-container border border-outline-variant rounded-xl shadow-lg px-4 py-3 text-sm text-on-surface flex items-center gap-2 animate-in slide-in-from-right">
          <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
          {toastMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">notifications</span>
              Notifications
              {unreadCount > 0 && (
                <span className="bg-error text-on-error text-xs px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {isAuthenticated
                ? "Real-time election updates and reminders"
                : "Election updates, reminders, and milestones"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <span
                className="flex items-center gap-1 text-xs text-tertiary"
                title="Connected to real-time database"
              >
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block animate-pulse" />
                Live
              </span>
            )}
            <Link
              href="/settings/notifications"
              className="flex items-center gap-2 text-sm text-on-surface-variant border border-outline-variant px-3 py-2 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              Settings
            </Link>
          </div>
        </div>

        {/* Auth notice */}
        {!isAuthenticated && !isLoading && (
          <div className="bg-primary-container/40 border border-primary-fixed-dim rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">info</span>
            <div className="flex-1 text-sm text-on-primary-container">
              <strong>Sign in</strong> to get real-time notifications synced across all your devices.
            </div>
            <Link
              href="/login"
              className="bg-primary text-on-primary text-xs px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-surface-container-high rounded w-3/4" />
                    <div className="h-3 bg-surface-container-high rounded w-full" />
                    <div className="h-3 bg-surface-container-high rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter bar */}
        {!isLoading && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-3">
              {FILTER_TYPES.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    filter === f
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {f === "all" ? `All (${notifs.length})` : LABEL_MAP[f as DisplayType]}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="rounded accent-primary w-4 h-4"
                />
                Show unread only
              </label>

              <div className="flex gap-2">
                {selected.length > 0 ? (
                  <>
                    <button
                      onClick={deleteSelected}
                      className="text-xs text-error border border-error/30 px-3 py-1.5 rounded-lg hover:bg-error-container transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Delete ({selected.length})
                    </button>
                    <button
                      onClick={() => setSelected([])}
                      className="text-xs text-on-surface-variant border border-outline-variant px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary-container transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">done_all</span>
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={selectAll}
                      className="text-xs text-on-surface-variant border border-outline-variant px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors"
                    >
                      Select all
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notification list */}
        {!isLoading && (
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-16 text-center shadow-sm">
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block">
                  notifications_off
                </span>
                <p className="font-medium text-on-surface">No notifications</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  {showUnreadOnly
                    ? "All notifications are read"
                    : "No notifications in this category"}
                </p>
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  className={`bg-surface-container-lowest border rounded-xl shadow-sm overflow-hidden transition-all ${
                    !n.isRead
                      ? "border-primary/30 border-l-4 border-l-primary"
                      : "border-outline-variant"
                  } ${selected.includes(n.id) ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex gap-4 p-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(n.id)}
                      onChange={() => toggleSelect(n.id)}
                      className="mt-1 rounded accent-primary w-4 h-4 flex-shrink-0"
                    />

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${COLOR_MAP[n.type]}`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {ICON_MAP[n.type]}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${COLOR_MAP[n.type]}`}
                          >
                            {LABEL_MAP[n.type]}
                          </span>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-outline flex-shrink-0">{n.fullDate}</span>
                      </div>

                      <h3
                        className={`text-sm mb-1 ${
                          !n.isRead
                            ? "font-bold text-on-surface"
                            : "font-medium text-on-surface-variant"
                        }`}
                      >
                        {n.title}
                      </h3>

                      <p className="text-xs text-on-surface-variant leading-relaxed">{n.body}</p>

                      <div className="flex items-center gap-3 mt-3">
                        {n.href && (
                          <Link
                            href={n.href}
                            onClick={() => markRead(n.id)}
                            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                          >
                            View details
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </Link>
                        )}
                        {!n.isRead && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="text-xs text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">check</span>
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-on-surface-variant">
            Manage your notification preferences in{" "}
            <Link href="/settings/notifications" className="text-primary hover:underline">
              Notification Settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
