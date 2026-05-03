"use client";

import { useChatStore, type Citation } from "@/lib/stores/chat-store";
import { useCallback } from "react";
import {
  createSession,
  saveMessage,
  generateSessionTitle,
  updateSessionTitle,
} from "@/lib/supabase/chat-persistence";
import {
  addLocalSession,
  saveLocalMessage,
  updateLocalSessionTitle,
} from "@/lib/supabase/local-persistence";

/**
 * Shared hook for sending messages to the AI API with RAG citations.
 * Used by ChatInput, EmptyState, and SourcesPanel.
 *
 * Automatically persists messages to Supabase for authenticated users.
 * Falls back to localStorage for unauthenticated users.
 */
export function useSendMessage() {
  const {
    messages,
    currentSessionId,
    isAuthenticated,
    addMessage,
    setIsStreaming,
    updateStreamingContent,
    setRagCitations,
    setCurrentSession,
    addSession,
    trackUsage,
  } = useChatStore();

  const sendMessage = useCallback(
    async (
      userContent: string,
      language: string = "English",
      attachments: { url: string; name: string; type: string; size: number }[] = [],
      existingMessages?: { role: string; content: string }[]
    ) => {
      // Add user message to store
      const userMsg = {
        id: crypto.randomUUID(),
        role: "user" as const,
        content: userContent,
        attachments,
        createdAt: new Date().toISOString(),
      };
      addMessage(userMsg);
      setIsStreaming(true);

      // ── Persistence: ensure a session exists ──────────────
      let sessionId = currentSessionId;

      if (!sessionId) {
        const title = generateSessionTitle(userContent);

        if (isAuthenticated) {
          // Supabase persistence
          const newId = await createSession(title, language);
          if (newId) {
            sessionId = newId;
            setCurrentSession(newId);
            addSession({
              id: newId,
              title,
              language,
              updatedAt: new Date().toISOString(),
            });
          }
        } else {
          // localStorage persistence for anonymous users
          const newId = crypto.randomUUID();
          sessionId = newId;
          setCurrentSession(newId);
          const newSession = {
            id: newId,
            title,
            language,
            updatedAt: new Date().toISOString(),
          };
          addSession(newSession);
          addLocalSession(newSession);
        }
      }

      // Persist user message
      if (sessionId) {
        if (isAuthenticated) {
          await saveMessage(sessionId, userMsg);
        } else {
          saveLocalMessage(sessionId, userMsg);
        }
      }

      // Build conversation history
      const history = existingMessages || [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ];
      history.push({ role: "user", content: userContent });

      let fullText = "";
      let receivedCitations: Citation[] = [];

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, language }),
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No reader");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                // Handle citation events from RAG
                if (parsed.citations) {
                  receivedCitations = parsed.citations;
                  setRagCitations(receivedCitations);
                }
                // Handle usage/token metadata from server
                if (parsed.usage) {
                  trackUsage(
                    parsed.usage.inputTokens || 0,
                    parsed.usage.outputTokens || 0
                  );
                }
                // Handle text stream events
                if (parsed.text) {
                  fullText += parsed.text;
                  updateStreamingContent(fullText);
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }
      } catch {
        fullText =
          "⚠️ Failed to connect to the AI service. Please check your connection and try again.";
      }

      // Finalize: add as assistant message with real citations
      const assistantMsg = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: fullText,
        citations: receivedCitations.length > 0 ? receivedCitations : undefined,
        confidence: (receivedCitations.length >= 3 ? "high" : receivedCitations.length >= 1 ? "medium" : "low") as "high" | "medium" | "low",
        sourceCount: receivedCitations.length || 1,
        createdAt: new Date().toISOString(),
      };
      addMessage(assistantMsg);

      setIsStreaming(false);

      // Persist assistant message
      if (sessionId) {
        if (isAuthenticated) {
          await saveMessage(sessionId, assistantMsg);

          // Auto-title: if this is the first exchange, update session title
          if (messages.length === 0) {
            await updateSessionTitle(
              sessionId,
              generateSessionTitle(userContent)
            );
          }
        } else {
          saveLocalMessage(sessionId, assistantMsg);

          // Also update local session title
          if (messages.length === 0) {
            updateLocalSessionTitle(
              sessionId,
              generateSessionTitle(userContent)
            );
          }
        }
      }
    },
    [
      messages,
      currentSessionId,
      isAuthenticated,
      addMessage,
      setIsStreaming,
      updateStreamingContent,
      setRagCitations,
      setCurrentSession,
      addSession,
      trackUsage,
    ]
  );

  return { sendMessage };
}
