"use client";

import { isApiError } from "@/lib/utils";

export const MAX_TECHNICAL_DETAILS_LENGTH = 12_000;

const sensitiveKeywords = [
  "token",
  "access_token",
  "refresh_token",
  "id_token",
  "jwt",
  "bearer",
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "passwd",
  "secret",
  "client_secret",
  "private_key",
  "apikey",
  "api-key",
  "credentials",
  "session",
  "sessionid",
  "csrf",
  "xsrf",
  "signature",
];

const requestIdKeys = ["requestId", "traceId", "correlationId"];

const looksLikeJwt = (v: unknown) =>
  typeof v === "string" &&
  /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(v);

const looksLikeBearer = (v: unknown) =>
  typeof v === "string" && /^bearer\s+/i.test(v);

export const safeStringify = (
  value: unknown,
  opts?: { maxLength?: number }
): string => {
  const maxLength = opts?.maxLength ?? MAX_TECHNICAL_DETAILS_LENGTH;

  try {
    const seen = new WeakSet<object>();
    let str = JSON.stringify(
      value,
      (_, v) => {
        if (typeof v === "object" && v !== null) {
          if (seen.has(v)) return "[Circular]";
          seen.add(v);
        }
        return v;
      },
      2
    );

    if (str.length > maxLength) {
      str = str.slice(0, maxLength) + "\n… (truncated)";
    }
    return str;
  } catch {
    return "Falha ao serializar os detalhes técnicos.";
  }
};

const redactDeep = (value: unknown): unknown => {
  if (value === null || value === undefined) return value;
  if (looksLikeJwt(value) || looksLikeBearer(value)) return "[REDACTED]";

  if (Array.isArray(value)) return value.map((item) => redactDeep(item));

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeywords.some((kw) => lowerKey.includes(kw));
      sanitized[key] = isSensitive ? "[REDACTED]" : redactDeep(val);
    }

    return sanitized;
  }

  if (typeof value === "string") {
    if (looksLikeJwt(value) || looksLikeBearer(value)) return "[REDACTED]";
  }

  return value;
};

const extractRequestId = (value: unknown) => {
  if (!value || typeof value !== "object") return undefined;
  const obj = value as Record<string, unknown>;

  for (const key of requestIdKeys) {
    if (obj[key]) return obj[key];
  }

  if (obj.metadata && typeof obj.metadata === "object") {
    for (const key of requestIdKeys) {
      const metaVal = (obj.metadata as Record<string, unknown>)[key];
      if (metaVal) return metaVal;
    }
  }

  return undefined;
};

const getApiErrorCore = (value: unknown) => {
  if (!isApiError(value)) return null;
  return value.error ?? null;
};

/**
 * Resumo seguro (pode aparecer mesmo quando debug=false).
 * NÃO inclui details completos; ideal para prod/flag off.
 */
export const sanitizeErrorForSummary = (
  value: unknown
): Record<string, unknown> | null => {
  if (!value) return null;
  if (typeof value === "string") return { message: value };

  const sanitized: Record<string, unknown> = {};

  if (value instanceof Error) {
    sanitized.name = value.name;
    sanitized.message = value.message;

    const anyErr = value as unknown as { cause?: unknown };
    if (anyErr.cause !== undefined) sanitized.cause = redactDeep(anyErr.cause);
  }

  const apiErr = getApiErrorCore(value);
  if (apiErr) {
    if (apiErr.code) sanitized.code = apiErr.code;
    if (apiErr.message) sanitized.message = apiErr.message;
    if ("publicMessage" in apiErr && apiErr.publicMessage !== undefined) {
      sanitized.publicMessage = redactDeep(apiErr.publicMessage);
    }
  }

  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    if (obj.status !== undefined) sanitized.status = redactDeep(obj.status);
    if (
      obj.publicMessage !== undefined &&
      sanitized.publicMessage === undefined
    ) {
      sanitized.publicMessage = redactDeep(obj.publicMessage);
    }
  }

  const requestId = extractRequestId(value);
  if (requestId) sanitized.requestId = requestId;

  return Object.keys(sanitized).length ? sanitized : null;
};

/**
 * Verbose sanitizado (apenas quando debug=true).
 * Inclui details/cause completos (ainda redigidos).
 */
export const sanitizeErrorForVerboseDisplay = (
  value: unknown
): Record<string, unknown> | null => {
  const base = sanitizeErrorForSummary(value) ?? {};

  const apiErr = getApiErrorCore(value);
  if (apiErr && "details" in apiErr && apiErr.details !== undefined) {
    base.details = redactDeep(apiErr.details);
  }

  // campos seguros no root, se existirem
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    const allowedFields = ["cause", "details"] as const;

    for (const field of allowedFields) {
      if (obj[field] !== undefined && base[field] === undefined) {
        base[field] = redactDeep(obj[field]);
      }
    }
  }

  return Object.keys(base).length ? base : null;
};

export const looksLikeBearerToken = looksLikeBearer;
export const looksLikeJwtToken = looksLikeJwt;
