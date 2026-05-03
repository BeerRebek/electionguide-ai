import { cn } from "@/lib/utils/cn";

describe("cn() - className utility", () => {
  it("returns a single class unchanged", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("merges multiple class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("ignores falsy values", () => {
    expect(cn("text-sm", false, undefined, null, "font-bold")).toBe(
      "text-sm font-bold"
    );
  });

  it("handles conditional class objects", () => {
    const isActive = true;
    expect(cn("base", { "bg-blue-500": isActive, "bg-gray-200": !isActive })).toBe(
      "base bg-blue-500"
    );
  });

  it("handles arrays of classes", () => {
    expect(cn(["flex", "items-center"], "gap-4")).toBe("flex items-center gap-4");
  });

  it("returns empty string for no input", () => {
    expect(cn()).toBe("");
  });

  it("merges padding shorthand vs longhand correctly", () => {
    // twMerge resolves: px-2 px-4 → px-4 (last wins)
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
