import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTeamSchema } from "@/lib/validators";
import {
  jsonError,
  parseBody,
  requireSameOrigin,
  requireSession,
} from "@/lib/api-helpers";

export async function GET() {
  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  try {
    const items = await prisma.team.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ items });
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

  try {
    const team = await prisma.team.create({
      data: {
        name: parsed.data.name,
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
