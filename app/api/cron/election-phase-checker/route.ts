import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/election-phase-checker
 * Updates election statuses based on current date.
 * Triggers in-app notifications when status changes.
 * Protected by CRON_SECRET header.
 */
export async function GET(req: NextRequest) {
  // Verify CRON_SECRET
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date().toISOString().split("T")[0];
  let updatedCount = 0;
  const statusChanges: Array<{ id: string; title: string; newStatus: string }> = [];

  // Update elections where polling has started → ongoing
  const { data: toOngoing, error: err1 } = await supabase
    .from("elections")
    .update({ status: "ongoing" })
    .lte("polling_start", today)
    .gte("polling_end", today)
    .neq("status", "ongoing")
    .select("id, title");

  if (!err1 && toOngoing) {
    updatedCount += toOngoing.length;
    toOngoing.forEach((e) => {
      console.log(`🔄 ${e.title} → ongoing`);
      statusChanges.push({ id: e.id, title: e.title, newStatus: "ongoing" });
    });
  }

  // Update elections where result_date has passed → completed
  const { data: toCompleted, error: err2 } = await supabase
    .from("elections")
    .update({ status: "completed" })
    .lte("result_date", today)
    .neq("status", "completed")
    .select("id, title");

  if (!err2 && toCompleted) {
    updatedCount += toCompleted.length;
    toCompleted.forEach((e) => {
      console.log(`✅ ${e.title} → completed`);
      statusChanges.push({ id: e.id, title: e.title, newStatus: "completed" });
    });
  }

  // ── Trigger notifications for status changes ──────────────────
  if (statusChanges.length > 0) {
    // Fetch users who have election_reminders enabled
    const { data: users } = await supabase
      .from("profiles")
      .select("id, notification_preferences")
      .not("notification_preferences", "is", null);

    const eligibleUsers = (users || []).filter((u: any) => {
      return u.notification_preferences?.election_reminders === true;
    });

    if (eligibleUsers.length > 0) {
      const notifications: Array<{
        user_id: string;
        title: string;
        body: string;
        type: string;
        action_url: string;
      }> = [];

      for (const change of statusChanges) {
        const isOngoing = change.newStatus === "ongoing";
        for (const user of eligibleUsers) {
          notifications.push({
            user_id: user.id,
            title: isOngoing
              ? `🗳️ ${change.title} Has Begun!`
              : `✅ ${change.title} — Results Declared`,
            body: isOngoing
              ? `${change.title} is now in progress. Check the timeline for polling dates in your area.`
              : `${change.title} has concluded. Results have been declared.`,
            type: `election_status_${change.newStatus}`,
            action_url: "/timeline",
          });
        }
      }

      // Batch insert
      const BATCH_SIZE = 100;
      for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
        const batch = notifications.slice(i, i + BATCH_SIZE);
        const { error: insertErr } = await supabase.from("notifications").insert(batch);
        if (insertErr) {
          console.error("Notification insert error:", insertErr);
        }
      }

      console.log(`📢 Sent ${notifications.length} status-change notifications`);
    }
  }

  return NextResponse.json({
    success: true,
    updatedCount,
    statusChanges,
    checkedAt: new Date().toISOString(),
  });
}
