import { act } from "@testing-library/react";
import { useChatStore } from "@/lib/stores/chat-store";
import type { ChatMessage, Citation } from "@/lib/stores/chat-store";

// Reset store between tests
beforeEach(() => {
  useChatStore.setState({
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
  });
});

const makeMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: "msg-1",
  role: "user",
  content: "What is Form 6?",
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("ChatStore — initial state", () => {
  it("starts with no sessions", () => {
    expect(useChatStore.getState().sessions).toHaveLength(0);
  });

  it("starts with null currentSessionId", () => {
    expect(useChatStore.getState().currentSessionId).toBeNull();
  });

  it("starts with no messages", () => {
    expect(useChatStore.getState().messages).toHaveLength(0);
  });

  it("starts with streaming off", () => {
    expect(useChatStore.getState().isStreaming).toBe(false);
  });
});

describe("ChatStore — session management", () => {
  it("setCurrentSession updates currentSessionId", () => {
    act(() => {
      useChatStore.getState().setCurrentSession("session-abc");
    });
    expect(useChatStore.getState().currentSessionId).toBe("session-abc");
  });

  it("setCurrentSession accepts null to clear session", () => {
    useChatStore.setState({ currentSessionId: "session-xyz" });
    act(() => {
      useChatStore.getState().setCurrentSession(null);
    });
    expect(useChatStore.getState().currentSessionId).toBeNull();
  });

  it("addSession prepends to sessions array", () => {
    const session = { id: "s1", title: "Test", language: "en", updatedAt: new Date().toISOString() };
    act(() => {
      useChatStore.getState().addSession(session);
    });
    expect(useChatStore.getState().sessions[0].id).toBe("s1");
  });

  it("removeSession removes the correct session", () => {
    useChatStore.setState({
      sessions: [
        { id: "s1", title: "S1", language: "en", updatedAt: "" },
        { id: "s2", title: "S2", language: "en", updatedAt: "" },
      ],
    });
    act(() => {
      useChatStore.getState().removeSession("s1");
    });
    expect(useChatStore.getState().sessions).toHaveLength(1);
    expect(useChatStore.getState().sessions[0].id).toBe("s2");
  });

  it("removeSession clears messages if current session is removed", () => {
    useChatStore.setState({
      sessions: [{ id: "s1", title: "S1", language: "en", updatedAt: "" }],
      currentSessionId: "s1",
      messages: [makeMessage()],
    });
    act(() => {
      useChatStore.getState().removeSession("s1");
    });
    expect(useChatStore.getState().messages).toHaveLength(0);
    expect(useChatStore.getState().currentSessionId).toBeNull();
  });

  it("newChat resets session state", () => {
    useChatStore.setState({
      currentSessionId: "session-old",
      messages: [makeMessage()],
      isStreaming: true,
      ragCitations: [{ id: "c1", number: 1, title: "T", snippet: "s", sourceType: "eci" }],
    });
    act(() => {
      useChatStore.getState().newChat();
    });
    const state = useChatStore.getState();
    expect(state.currentSessionId).toBeNull();
    expect(state.messages).toHaveLength(0);
    expect(state.isStreaming).toBe(false);
    expect(state.ragCitations).toHaveLength(0);
  });
});

describe("ChatStore — message management", () => {
  it("addMessage appends to messages array", () => {
    const msg = makeMessage();
    act(() => {
      useChatStore.getState().addMessage(msg);
    });
    expect(useChatStore.getState().messages).toContainEqual(msg);
  });

  it("addMessage preserves existing messages", () => {
    const msg1 = makeMessage({ id: "m1", content: "first" });
    const msg2 = makeMessage({ id: "m2", content: "second" });
    act(() => {
      useChatStore.getState().addMessage(msg1);
      useChatStore.getState().addMessage(msg2);
    });
    expect(useChatStore.getState().messages).toHaveLength(2);
  });

  it("setMessages replaces messages array", () => {
    useChatStore.setState({ messages: [makeMessage({ id: "old" })] });
    const newMsgs = [makeMessage({ id: "new1" }), makeMessage({ id: "new2" })];
    act(() => {
      useChatStore.getState().setMessages(newMsgs);
    });
    expect(useChatStore.getState().messages).toHaveLength(2);
    expect(useChatStore.getState().messages[0].id).toBe("new1");
  });

  it("clearMessages empties messages array", () => {
    useChatStore.setState({ messages: [makeMessage()] });
    act(() => {
      useChatStore.getState().clearMessages();
    });
    expect(useChatStore.getState().messages).toHaveLength(0);
  });
});

describe("ChatStore — streaming state", () => {
  it("setIsStreaming sets isStreaming to true", () => {
    act(() => {
      useChatStore.getState().setIsStreaming(true);
    });
    expect(useChatStore.getState().isStreaming).toBe(true);
  });

  it("setIsStreaming sets isStreaming to false", () => {
    useChatStore.setState({ isStreaming: true });
    act(() => {
      useChatStore.getState().setIsStreaming(false);
    });
    expect(useChatStore.getState().isStreaming).toBe(false);
  });

  it("updateStreamingContent updates streamingContent", () => {
    act(() => {
      useChatStore.getState().updateStreamingContent("partial response...");
    });
    expect(useChatStore.getState().streamingContent).toBe("partial response...");
  });
});

describe("ChatStore — RAG citations", () => {
  it("setRagCitations stores citations", () => {
    const citations: Citation[] = [
      { id: "c1", number: 1, title: "ECI Act", snippet: "The ECI Act governs...", sourceType: "act" },
    ];
    act(() => {
      useChatStore.getState().setRagCitations(citations);
    });
    expect(useChatStore.getState().ragCitations).toHaveLength(1);
    expect(useChatStore.getState().ragCitations[0].title).toBe("ECI Act");
  });

  it("setRagCitations replaces existing citations", () => {
    useChatStore.setState({
      ragCitations: [{ id: "old", number: 1, title: "Old", snippet: "s", sourceType: "eci" }],
    });
    act(() => {
      useChatStore.getState().setRagCitations([]);
    });
    expect(useChatStore.getState().ragCitations).toHaveLength(0);
  });
});

describe("ChatStore — usage tracking", () => {
  it("trackUsage accumulates token counts", () => {
    act(() => {
      useChatStore.getState().trackUsage(1000, 500);
    });
    const { usage } = useChatStore.getState();
    expect(usage.totalInputTokens).toBe(1000);
    expect(usage.totalOutputTokens).toBe(500);
    expect(usage.totalRequests).toBe(1);
  });

  it("trackUsage accumulates across multiple calls", () => {
    act(() => {
      useChatStore.getState().trackUsage(500, 200);
      useChatStore.getState().trackUsage(300, 100);
    });
    const { usage } = useChatStore.getState();
    expect(usage.totalInputTokens).toBe(800);
    expect(usage.totalRequests).toBe(2);
  });

  it("trackUsage calculates estimated cost", () => {
    act(() => {
      useChatStore.getState().trackUsage(1_000_000, 1_000_000);
    });
    const { usage } = useChatStore.getState();
    // 0.15 input + 0.60 output = 0.75
    expect(usage.estimatedCostUSD).toBeCloseTo(0.75, 2);
  });
});

describe("ChatStore — error handling", () => {
  it("setError stores an error message", () => {
    act(() => {
      useChatStore.getState().setError("Network failure");
    });
    expect(useChatStore.getState().error).toBe("Network failure");
  });

  it("setError clears error when null is passed", () => {
    useChatStore.setState({ error: "some error" });
    act(() => {
      useChatStore.getState().setError(null);
    });
    expect(useChatStore.getState().error).toBeNull();
  });
});

describe("ChatStore — UI state", () => {
  it("toggleSidebar flips sidebarOpen", () => {
    useChatStore.setState({ sidebarOpen: true });
    act(() => {
      useChatStore.getState().toggleSidebar();
    });
    expect(useChatStore.getState().sidebarOpen).toBe(false);
  });

  it("setSearchQuery updates searchQuery", () => {
    act(() => {
      useChatStore.getState().setSearchQuery("EVM voting");
    });
    expect(useChatStore.getState().searchQuery).toBe("EVM voting");
  });

  it("setCurrentLanguage updates currentLanguage", () => {
    act(() => {
      useChatStore.getState().setCurrentLanguage("Hindi");
    });
    expect(useChatStore.getState().currentLanguage).toBe("Hindi");
  });
});
