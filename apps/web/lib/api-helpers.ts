import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";
import type { ZodSchema } from "zod";
import { z } from "zod";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "TEAM_NOT_FOUND"
  | "TEAM_ALREADY_EXISTS"
  | "PROJECT_NOT_FOUND"
  | "FILE_NOT_FOUND"
  | "REVISION_CONFLICT"
  | "INTERNAL_ERROR";

type JsonErrorDetails = Record<string, unknown> | undefined;

export function jsonError(
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: JsonErrorDetails,
) {
  return NextResponse.json(
    { error: { code, message, ...(details ? { details } : {}) } },
    { status },
  );
}

type RequireSessionResult = { session: Session } | { error: NextResponse };

export async function requireSession(): Promise<RequireSessionResult> {
  const session = await auth();

  if (!session) {
    return { error: jsonError(401, "UNAUTHORIZED", "Authentication required") };
  }

  return { session };
}

type RequireSameOriginResult = { ok: true } | { error: NextResponse };

/**
 * Mitigação básica de CSRF para endpoints autenticados por cookie
 *
 * - Os navegadores normalmente enviam `Origin` em requisições `POST/PUT`, se presente, force a mesma origem
 * - Clientes que não sejam navegadores (Postman/CLI) podem omitir `Origin`, permita nesse caso
 */
export function requireSameOrigin(req: Request): RequireSameOriginResult {
  const origin = req.headers.get("origin");
  if (!origin) return { ok: true };

  try {
    const expectedOrigin = new URL(req.url).origin;
    if (origin !== expectedOrigin) {
      return {
        error: jsonError(403, "FORBIDDEN", "Invalid origin", {
          origin,
          expectedOrigin,
        }),
      };
    }

    return { ok: true };
  } catch {
    return {
      error: jsonError(403, "FORBIDDEN", "Invalid origin"),
    };
  }
}

type ParseResult<T> = { data: T } | { error: NextResponse };

export async function parseBody<T>(
  req: Request,
  schema: ZodSchema<T>,
): Promise<ParseResult<T>> {
  try {
    const json = await req.json();
    const result = schema.safeParse(json);

    if (!result.success) {
      return {
        error: jsonError(400, "VALIDATION_ERROR", "Invalid request body", {
          issues: result.error.flatten(),
        }),
      };
    }

    return { data: result.data };
  } catch {
    return {
      error: jsonError(400, "VALIDATION_ERROR", "Invalid JSON body"),
    };
  }
}

export function parseQuery<T>(
  url: string,
  schema: ZodSchema<T>,
): ParseResult<T> {
  try {
    const searchParams = new URL(url).searchParams;
    const entries = Object.fromEntries(searchParams.entries());
    const result = schema.safeParse(entries);

    if (!result.success) {
      return {
        error: jsonError(400, "VALIDATION_ERROR", "Invalid query params", {
          issues: result.error.flatten(),
        }),
      };
    }

    return { data: result.data };
  } catch {
    return {
      error: jsonError(400, "VALIDATION_ERROR", "Invalid query params"),
    };
  }
}

export const uuidSchema = z
  .string()
  .uuid({ message: "Value must be a valid UUID" });
