import { createClient } from "./client";
import type { ChatMessage, ChatSession, Citation } from "@/lib/stores/chat-store";

/**
 * Chat persistence service — CRUD for sessions and messages via Supabase.
 * Tables: chat_sessions, chat_messages (see 001_initial_schema.sql)
 *
 * Note: RLS requires auth.uid(), so operations will silently fail for
 * unauthenticated users. The hook layer gracefully degrades to in-memory only.
 */

// ── Sessions ──────────────────────────────────────────────────

export async function fetchSessions(): Promise<ChatSession[]> {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return [];

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, title, language, updated_at, created_at")
    .eq("user_id", user.user.id)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((s) => ({
    id: s.id,
    title: s.title || "Untitled Chat",
    language: s.language || "English",
    updatedAt: s.updated_at,
    messageCount: undefined, // loaded lazily
  }));
}

export async function createSession(
  title: string = "New Chat",
  language: string = "en"
): Promise<string | null> {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return null;

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      user_id: user.user.id,
      title,
      language,
    })
    .select("id")
    .single();

  if (error || !data) return null;
  return data.id;
}

export async function updateSessionTitle(
  sessionId: string,
  title: string
): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("chat_sessions")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", sessionId);
}

export async function deleteSession(sessionId: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("chat_sessions").delete().eq("id", sessionId);
}

// ── Messages ──────────────────────────────────────────────────

export async function fetchMessages(
  sessionId: string
): Promise<ChatMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, citations, metadata, attachments, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
    citations: (m.citations as Citation[]) || undefined,
    attachments: (m.attachments as { url: string; name: string; type: string; size: number }[]) || undefined,
    confidence: m.metadata?.confidence || undefined,
    sourceCount: m.metadata?.sourceCount || undefined,
    createdAt: m.created_at,
  }));
}

export async function saveMessage(
  sessionId: string,
  message: ChatMessage
): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      role: message.role,
      content: message.content,
      citations: message.citations || [],
      attachments: message.attachments || [],
      metadata: {
        confidence: message.confidence,
        sourceCount: message.sourceCount,
      },
    })
    .select("id")
    .single();

  // Touch session updated_at
  await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error || !data) return null;
  return data.id;
}

/**
 * Generate a short title from the first user message.
 * Truncates at 60 chars.
 */
export function generateSessionTitle(firstMessage: string): string {
  const cleaned = firstMessage.replace(/\n/g, " ").trim();
  if (cleaned.length <= 60) return cleaned;
  return cleaned.slice(0, 57) + "...";
}
