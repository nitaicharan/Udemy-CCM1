import { describe, it, expect } from "vitest";
import { generateCodename } from "@/lib/utils/codename";

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    expect(generateCodename().length).toBeGreaterThan(0);
  });

  it("matches PascalCase pattern with 3 words", () => {
    const codename = generateCodename();
    expect(codename).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+$/);
  });

  it("generates different values across multiple calls", () => {
    const results = new Set(
      Array.from({ length: 10 }, () => generateCodename()),
    );
    expect(results.size).toBeGreaterThanOrEqual(8);
  });
});
