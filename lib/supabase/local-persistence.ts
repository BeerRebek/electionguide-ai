import type { ChatMessage, ChatSession } from "@/lib/stores/chat-store";

/**
 * localStorage fallback for unauthenticated users.
 * Stores sessions and messages so conversations survive page refreshes
 * even without a Supabase account.
 *
 * Storage keys:
 *   eg:sessions       — ChatSession[]
 *   eg:msgs:{id}      — ChatMessage[] per session
 *   eg:lastSessionId  — last active session ID (for recovery)
 */

const SESSIONS_KEY = "eg:sessions";
const MESSAGES_PREFIX = "eg:msgs:";
const LAST_SESSION_KEY = "eg:lastSessionId";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

// ── Sessions ──────────────────────────────────────────────────

export function getLocalSessions(): ChatSession[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setLocalSessions(sessions: ChatSession[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // quota exceeded — silently fail
  }
}

export function addLocalSession(session: ChatSession): void {
  const sessions = getLocalSessions();
  setLocalSessions([session, ...sessions]);
}

export function removeLocalSession(sessionId: string): void {
  const sessions = getLocalSessions().filter((s) => s.id !== sessionId);
  setLocalSessions(sessions);
  // Also remove messages
  if (isBrowser()) {
    try {
      localStorage.removeItem(MESSAGES_PREFIX + sessionId);
    } catch {
      // ignore
    }
  }
}

export function updateLocalSessionTitle(
  sessionId: string,
  title: string
): void {
  const sessions = getLocalSessions().map((s) =>
    s.id === sessionId ? { ...s, title, updatedAt: new Date().toISOString() } : s
  );
  setLocalSessions(sessions);
}

// ── Messages ──────────────────────────────────────────────────

export function getLocalMessages(sessionId: string): ChatMessage[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(MESSAGES_PREFIX + sessionId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalMessage(
  sessionId: string,
  message: ChatMessage
): void {
  if (!isBrowser()) return;
  try {
    const msgs = getLocalMessages(sessionId);
    msgs.push(message);
    localStorage.setItem(MESSAGES_PREFIX + sessionId, JSON.stringify(msgs));

    // Also touch the session's updatedAt
    const sessions = getLocalSessions().map((s) =>
      s.id === sessionId
        ? { ...s, updatedAt: new Date().toISOString(), messageCount: msgs.length }
        : s
    );
    setLocalSessions(sessions);
  } catch {
    // quota exceeded — silently fail
  }
}

// ── Last Session Recovery ─────────────────────────────────────

export function getLastSessionId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(LAST_SESSION_KEY);
}

export function setLastSessionId(id: string | null): void {
  if (!isBrowser()) return;
  if (id) {
    localStorage.setItem(LAST_SESSION_KEY, id);
  } else {
    localStorage.removeItem(LAST_SESSION_KEY);
  }
}

// ── Cleanup ───────────────────────────────────────────────────

/**
 * Clear all locally persisted chat data.
 * Called when user signs in (data moves to Supabase).
 */
export function clearLocalPersistence(): void {
  if (!isBrowser()) return;
  const sessions = getLocalSessions();
  sessions.forEach((s) => {
    try {
      localStorage.removeItem(MESSAGES_PREFIX + s.id);
    } catch {
      // ignore
    }
  });
  localStorage.removeItem(SESSIONS_KEY);
  localStorage.removeItem(LAST_SESSION_KEY);
}
