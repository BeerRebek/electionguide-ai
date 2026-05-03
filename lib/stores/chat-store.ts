import { create } from "zustand";

export interface Citation {
  id: string;
  number: number;
  title: string;
  snippet: string;
  sourceUrl?: string;
  sourceType: "act" | "rule" | "manual" | "eci" | "website";
  domain?: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: Citation[];
  attachments?: {
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
  confidence?: "high" | "medium" | "low";
  sourceCount?: number;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  language: string;
  updatedAt: string;
  messageCount?: number;
}

// ── Token/cost tracking ─────────────────────────────────────
export interface UsageStats {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalRequests: number;
  estimatedCostUSD: number;
}

interface ChatStore {
  // Session state
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: ChatMessage[];

  // Persistence state
  isAuthenticated: boolean;
  sessionsLoaded: boolean;

  // UI state
  isStreaming: boolean;
  streamingContent: string;
  ragCitations: Citation[];
  sidebarOpen: boolean;
  sourcesPanelOpen: boolean;
  searchQuery: string;
  currentLanguage: string;

  // Token tracking
  usage: UsageStats;

  // Error state
  error: string | null;

  // Actions
  setCurrentSession: (id: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  updateStreamingContent: (content: string) => void;
  setIsStreaming: (streaming: boolean) => void;
  setRagCitations: (citations: Citation[]) => void;
  setSessions: (sessions: ChatSession[]) => void;
  addSession: (session: ChatSession) => void;
  removeSession: (id: string) => void;
  clearMessages: () => void;
  toggleSidebar: () => void;
  toggleSourcesPanel: () => void;
  setSearchQuery: (query: string) => void;
  setCurrentLanguage: (lang: string) => void;
  newChat: () => void;
  setIsAuthenticated: (auth: boolean) => void;
  setSessionsLoaded: (loaded: boolean) => void;
  setMessages: (messages: ChatMessage[]) => void;
  trackUsage: (inputTokens: number, outputTokens: number) => void;
  setError: (error: string | null) => void;
}

// Gemini 2.5 Flash pricing (per 1M tokens)
const COST_PER_INPUT_1M = 0.15;
const COST_PER_OUTPUT_1M = 0.60;

export const useChatStore = create<ChatStore>((set) => ({
  sessions: [],
  currentSessionId: null,
  messages: [],
  isAuthenticated: false,
  sessionsLoaded: false,
  isStreaming: false,
  streamingContent: "",
  ragCitations: [],
  sidebarOpen: true,
  sourcesPanelOpen: true,
  searchQuery: "",
  currentLanguage: "English",
  error: null,
  usage: {
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalRequests: 0,
    estimatedCostUSD: 0,
  },

  setCurrentSession: (id) => set({ currentSessionId: id }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateStreamingContent: (content) => set({ streamingContent: content }),
  setIsStreaming: (streaming) =>
    set({ isStreaming: streaming, streamingContent: streaming ? "" : "" }),
  setRagCitations: (citations) => set({ ragCitations: citations }),
  setSessions: (sessions) => set({ sessions, sessionsLoaded: true }),
  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
      messages: state.currentSessionId === id ? [] : state.messages,
    })),
  clearMessages: () => set({ messages: [], streamingContent: "" }),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSourcesPanel: () =>
    set((state) => ({ sourcesPanelOpen: !state.sourcesPanelOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentLanguage: (lang) => set({ currentLanguage: lang }),
  newChat: () =>
    set({
      currentSessionId: null,
      messages: [],
      streamingContent: "",
      ragCitations: [],
      isStreaming: false,
    }),
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setSessionsLoaded: (loaded) => set({ sessionsLoaded: loaded }),
  setMessages: (messages) => set({ messages }),
  trackUsage: (inputTokens, outputTokens) =>
    set((state) => {
      const newInput = state.usage.totalInputTokens + inputTokens;
      const newOutput = state.usage.totalOutputTokens + outputTokens;
      return {
        usage: {
          totalInputTokens: newInput,
          totalOutputTokens: newOutput,
          totalRequests: state.usage.totalRequests + 1,
          estimatedCostUSD:
            (newInput / 1_000_000) * COST_PER_INPUT_1M +
            (newOutput / 1_000_000) * COST_PER_OUTPUT_1M,
        },
      };
    }),
  setError: (error) => set({ error }),
}));
