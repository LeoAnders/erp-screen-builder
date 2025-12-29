import { describe, expect, it, afterEach } from "vitest";

import {
  sanitizeErrorForVerboseDisplay,
  safeStringify,
} from "../../lib/errors/sanitize";
import { shouldShowTechnicalDetails } from "../../lib/errors/debug";

describe("sanitizeErrorForVerboseDisplay", () => {
  it("redacts sensitive keys", () => {
    const result = sanitizeErrorForVerboseDisplay({
      details: { token: "abc", nested: { password: "secret" } },
      status: 500,
    });

    expect(result?.details).toMatchObject({
      token: "[REDACTED]",
      nested: { password: "[REDACTED]" },
    });
    expect(result?.status).toBe(500);
  });

  it("redacts bearer/JWT-looking values even without sensitive keys", () => {
    const result = sanitizeErrorForVerboseDisplay({
      details: {
        message: "bearer abcdef",
        trace: "aaa.bbb.ccc",
      },
    });

    expect(result?.details).toEqual({
      message: "[REDACTED]",
      trace: "[REDACTED]",
    });
  });

  it("extracts requestId/traceId", () => {
    const result = sanitizeErrorForVerboseDisplay({
      status: 400,
      requestId: "req-123",
      metadata: { traceId: "trace-999" },
    });

    expect(result?.requestId).toBe("req-123");
  });

  it("handles API error shape", () => {
    const result = sanitizeErrorForVerboseDisplay({
      error: { code: "X", message: "Public error", debug: "should hide" },
    });

    expect(result).toMatchObject({
      code: "X",
      message: "Public error",
    });
    expect(result?.error).toBeUndefined();
  });
});

describe("safeStringify", () => {
  it("is circular-safe", () => {
    const obj: Record<string, unknown> = {};
    obj.self = obj;
    const str = safeStringify(obj);
    expect(str).toContain("[Circular]");
  });

  it("truncates when exceeding max length", () => {
    const longStr = "a".repeat(13_000);
    const maxLength = 100;
    const suffix = "\n… (truncated)";
    const str = safeStringify(longStr, { maxLength });
    expect(str.length).toBeLessThanOrEqual(maxLength + suffix.length);
    expect(str).toContain("(truncated)");
  });
});

describe("shouldShowTechnicalDetails", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns true in dev when flag is on", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "development",
      NEXT_PUBLIC_ERROR_DEBUG: "true",
      NEXT_PUBLIC_VERCEL_ENV: "development",
    };

    expect(shouldShowTechnicalDetails()).toBe(true);
  });

  it("returns false in dev when flag is off", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "development",
      NEXT_PUBLIC_ERROR_DEBUG: "false",
      NEXT_PUBLIC_VERCEL_ENV: "development",
    };

    expect(shouldShowTechnicalDetails()).toBe(false);
  });

  it("returns false in production even with flag", () => {
    process.env = {
      ...process.env,
      NODE_ENV: "production",
      NEXT_PUBLIC_ERROR_DEBUG: "true",
      NEXT_PUBLIC_VERCEL_ENV: "production",
    };

    expect(shouldShowTechnicalDetails()).toBe(false);
  });
});
