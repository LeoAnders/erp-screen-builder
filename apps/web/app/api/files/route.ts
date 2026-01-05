import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createFileSchema } from "@/lib/validators";
import { sanitizeName } from "@/lib/text";
import {
  jsonError,
  parseBody,
  parseQuery,
  requireSameOrigin,
  requireSession,
  uuidSchema,
} from "@/lib/api-helpers";
import { getSchemaDefaults } from "@/lib/schemaDefaults";
import { getSessionUserId } from "@/lib/session";

const querySchema = z.object({
  projectId: uuidSchema,
});

export async function GET(req: Request) {
  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  const parsedQuery = parseQuery(req.url, querySchema);
  if ("error" in parsedQuery) return parsedQuery.error;

  const userId = await getSessionUserId(sessionResult.session);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "User not found");
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: parsedQuery.data.projectId },
      include: { team: true },
    });

    if (!project) {
      return jsonError(404, "PROJECT_NOT_FOUND", "Project not found");
    }

    if (project.team.type === "personal" && project.team.ownerId !== userId) {
      return jsonError(403, "FORBIDDEN", "Access denied to this project");
    }

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

    const payload = items.map((file) => ({
      id: file.id,
      name: file.name,
      projectId: parsedQuery.data.projectId,
      template: file.template,
      revision: file.revision,
      updatedAt: file.updatedAt,
      editedBy: file.updatedBy ? { name: file.updatedBy } : null,
    }));

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        teamId: project.teamId,
      },
      items: payload,
    });
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
    const userId = await getSessionUserId(sessionResult.session);
    if (!userId) {
      return jsonError(401, "UNAUTHORIZED", "User not found");
    }

    const project = await prisma.project.findUnique({
      where: { id: parsed.data.projectId },
      include: { team: true },
    });

    if (!project) {
      return jsonError(404, "PROJECT_NOT_FOUND", "Project not found");
    }

    if (project.team.type === "personal" && project.team.ownerId !== userId) {
      return jsonError(
        403,
        "FORBIDDEN",
        "Cannot write to another user's personal team",
      );
    }

    const defaults = getSchemaDefaults(parsed.data.template);
    const name = parsed.data.name ? sanitizeName(parsed.data.name) : undefined;

    const file = await prisma.file.create({
      data: {
        projectId: parsed.data.projectId,
        ...(name ? { name } : {}),
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
