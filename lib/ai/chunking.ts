export interface Chunk {
  text: string;
  index: number;
  metadata: {
    startChar: number;
    endChar: number;
    section?: string;
  };
}

/**
 * Chunk text into overlapping segments.
 *
 * @param text - The full text to chunk
 * @param maxTokens - Approximate max tokens per chunk (1 token ≈ 4 chars)
 * @param overlapTokens - Overlap between chunks
 */
export function chunkText(
  text: string,
  maxTokens = 500,
  overlapTokens = 50
): Chunk[] {
  const maxChars = maxTokens * 4; // ~4 chars per token
  const overlapChars = overlapTokens * 4;

  // Clean up whitespace
  const cleanText = text.replace(/\r\n/g, "\n").trim();
  if (!cleanText) return [];

  // Split by paragraph boundaries first for better semantic chunks
  const paragraphs = cleanText.split(/\n\n+/);
  const chunks: Chunk[] = [];
  let currentChunk = "";
  let chunkStart = 0;
  let charPos = 0;
  let idx = 0;

  for (const para of paragraphs) {
    const paraWithBreak = para + "\n\n";

    if (currentChunk.length + paraWithBreak.length > maxChars && currentChunk.length > 0) {
      // Flush current chunk
      chunks.push({
        text: currentChunk.trim(),
        index: idx++,
        metadata: {
          startChar: chunkStart,
          endChar: chunkStart + currentChunk.length,
          section: extractSectionHeader(currentChunk),
        },
      });

      // Start new chunk with overlap from end of previous
      const overlapText = currentChunk.slice(-overlapChars);
      chunkStart = charPos - overlapText.length;
      currentChunk = overlapText;
    }

    currentChunk += paraWithBreak;
    charPos += paraWithBreak.length;
  }

  // Final chunk
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      index: idx,
      metadata: {
        startChar: chunkStart,
        endChar: chunkStart + currentChunk.length,
        section: extractSectionHeader(currentChunk),
      },
    });
  }

  return chunks;
}

/**
 * Extract section header from chunk text (e.g., ## Section Title).
 */
function extractSectionHeader(text: string): string | undefined {
  const match = text.match(/^#{1,3}\s+(.+)$/m);
  return match?.[1];
}
