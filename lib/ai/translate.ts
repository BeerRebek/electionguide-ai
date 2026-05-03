import { GoogleGenAI } from "@google/genai";

/**
 * Translate a non-English query to English for RAG retrieval.
 * Uses Gemini Flash for fast, cost-efficient translation.
 * Returns the original query if already in English.
 */
export async function translateQueryForRetrieval(
  query: string,
  sourceLanguage: string = "English"
): Promise<{ translatedQuery: string; wasTranslated: boolean }> {
  // Skip translation if already English
  if (
    sourceLanguage === "English" ||
    sourceLanguage === "en" ||
    /^[\x00-\x7F]*$/.test(query) // ASCII-only = likely English
  ) {
    return { translatedQuery: query, wasTranslated: false };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { translatedQuery: query, wasTranslated: false };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Translate this election-related query from ${sourceLanguage} to English. 
Preserve all technical terms like Form numbers (Form 6, Form 17C), Act names (RP Act), 
Section numbers, and ECI-specific terms in English.
Only output the translated text, nothing else.

Query: ${query}`,
      config: {
        temperature: 0.1,
        maxOutputTokens: 200,
      },
    });

    const translated = result.text?.trim();
    if (translated && translated.length > 0) {
      return { translatedQuery: translated, wasTranslated: true };
    }
  } catch (error) {
    console.warn("Translation failed, using original query:", error);
  }

  return { translatedQuery: query, wasTranslated: false };
}
