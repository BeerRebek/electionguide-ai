import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are ElectionGuide AI, an expert assistant on Indian electoral processes. You are authoritative, neutral, and deeply knowledgeable about the Election Commission of India (ECI), voter registration, EVMs, VVPATs, and all election-related procedures.

ALWAYS structure responses in the Bite-Snack-Meal framework:

🍿 **Quick Answer**: [1-2 sentence essential answer in simple language]

🥪 **Key Details**: [1 paragraph with important context and specifics]

🍽️ **Full Explanation**:
[Comprehensive answer organized in clear sections with:
- Step-by-step processes where applicable
- Specific form numbers (Form 6, Form 6A, Form 8, etc.)
- Relevant legal provisions
- Timelines and deadlines]

📚 **Legal References**: [Cite specific Acts, Sections, and Rules such as:
- Representation of the People Act, 1950 & 1951
- Conduct of Elections Rules, 1961
- Registration of Electors Rules, 1960
- Model Code of Conduct guidelines
- ECI circulars and orders]

🔗 **Sources**: [Official ECI documents, manuals, and websites]

LANGUAGE RULES:
- Respond in the user's preferred language when specified
- Support all 15 Indian languages: Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Maithili, Sanskrit, English
- When responding in Indian languages, use the native script

CRITICAL RULES:
- NEVER show political bias or predict election outcomes
- NEVER share unverified information
- ALWAYS cite official sources
- Be helpful and encouraging about civic participation
- Explain complex legal language in simple terms
- If unsure, say so and direct to official ECI resources at eci.gov.in`;

/**
 * Create a streaming chat response using Gemini Pro.
 * Returns an async generator that yields text chunks.
 */
export async function* streamChatResponse(
  messages: { role: string; content: string }[],
  language: string = "English",
  ragContext: string = ""
): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    yield "⚠️ **Configuration Required**: The Gemini API key is not configured. Please add `GEMINI_API_KEY` to your `.env.local` file to enable AI responses.\n\nIn the meantime, here are some helpful resources:\n- [Election Commission of India](https://eci.gov.in)\n- [National Voters' Service Portal](https://voters.eci.gov.in)\n- [Voter Helpline: 1950](tel:1950)";
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  const languageInstruction =
    language !== "English"
      ? `\n\nIMPORTANT: The user prefers ${language}. Respond entirely in ${language} using the appropriate script. Only use English for legal terms, form numbers, and official names that don't have standard translations.`
      : "";

  const ragInstruction = ragContext
    ? `\n\nOFFICIAL KNOWLEDGE BASE CONTEXT:\nUse the following verified sources to ground your answer. Cite [Source N] when referencing information from these sources.\n\n${ragContext}\n\nIMPORTANT: Base your answer primarily on the above sources. If the sources don't cover the question fully, acknowledge this and supplement with your general knowledge, clearly noting which parts come from verified sources vs general knowledge.`
    : "";

  const formattedHistory = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        ...formattedHistory,
        {
          role: "user" as const,
          parts: [{ text: lastMessage.content }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT + languageInstruction + ragInstruction,
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("429") || errorMessage.includes("rate")) {
      yield "\n\n⚠️ **Rate limit reached**. Please wait a moment and try again.";
    } else if (
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      yield "\n\n⚠️ **Authentication error**. Please check your Gemini API key configuration.";
    } else {
      yield `\n\n⚠️ **Error**: ${errorMessage}. Please try again.`;
    }
  }
}

/**
 * Extract citations from AI response text.
 * Looks for patterns like [1], [2], etc. and legal references.
 */
export function extractCitations(text: string) {
  const citations: {
    number: number;
    title: string;
    snippet: string;
    sourceType: "act" | "rule" | "manual" | "eci" | "website";
    domain?: string;
  }[] = [];

  // Extract legal references
  const legalPatterns = [
    {
      pattern: /Representation of the People Act,?\s*(\d{4})/gi,
      title: "Representation of the People Act",
      type: "act" as const,
    },
    {
      pattern: /Conduct of Elections Rules,?\s*(\d{4})/gi,
      title: "Conduct of Elections Rules",
      type: "rule" as const,
    },
    {
      pattern: /Registration of Electors Rules,?\s*(\d{4})/gi,
      title: "Registration of Electors Rules",
      type: "rule" as const,
    },
    {
      pattern: /Model Code of Conduct/gi,
      title: "Model Code of Conduct",
      type: "manual" as const,
    },
    {
      pattern: /Section\s+(\d+[A-Z]?)/gi,
      title: "Legal Section Reference",
      type: "act" as const,
    },
    {
      pattern: /Form\s+(\d+[A-Z]?)/gi,
      title: "Election Form",
      type: "eci" as const,
    },
  ];

  let num = 1;
  for (const { pattern, title, type } of legalPatterns) {
    const match = pattern.exec(text);
    if (match) {
      citations.push({
        number: num++,
        title: match[1] ? `${title}, ${match[1]}` : title,
        snippet: `Referenced in the AI response for electoral guidance.`,
        sourceType: type,
        domain: "eci.gov.in",
      });
    }
  }

  // Always add ECI as a source
  if (citations.length === 0) {
    citations.push({
      number: 1,
      title: "Election Commission of India",
      snippet:
        "Official source for all Indian election-related information and procedures.",
      sourceType: "eci",
      domain: "eci.gov.in",
    });
  }

  return citations;
}
