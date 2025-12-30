import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validators";
import {
  jsonError,
  parseBody,
  parseQuery,
  requireSameOrigin,
  requireSession,
  uuidSchema,
} from "@/lib/api-helpers";
import { getSessionUserId } from "@/lib/session";

const querySchema = z.object({
  teamId: uuidSchema,
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
    const team = await prisma.team.findUnique({
      where: { id: parsedQuery.data.teamId },
    });

    if (!team) {
      return jsonError(404, "TEAM_NOT_FOUND", "Team not found");
    }

    if (team.type === "personal" && team.ownerId !== userId) {
      return jsonError(403, "FORBIDDEN", "Access denied to this team");
    }

    const items = await prisma.project.findMany({
      where: { teamId: parsedQuery.data.teamId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { files: true } },
        files: {
          select: { id: true, name: true, template: true },
          orderBy: { updatedAt: "desc" },
          take: 4,
        },
      },
    });

    const payload = items.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      teamId: project.teamId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      fileCount: project._count.files,
      previews: project.files.map((file) => ({
        id: file.id,
        name: file.name,
        template: file.template,
      })),
    }));

    return NextResponse.json({ items: payload });
  } catch (error) {
    console.error("[GET /api/projects] error", error);
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}

export async function POST(req: Request) {
  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  const originCheck = requireSameOrigin(req);
  if ("error" in originCheck) return originCheck.error;

  const parsed = await parseBody(req, createProjectSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const userId = await getSessionUserId(sessionResult.session);
    if (!userId) {
      return jsonError(401, "UNAUTHORIZED", "User not found");
    }

    const team = await prisma.team.findUnique({
      where: { id: parsed.data.teamId },
    });

    if (!team) {
      return jsonError(404, "TEAM_NOT_FOUND", "Team not found");
    }

    if (team.type === "personal" && team.ownerId !== userId) {
      return jsonError(
        403,
        "FORBIDDEN",
        "Cannot write to another user's personal team",
      );
    }

    const project = await prisma.project.create({
      data: {
        teamId: parsed.data.teamId,
        name: parsed.data.name,
        description: parsed.data.description,
      },
    });

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        teamId: project.teamId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        fileCount: 0,
        previews: [],
      },
    });
  } catch (error) {
    console.error("[POST /api/projects] error", error);
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
