import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTeamSchema } from "@/lib/validators";
import {
  jsonError,
  parseBody,
  requireSameOrigin,
  requireSession,
} from "@/lib/api-helpers";
import { getSessionUserId } from "@/lib/session";

async function findOrCreatePersonalTeam(userId: string) {
  let team = await prisma.team.findFirst({
    where: { ownerId: userId, type: "personal" },
  });

  if (team) return team;

  try {
    team = await prisma.team.create({
      data: {
        name: "Meu Time",
        ownerId: userId,
        type: "personal",
        visibility: "private",
      },
    });
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    if (code === "P2002") {
      team = await prisma.team.findFirst({
        where: { ownerId: userId, type: "personal" },
      });
    } else {
      throw error;
    }
  }

  if (!team) {
    throw new Error("Failed to create personal team");
  }

  return team;
}

export async function GET() {
  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  const userId = await getSessionUserId(sessionResult.session);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "User not found");
  }

  try {
    const personalTeam = await findOrCreatePersonalTeam(userId);
    const publicTeams = await prisma.team.findMany({
      where: { visibility: "public" },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ items: [personalTeam, ...publicTeams] });
  } catch (error) {
    console.error("[GET /api/teams] error", error);
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}

export async function POST(req: Request) {
  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  const originCheck = requireSameOrigin(req);
  if ("error" in originCheck) return originCheck.error;

  const parsed = await parseBody(req, createTeamSchema);
  if ("error" in parsed) return parsed.error;

  const userId = await getSessionUserId(sessionResult.session);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "User not found");
  }

  try {
    const team = await prisma.team.create({
      data: {
        name: parsed.data.name,
        ownerId: userId,
        type: "normal",
        visibility: "public",
      },
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error("[POST /api/teams] error", error);
    const code = (error as { code?: string } | null)?.code;
    if (code === "P2002") {
      return jsonError(409, "TEAM_ALREADY_EXISTS", "Team name already exists");
    }
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
