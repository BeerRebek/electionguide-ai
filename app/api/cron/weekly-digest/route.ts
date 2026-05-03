import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/weekly-digest
 * Sends a weekly quiz performance digest to opted-in users.
 * Triggered by Cloud Scheduler every Monday at 9 AM IST.
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

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // ── Fetch users who opted into weekly_digest ──────────────────────────────
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, full_name, notification_preferences")
    .not("notification_preferences", "is", null);

  if (usersError) {
    console.error("[weekly-digest] Failed to fetch users:", usersError.message);
    return NextResponse.json({ error: "Failed to query users" }, { status: 500 });
  }

  const eligibleUsers = (users ?? []).filter((u: any) => {
    const prefs = u.notification_preferences;
    return prefs?.weekly_digest === true || prefs?.categories?.quiz_alerts === true;
  });

  if (eligibleUsers.length === 0) {
    return NextResponse.json({
      success: true,
      message: "No users subscribed to weekly digest",
      notificationsSent: 0,
    });
  }

  // ── For each user, fetch their quiz attempts this week ───────────────────
  const notificationsToInsert: Array<{
    user_id: string;
    title: string;
    body: string;
    type: string;
    action_url: string;
  }> = [];

  for (const user of eligibleUsers) {
    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("score, total_questions, completed_at")
      .eq("user_id", user.id)
      .gte("completed_at", oneWeekAgo)
      .not("completed_at", "is", null);

    const count = attempts?.length ?? 0;
    const avgScore =
      count > 0
        ? Math.round(
            (attempts!.reduce((sum, a) => sum + ((a.score / a.total_questions) * 100), 0) / count)
          )
        : 0;

    const name = user.full_name?.split(" ")[0] || "Voter";

    let title: string;
    let body: string;

    if (count === 0) {
      title = "📚 This week's quiz awaits!";
      body = `Hi ${name}! You haven't taken any quizzes this week. Challenge yourself with civic knowledge quizzes and climb the leaderboard!`;
    } else if (avgScore >= 80) {
      title = `🏆 Great week, ${name}! ${count} quiz${count > 1 ? "zes" : ""} completed`;
      body = `Excellent work! You completed ${count} quiz${count > 1 ? "zes" : ""} with an average score of ${avgScore}%. Keep it up and stay informed!`;
    } else {
      title = `📊 Weekly Quiz Digest — ${count} quiz${count > 1 ? "zes" : ""} done`;
      body = `You completed ${count} quiz${count > 1 ? "zes" : ""} this week with an average of ${avgScore}%. Review the answers and try again for a higher score!`;
    }

    notificationsToInsert.push({
      user_id: user.id,
      title,
      body,
      type: "quiz",
      action_url: "/quiz",
    });
  }

  // ── Batch insert notifications ────────────────────────────────────────────
  let insertedCount = 0;
  const BATCH_SIZE = 100;

  for (let i = 0; i < notificationsToInsert.length; i += BATCH_SIZE) {
    const batch = notificationsToInsert.slice(i, i + BATCH_SIZE);
    const { data: inserted, error: insertError } = await supabase
      .from("notifications")
      .insert(batch)
      .select("id");

    if (insertError) {
      console.error(`[weekly-digest] Batch insert error:`, insertError.message);
    } else {
      insertedCount += inserted?.length ?? 0;
    }
  }

  console.log(`📊 Weekly digest: ${insertedCount} notifications sent to ${eligibleUsers.length} users`);

  return NextResponse.json({
    success: true,
    eligibleUsers: eligibleUsers.length,
    notificationsSent: insertedCount,
    sentAt: new Date().toISOString(),
  });
}
