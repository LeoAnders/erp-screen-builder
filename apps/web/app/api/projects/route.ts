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

const querySchema = z.object({
  teamId: uuidSchema,
});

export async function GET(req: Request) {
  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  const parsedQuery = parseQuery(req.url, querySchema);
  if ("error" in parsedQuery) return parsedQuery.error;

  try {
    const items = await prisma.project.findMany({
      where: { teamId: parsedQuery.data.teamId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ items });
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
    const team = await prisma.team.findUnique({
      where: { id: parsed.data.teamId },
    });

    if (!team) {
      return jsonError(404, "TEAM_NOT_FOUND", "Team not found");
    }

    const project = await prisma.project.create({
      data: {
        teamId: parsed.data.teamId,
        name: parsed.data.name,
        description: parsed.data.description,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("[POST /api/projects] error", error);
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
