import { ApiReference } from "@scalar/nextjs-api-reference";
import type { HtmlRenderingConfiguration } from "@scalar/types/api-reference";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const config: Partial<HtmlRenderingConfiguration> = {
  title: "ERP Screen Builder API",
  darkMode: true,
  layout: "modern",
  searchHotKey: "k",
  hideModels: false,
  url: "/api/openapi",
};

export const GET =
  process.env.NODE_ENV === "development"
    ? ApiReference(config)
    : () =>
        NextResponse.json(
          {
            error: {
              code: "NOT_FOUND",
              message: "Docs are available only in development",
            },
          },
          { status: 404 }
        );
