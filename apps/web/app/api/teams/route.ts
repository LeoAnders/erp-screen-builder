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
import { normalizeName, sanitizeName } from "@/lib/text";

const teamSelect = {
  id: true,
  name: true,
  visibility: true,
  type: true,
  ownerId: true,
  isFavorite: true,
  createdAt: true,
  updatedAt: true,
};

async function findOrCreatePersonalTeam(userId: string) {
  const scopeKey = `private:${userId}`;
  const normalizedName = normalizeName(sanitizeName("Meu Time"));

  let team = await prisma.team.findFirst({
    where: { scopeKey, type: "personal" },
    select: teamSelect,
  });

  if (team) return team;

  try {
    team = await prisma.team.create({
      data: {
        name: "Meu Time",
        nameNormalized: normalizedName,
        scopeKey,
        ownerId: userId,
        createdById: userId,
        type: "personal",
        visibility: "private",
      },
      select: teamSelect,
    });
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    if (code === "P2002") {
      team = await prisma.team.findFirst({
        where: { scopeKey, type: "personal" },
        select: teamSelect,
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
      where: { scopeKey: "public", visibility: "public" },
      orderBy: { nameNormalized: "asc" },
      select: teamSelect,
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
    const name = sanitizeName(parsed.data.name);
    if (!name) {
      return jsonError(400, "INVALID_NAME", "Nome é obrigatório");
    }

    const nameNormalized = normalizeName(parsed.data.name);
    const scopeKey = "public";

    const existing = await prisma.team.findFirst({
      where: { scopeKey, nameNormalized },
      select: { id: true },
    });

    if (existing) {
      return jsonError(
        409,
        "TEAM_ALREADY_EXISTS",
        "Já existe um time com este nome neste escopo.",
        { field: "name" }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        nameNormalized,
        scopeKey,
        createdById: userId,
        ownerId: null,
        type: "normal",
        visibility: "public",
      },
      select: teamSelect,
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error("[POST /api/teams] error", error);
    const code = (error as { code?: string } | null)?.code;
    if (code === "P2002") {
      return jsonError(
        409,
        "TEAM_ALREADY_EXISTS",
        "Já existe um time com este nome neste escopo.",
        { field: "name" }
      );
    }
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
