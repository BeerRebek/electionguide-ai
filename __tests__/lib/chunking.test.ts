import { chunkText, type Chunk } from "@/lib/ai/chunking";

describe("chunkText()", () => {
  it("returns empty array for empty string", () => {
    expect(chunkText("")).toEqual([]);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(chunkText("   \n\n   ")).toEqual([]);
  });

  it("returns a single chunk for short text", () => {
    const text = "This is a short piece of text.";
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0].index).toBe(0);
    expect(chunks[0].text).toBe(text);
  });

  it("chunk has correct metadata shape", () => {
    const text = "Hello world paragraph.";
    const chunks = chunkText(text);
    expect(chunks[0]).toMatchObject<Partial<Chunk>>({
      index: 0,
      metadata: {
        startChar: expect.any(Number) as number,
        endChar: expect.any(Number) as number,
      },
    });
  });

  it("produces multiple chunks for large text", () => {
    // ~500 token limit = ~2000 chars; create text bigger than that
    const longText = Array.from({ length: 20 }, (_, i) => `Paragraph ${i + 1}: ${"word ".repeat(60)}`).join("\n\n");
    const chunks = chunkText(longText);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it("chunk indices are sequential", () => {
    const longText = Array.from({ length: 20 }, (_, i) => `Para ${i}: ${"text ".repeat(80)}`).join("\n\n");
    const chunks = chunkText(longText);
    chunks.forEach((chunk, i) => {
      expect(chunk.index).toBe(i);
    });
  });

  it("extracts markdown section header into metadata", () => {
    const text = "## Voter Registration\n\nTo register, visit eci.gov.in and fill Form 6.";
    const chunks = chunkText(text);
    expect(chunks[0].metadata.section).toBe("Voter Registration");
  });

  it("returns no section metadata when no heading present", () => {
    const text = "Plain text without any markdown headings.";
    const chunks = chunkText(text);
    expect(chunks[0].metadata.section).toBeUndefined();
  });

  it("respects custom maxTokens parameter", () => {
    // 10 tokens ≈ 40 chars; each paragraph is ~100 chars
    const text = Array.from({ length: 10 }, (_, i) => `Para ${i}: ${"word ".repeat(10)}`).join("\n\n");
    const chunksSmall = chunkText(text, 10);
    const chunksLarge = chunkText(text, 5000);
    expect(chunksSmall.length).toBeGreaterThan(chunksLarge.length);
  });
});
