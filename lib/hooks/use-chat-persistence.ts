"use client";

import { useEffect, useCallback, useState } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import {
  fetchSessions,
  fetchMessages,
  deleteSession as deleteSessionDB,
} from "@/lib/supabase/chat-persistence";
import {
  getLocalSessions,
  getLocalMessages,
  removeLocalSession,
  getLastSessionId,
  setLastSessionId,
  clearLocalPersistence,
} from "@/lib/supabase/local-persistence";
import { createClient } from "@/lib/supabase/client";

/**
 * Hook to hydrate chat state from Supabase (authenticated) or
 * localStorage (anonymous) on mount.
 *
 * Responsibilities:
 *   - Detect auth state and set isAuthenticated
 *   - Load session list for the sidebar
 *   - Load messages when switching sessions
 *   - Recover the last active session after page refresh
 *   - Provide delete handler for the sidebar
 *   - Expose hydrating state for loading UI
 */
export function useChatPersistence() {
  const {
    currentSessionId,
    isAuthenticated,
    setSessions,
    setMessages,
    setCurrentSession,
    setIsAuthenticated,
    removeSession,
    setRagCitations,
    setError,
  } = useChatStore();

  const [hydrating, setHydrating] = useState(true);

  // ── Auth Detection ──────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setIsAuthenticated(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const wasAuthenticated = useChatStore.getState().isAuthenticated;
      const isNowAuthenticated = !!session?.user;

      setIsAuthenticated(isNowAuthenticated);

      // User just signed in → migrate local data to Supabase
      if (!wasAuthenticated && isNowAuthenticated) {
        clearLocalPersistence();
        loadSessions();
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load Sessions ───────────────────────────────────────────
  const loadSessions = useCallback(async () => {
    setHydrating(true);
    try {
      const isAuth = useChatStore.getState().isAuthenticated;

      if (isAuth) {
        const sessions = await fetchSessions();
        setSessions(sessions);
      } else {
        // Anonymous fallback — load from localStorage
        const localSessions = getLocalSessions();
        setSessions(localSessions);
      }

      // Recover last active session
      const lastId = getLastSessionId();
      if (lastId && !useChatStore.getState().currentSessionId) {
        setCurrentSession(lastId);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations"
      );
    } finally {
      setHydrating(false);
    }
  }, [setSessions, setCurrentSession, setError]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // ── Track active session for recovery ───────────────────────
  useEffect(() => {
    setLastSessionId(currentSessionId);
  }, [currentSessionId]);

  // ── Load Messages on Session Switch ─────────────────────────
  useEffect(() => {
    if (!currentSessionId) return;

    const loadMessages = async () => {
      const isAuth = useChatStore.getState().isAuthenticated;

      let msgs;
      if (isAuth) {
        msgs = await fetchMessages(currentSessionId);
      } else {
        msgs = getLocalMessages(currentSessionId);
      }

      if (msgs.length > 0) {
        setMessages(msgs);
        // Restore citations from the last assistant message
        const lastAI = [...msgs].reverse().find((m) => m.role === "assistant");
        if (lastAI?.citations) {
          setRagCitations(lastAI.citations);
        } else {
          setRagCitations([]);
        }
      }
    };

    loadMessages();
  }, [currentSessionId, setMessages, setRagCitations]);

  // ── Session Management ──────────────────────────────────────
  const switchSession = useCallback(
    (sessionId: string) => {
      setCurrentSession(sessionId);
    },
    [setCurrentSession]
  );

  const deleteSessionHandler = useCallback(
    async (sessionId: string) => {
      const isAuth = useChatStore.getState().isAuthenticated;

      if (isAuth) {
        await deleteSessionDB(sessionId);
      } else {
        removeLocalSession(sessionId);
      }

      removeSession(sessionId);
    },
    [removeSession]
  );

  return {
    hydrating,
    loadSessions,
    switchSession,
    deleteSession: deleteSessionHandler,
  };
}
