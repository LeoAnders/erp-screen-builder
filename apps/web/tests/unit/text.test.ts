import { describe, expect, it } from "vitest";

import { normalizeName } from "../../lib/text";

describe("normalizeName", () => {
  it("normalizes accents and spacing", () => {
    const normalized = normalizeName("  São   João  ");
    expect(normalized).toBe("sao joao");
  });
});
