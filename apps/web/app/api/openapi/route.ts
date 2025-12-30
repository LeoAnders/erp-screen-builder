import { NextResponse } from "next/server";
import { getOpenApiDocument } from "@/lib/openapi";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "API docs are available only in development",
        },
      },
      { status: 404 },
    );
  }

  const document = getOpenApiDocument();
  return NextResponse.json(document);
}
