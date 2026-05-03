import { createClient } from "./client";

/**
 * Chat feedback persistence — saves thumbs up/down to Supabase.
 * Table: chat_feedback (see migration 004)
 */

export async function saveFeedback(
  messageId: string,
  rating: "positive" | "negative",
  reason?: string
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Upsert: one feedback per user per message
  const { error } = await supabase
    .from("chat_feedback")
    .upsert(
      {
        message_id: messageId,
        user_id: user.id,
        rating,
        reason: reason || null,
      },
      {
        onConflict: "message_id,user_id",
        ignoreDuplicates: false,
      }
    );

  if (error) {
    console.error("Feedback save failed:", error);
    return { error: error.message };
  }

  return { error: null };
}

export async function getFeedback(
  messageId: string
): Promise<"positive" | "negative" | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("chat_feedback")
    .select("rating")
    .eq("message_id", messageId)
    .eq("user_id", user.id)
    .single();

  return (data?.rating as "positive" | "negative") || null;
}
