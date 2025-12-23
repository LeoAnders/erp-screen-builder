import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createFileSchema } from "@/lib/validators";
import {
  jsonError,
  parseBody,
  parseQuery,
  requireSameOrigin,
  requireSession,
  uuidSchema,
} from "@/lib/api-helpers";
import { getSchemaDefaults } from "@/lib/schemaDefaults";

const querySchema = z.object({
  projectId: uuidSchema,
});

export async function GET(req: Request) {
  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  const parsedQuery = parseQuery(req.url, querySchema);
  if ("error" in parsedQuery) return parsedQuery.error;

  try {
    const items = await prisma.file.findMany({
      where: { projectId: parsedQuery.data.projectId },
      select: {
        id: true,
        name: true,
        template: true,
        revision: true,
        updatedAt: true,
        updatedBy: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[GET /api/files] error", error);
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}

export async function POST(req: Request) {
  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  const originCheck = requireSameOrigin(req);
  if ("error" in originCheck) return originCheck.error;

  const parsed = await parseBody(req, createFileSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const project = await prisma.project.findUnique({
      where: { id: parsed.data.projectId },
      select: { id: true },
    });

    if (!project) {
      return jsonError(404, "PROJECT_NOT_FOUND", "Project not found");
    }

    const defaults = getSchemaDefaults(parsed.data.template);

    const file = await prisma.file.create({
      data: {
        projectId: parsed.data.projectId,
        name: parsed.data.name,
        template: parsed.data.template,
        schemaJson: defaults as Prisma.InputJsonValue,
        schemaVersion: defaults.schemaVersion,
      },
    });

    return NextResponse.json({ file });
  } catch (error) {
    console.error("[POST /api/files] error", error);
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
