/**
 * lib/supabase/notifications.ts
 * Typed CRUD + realtime subscription helpers for the notifications table.
 * Falls back gracefully when Supabase is unavailable (dev without auth).
 */

import { createClient } from "@supabase/supabase-js";

// ── Types ──────────────────────────────────────────────────────────────────
export type NotificationType =
  | "election"
  | "quiz"
  | "guide"
  | "booth"
  | "milestone"
  | "alert"
  | "system"
  | "7_day_reminder"
  | "1_day_reminder"
  | "election_day";

export interface DBNotification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: NotificationType;
  is_read: boolean;
  href: string | null;
  action_url: string | null;
  created_at: string;
}

export interface NotificationInsert {
  user_id: string;
  title: string;
  body?: string;
  type?: NotificationType;
  href?: string;
  action_url?: string;
}

// ── Singleton Supabase client (browser) ───────────────────────────────────
function getBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Fetch all notifications for current user ───────────────────────────────
export async function fetchNotifications(): Promise<DBNotification[]> {
  try {
    const supabase = getBrowserClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.warn("[notifications] fetch error:", error.message);
      return [];
    }
    return (data ?? []) as DBNotification[];
  } catch (e) {
    console.warn("[notifications] fetch exception:", e);
    return [];
  }
}

// ── Mark one notification as read ──────────────────────────────────────────
export async function markNotificationRead(id: string): Promise<void> {
  try {
    const supabase = getBrowserClient();
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
  } catch (e) {
    console.warn("[notifications] markRead exception:", e);
  }
}

// ── Mark all notifications as read for current user ────────────────────────
export async function markAllNotificationsRead(): Promise<void> {
  try {
    const supabase = getBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  } catch (e) {
    console.warn("[notifications] markAllRead exception:", e);
  }
}

// ── Delete one notification ────────────────────────────────────────────────
export async function deleteNotification(id: string): Promise<void> {
  try {
    const supabase = getBrowserClient();
    await supabase.from("notifications").delete().eq("id", id);
  } catch (e) {
    console.warn("[notifications] delete exception:", e);
  }
}

// ── Delete multiple notifications ─────────────────────────────────────────
export async function deleteNotifications(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  try {
    const supabase = getBrowserClient();
    await supabase.from("notifications").delete().in("id", ids);
  } catch (e) {
    console.warn("[notifications] bulkDelete exception:", e);
  }
}

// ── Subscribe to realtime inserts for current user ────────────────────────
export function subscribeToNotifications(
  userId: string,
  onInsert: (notification: DBNotification) => void
) {
  const supabase = getBrowserClient();
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onInsert(payload.new as DBNotification);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ── Get unread count for current user ─────────────────────────────────────
export async function getUnreadCount(): Promise<number> {
  try {
    const supabase = getBrowserClient();
    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

// ── Insert a notification (server-side; uses service role key) ─────────────
export async function insertNotificationServer(
  payload: NotificationInsert,
  serviceRoleKey: string,
  supabaseUrl: string
): Promise<{ id: string } | null> {
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await supabase
      .from("notifications")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error("[notifications] server insert error:", error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error("[notifications] server insert exception:", e);
    return null;
  }
}

// ── Map DB type to display type ────────────────────────────────────────────
export function toDisplayType(
  type: NotificationType
): "election" | "quiz" | "guide" | "booth" | "milestone" | "alert" {
  const map: Record<string, "election" | "quiz" | "guide" | "booth" | "milestone" | "alert"> = {
    election: "election",
    quiz: "quiz",
    guide: "guide",
    booth: "booth",
    milestone: "milestone",
    alert: "alert",
    system: "alert",
    "7_day_reminder": "election",
    "1_day_reminder": "election",
    election_day: "election",
  };
  return map[type] ?? "alert";
}
