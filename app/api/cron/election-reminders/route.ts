import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/election-reminders
 * Sends in-app notifications for upcoming elections (7 days, 1 day, day-of).
 * Respects each user's notification_preferences.
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

  const today = new Date();
  const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const in1Day = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  // ── Step 1: Gather reminder triggers ──────────────────────────
  interface ReminderTrigger {
    type: "7_day_reminder" | "1_day_reminder" | "election_day";
    electionTitle: string;
    pollingDate: string;
    phaseNumber: number;
  }

  const triggers: ReminderTrigger[] = [];

  // Check for elections in 7 days
  const { data: weekAway } = await supabase
    .from("election_phases")
    .select("phase_number, polling_date, elections!inner(title)")
    .eq("polling_date", in7Days);

  if (weekAway) {
    weekAway.forEach((phase: any) => {
      triggers.push({
        type: "7_day_reminder",
        electionTitle: phase.elections?.title || "Election",
        pollingDate: phase.polling_date,
        phaseNumber: phase.phase_number,
      });
    });
  }

  // Check for elections tomorrow
  const { data: tomorrow } = await supabase
    .from("election_phases")
    .select("phase_number, polling_date, elections!inner(title)")
    .eq("polling_date", in1Day);

  if (tomorrow) {
    tomorrow.forEach((phase: any) => {
      triggers.push({
        type: "1_day_reminder",
        electionTitle: phase.elections?.title || "Election",
        pollingDate: phase.polling_date,
        phaseNumber: phase.phase_number,
      });
    });
  }

  // Check for elections today
  const { data: todayElections } = await supabase
    .from("election_phases")
    .select("phase_number, polling_date, elections!inner(title)")
    .eq("polling_date", todayStr);

  if (todayElections) {
    todayElections.forEach((phase: any) => {
      triggers.push({
        type: "election_day",
        electionTitle: phase.elections?.title || "Election",
        pollingDate: phase.polling_date,
        phaseNumber: phase.phase_number,
      });
    });
  }

  if (triggers.length === 0) {
    return NextResponse.json({
      success: true,
      message: "No reminders to send today",
      notificationsSent: 0,
      checkedAt: new Date().toISOString(),
    });
  }

  // ── Step 2: Fetch users who opted in for election_reminders ───
  const { data: subscribedUsers, error: usersError } = await supabase
    .from("profiles")
    .select("id, full_name, state, notification_preferences")
    .not("notification_preferences", "is", null);

  if (usersError) {
    console.error("Failed to fetch user preferences:", usersError);
    return NextResponse.json({ error: "Failed to query users" }, { status: 500 });
  }

  // Filter users who have election_reminders enabled
  const eligibleUsers = (subscribedUsers || []).filter((user: any) => {
    const prefs = user.notification_preferences;
    return prefs && prefs.election_reminders === true;
  });

  // ── Step 3: Generate notification messages ────────────────────
  const NOTIFICATION_TEMPLATES: Record<string, { title: (e: string) => string; body: (e: string, d: string, p: number) => string }> = {
    "7_day_reminder": {
      title: (e) => `📅 ${e} in 7 Days`,
      body: (e, d, p) => `Phase ${p} of ${e} is scheduled for ${d}. Make sure your voter ID is ready and check your polling booth location.`,
    },
    "1_day_reminder": {
      title: (e) => `⏰ ${e} Tomorrow!`,
      body: (e, d, p) => `Phase ${p} of ${e} is tomorrow (${d}). Remember to carry your voter ID and reach your booth early. Every vote counts!`,
    },
    "election_day": {
      title: (e) => `🗳️ It's Polling Day — ${e}!`,
      body: (e, _d, p) => `Today is Phase ${p} of ${e}. Polling stations are open 7 AM to 6 PM. Go vote! 🇮🇳`,
    },
  };

  // ── Step 4: Insert notifications into the notifications table ─
  const notificationsToInsert: Array<{
    user_id: string;
    title: string;
    body: string;
    type: string;
    action_url: string;
  }> = [];

  for (const trigger of triggers) {
    const template = NOTIFICATION_TEMPLATES[trigger.type];
    if (!template) continue;

    for (const user of eligibleUsers) {
      notificationsToInsert.push({
        user_id: user.id,
        title: template.title(trigger.electionTitle),
        body: template.body(trigger.electionTitle, trigger.pollingDate, trigger.phaseNumber),
        type: trigger.type,
        action_url: "/timeline",
      });
    }
  }

  let insertedCount = 0;

  if (notificationsToInsert.length > 0) {
    // Batch insert in chunks of 100
    const BATCH_SIZE = 100;
    for (let i = 0; i < notificationsToInsert.length; i += BATCH_SIZE) {
      const batch = notificationsToInsert.slice(i, i + BATCH_SIZE);
      const { error: insertError, data: inserted } = await supabase
        .from("notifications")
        .insert(batch)
        .select("id");

      if (insertError) {
        console.error(`Notification batch insert error (batch ${i / BATCH_SIZE}):`, insertError);
      } else {
        insertedCount += inserted?.length || 0;
      }
    }
  }

  console.log(`📢 Election reminders: ${triggers.length} triggers × ${eligibleUsers.length} users = ${insertedCount} notifications sent`);

  return NextResponse.json({
    success: true,
    triggers: triggers.length,
    eligibleUsers: eligibleUsers.length,
    notificationsSent: insertedCount,
    checkedAt: new Date().toISOString(),
  });
}
