import { NextRequest } from "next/server";
import { streamChatResponse } from "@/lib/ai/gemini";
import { hybridSearch, formatContextForPrompt, buildCitations } from "@/lib/ai/retrieval";
import { translateQueryForRetrieval } from "@/lib/ai/translate";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Rate Limiter (in-memory LRU) ─────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // requests per window

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}, 300_000);

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

// ── Input Validation ─────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 2000;

function validateInput(body: unknown): { valid: boolean; error?: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body is required" };
  }

  const { messages } = body as { messages?: unknown };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return { valid: false, error: "Messages must be a non-empty array" };
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage?.content || typeof lastMessage.content !== "string") {
    return { valid: false, error: "Last message must have string content" };
  }

  if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  // Basic injection sanitization — strip dangerous patterns
  const dangerous = /<script|javascript:|on\w+=/i;
  if (dangerous.test(lastMessage.content)) {
    return { valid: false, error: "Message contains disallowed content" };
  }

  return { valid: true };
}

// ── Main Handler ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // ── 1. Authentication ──────────────────────────────────
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // ── 2. Rate Limiting ───────────────────────────────────
    const { allowed, remaining, resetAt } = checkRateLimit(user.id);

    if (!allowed) {
      return Response.json(
        { error: "Rate limit exceeded. Please wait before sending more messages." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
          },
        }
      );
    }

    // ── 3. Input Validation ────────────────────────────────
    const body = await req.json();
    const validation = validateInput(body);

    if (!validation.valid) {
      return Response.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { messages, language = "English", sessionId } = body as {
      messages: Array<{ role: string; content: string }>;
      language?: string;
      sessionId?: string;
    };

    // ── 4. Load User Context ───────────────────────────────
    let userContext = "";
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("language_pref, state, voter_status, constituency_id, age_range")
        .eq("id", user.id)
        .single();

      if (profile) {
        const parts: string[] = [];
        if (profile.state) parts.push(`User is from ${profile.state}`);
        if (profile.voter_status) parts.push(`Voter status: ${profile.voter_status}`);
        if (profile.age_range) parts.push(`Age group: ${profile.age_range}`);
        if (parts.length > 0) {
          userContext = `\n\n[User Context: ${parts.join(". ")}]`;
        }
      }
    } catch {
      // Non-fatal — proceed without user context
    }

    // ── 5. RAG: Retrieve relevant context ──────────────────
    const latestUserMessage = messages[messages.length - 1].content;
    let ragContext = "";
    let citations: ReturnType<typeof buildCitations> = [];

    try {
      const { translatedQuery } = await translateQueryForRetrieval(
        latestUserMessage,
        language
      );

      const chunks = await hybridSearch(translatedQuery, {
        matchCount: 6,
        vectorWeight: 0.7,
        keywordWeight: 0.3,
      });

      if (chunks.length > 0) {
        ragContext = formatContextForPrompt(chunks) + userContext;
        citations = buildCitations(chunks);
      }
    } catch (ragError) {
      console.warn("RAG retrieval failed, proceeding without context:", ragError);
    }

    // ── 6. Stream Response ─────────────────────────────────
    const encoder = new TextEncoder();
    let totalOutputChars = 0;
    const inputChars = messages.reduce(
      (sum: number, m: { content?: string }) => sum + (m.content?.length || 0),
      0
    );

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send citations first
          if (citations.length > 0) {
            const citationEvent = `data: ${JSON.stringify({ citations })}\n\n`;
            controller.enqueue(encoder.encode(citationEvent));
          }

          // Stream AI response
          for await (const chunk of streamChatResponse(
            messages,
            language,
            ragContext || userContext
          )) {
            totalOutputChars += chunk.length;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          }

          // Send usage metadata
          const inputTokens = Math.ceil(inputChars / 4);
          const outputTokens = Math.ceil(totalOutputChars / 4);

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            usage: {
              inputTokens,
              outputTokens,
              model: "gemini-2.5-flash",
            },
          })}\n\n`));

          // ── 7. Log Usage (fire-and-forget) ─────────────────
          const latencyMs = Date.now() - startTime;
          supabase.from("ai_usage_logs").insert({
            user_id: user.id,
            session_id: sessionId || null,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            model: "gemini-2.5-flash",
            latency_ms: latencyMs,
          }).then(({ error: logError }) => {
            if (logError) console.warn("Usage log failed:", logError);
          });

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error";
    return Response.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
