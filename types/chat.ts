/**
 * ElectionGuide AI — Chat-specific Types
 */

import type { Citation } from "./models";

// ── Streaming Response Types ─────────────────────────────────
export interface StreamTextEvent {
  text: string;
}

export interface StreamCitationEvent {
  citations: Citation[];
}

export interface StreamUsageEvent {
  usage: {
    inputTokens: number;
    outputTokens: number;
    model: string;
  };
}

export interface StreamErrorEvent {
  error: string;
}

export type StreamEvent =
  | StreamTextEvent
  | StreamCitationEvent
  | StreamUsageEvent
  | StreamErrorEvent;

// ── Bite-Snack-Meal Framework ────────────────────────────────
export type ResponseDepth = "bite" | "snack" | "meal";

export interface StructuredResponse {
  depth: ResponseDepth;
  content: string;
  citations: Citation[];
  followUp?: string;
}

// ── Chat UI State ────────────────────────────────────────────
export interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
  feedback?: "positive" | "negative" | null;
  timestamp: Date;
}

// ── Chat API Request ─────────────────────────────────────────
export interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  language?: string;
  sessionId?: string;
}

// ── Chat Store State ─────────────────────────────────────────
export interface ChatStoreState {
  sessions: Array<{
    id: string;
    title: string;
    updatedAt: Date;
  }>;
  currentSessionId: string | null;
  messages: UIMessage[];
  isLoading: boolean;
}
