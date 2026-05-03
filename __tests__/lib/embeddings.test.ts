/**
 * @jest-environment node
 */
import { generateEmbedding, batchEmbed } from "@/lib/ai/embeddings";

// Mock the GoogleGenAI SDK
jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      embedContent: jest.fn().mockResolvedValue({
        embeddings: [{ values: new Array(768).fill(0.1) }],
      }),
    },
  })),
}));

describe("generateEmbedding", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, GEMINI_API_KEY: "test-key-123" };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("throws if GEMINI_API_KEY is not set", async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(generateEmbedding("hello")).rejects.toThrow(
      "GEMINI_API_KEY is not set"
    );
  });

  it("returns an array of 768 numbers", async () => {
    const result = await generateEmbedding("What is EVM?");
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(768);
    expect(typeof result[0]).toBe("number");
  });

  it("handles empty string input", async () => {
    const result = await generateEmbedding("");
    expect(result).toHaveLength(768);
  });

  it("handles long text input", async () => {
    const longText = "election ".repeat(500);
    const result = await generateEmbedding(longText);
    expect(result).toHaveLength(768);
  });
});

describe("batchEmbed", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-key-123";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns embeddings for each input text", async () => {
    const texts = ["EVM", "VVPAT", "Booth"];
    const results = await batchEmbed(texts, 20, 0);
    expect(results).toHaveLength(texts.length);
    results.forEach((r) => expect(r).toHaveLength(768));
  });

  it("returns empty array for empty input", async () => {
    const results = await batchEmbed([], 20, 0);
    expect(results).toHaveLength(0);
  });

  it("processes in correct batch sizes", async () => {
    const { GoogleGenAI } = require("@google/genai");
    const mockEmbedContent = jest.fn().mockResolvedValue({
      embeddings: [{ values: new Array(768).fill(0.5) }],
    });
    GoogleGenAI.mockImplementation(() => ({
      models: { embedContent: mockEmbedContent },
    }));

    const texts = Array.from({ length: 5 }, (_, i) => `text ${i}`);
    await batchEmbed(texts, 3, 0);
    // 5 texts means 5 individual calls (batchEmbed calls generateEmbedding per text)
    expect(mockEmbedContent).toHaveBeenCalledTimes(5);
  });
});
