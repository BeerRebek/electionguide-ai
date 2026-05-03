import { GoogleGenAI } from "@google/genai";

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;

/**
 * Generate a single embedding vector using Google's text-embedding-004.
 */
export async function generateEmbedding(
  text: string
): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const ai = new GoogleGenAI({ apiKey });

  const result = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: { outputDimensionality: EMBEDDING_DIMENSIONS },
  });

  if (!result.embeddings || !result.embeddings[0]?.values) {
    throw new Error("No embedding returned from API");
  }

  return result.embeddings[0].values;
}

/**
 * Batch-generate embeddings for multiple texts.
 * Processes in batches of 20 with rate limiting.
 */
export async function batchEmbed(
  texts: string[],
  batchSize = 20,
  delayMs = 200
): Promise<number[][]> {
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((text) => generateEmbedding(text))
    );
    results.push(...batchResults);

    // Rate limit
    if (i + batchSize < texts.length) {
      await new Promise((r) => setTimeout(r, delayMs));
    }

    const progress = Math.min(i + batchSize, texts.length);
    console.log(`  📊 Embedded ${progress}/${texts.length} chunks`);
  }

  return results;
}
