import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateFileSchema } from "@/lib/validators";
import {
  jsonError,
  parseBody,
  requireSameOrigin,
  requireSession,
} from "@/lib/api-helpers";
import { getSessionUserId } from "@/lib/session";

type FileResponseSource = {
  id: string;
  name: string;
  schemaJson: unknown;
  revision: number;
  updatedBy: string | null;
  updatedAt: Date;
  template?: string | null;
  schemaVersion?: string | null;
};

function mapFileToResponse(file: FileResponseSource) {
  return {
    id: file.id,
    name: file.name,
    template: file.template ?? "blank",
    schema_version: file.schemaVersion ?? "1.0.0",
    schema_json: file.schemaJson,
    revision: file.revision,
    updated_by: file.updatedBy,
    updated_at: file.updatedAt,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  try {
    const userId = await getSessionUserId(sessionResult.session);
    if (!userId) {
      return jsonError(401, "UNAUTHORIZED", "User not found");
    }

    const file = await prisma.file.findUnique({
      where: { id },
      include: { project: { include: { team: true } } },
    });

    if (!file) {
      return jsonError(404, "FILE_NOT_FOUND", "File not found");
    }

    if (
      file.project.team.type === "personal" &&
      file.project.team.ownerId !== userId
    ) {
      return jsonError(403, "FORBIDDEN", "Access denied to this file");
    }

    return NextResponse.json(mapFileToResponse(file));
  } catch (error) {
    console.error("[GET /api/files/:id] error", error);
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const sessionResult = await requireSession();
  if ("error" in sessionResult) return sessionResult.error;

  const originCheck = requireSameOrigin(req);
  if ("error" in originCheck) return originCheck.error;

  const parsed = await parseBody(req, updateFileSchema);
  if ("error" in parsed) return parsed.error;

  try {
    const userId = await getSessionUserId(sessionResult.session);
    if (!userId) {
      return jsonError(401, "UNAUTHORIZED", "User not found");
    }

    const fileTeam = await prisma.file.findUnique({
      where: { id },
      select: { project: { select: { team: true } } },
    });

    if (!fileTeam) {
      return jsonError(404, "FILE_NOT_FOUND", "File not found");
    }

    if (
      fileTeam.project.team.type === "personal" &&
      fileTeam.project.team.ownerId !== userId
    ) {
      return jsonError(403, "FORBIDDEN", "Access denied to this file");
    }

    const updateResult = await prisma.file.updateMany({
      where: {
        id,
        revision: parsed.data.expected_revision,
      },
      data: {
        schemaJson: parsed.data.schema_json as Prisma.InputJsonValue,
        revision: { increment: 1 },
        updatedBy:
          sessionResult.session.user?.name ??
          sessionResult.session.user?.email ??
          null,
      },
    });

    if (updateResult.count === 0) {
      const current = await prisma.file.findUnique({
        where: { id },
      });

      if (!current) {
        return jsonError(404, "FILE_NOT_FOUND", "File not found");
      }

      return jsonError(409, "REVISION_CONFLICT", "Revision conflict", {
        current_revision: current.revision,
        current_schema_json: current.schemaJson,
        updated_by: current.updatedBy,
        updated_at: current.updatedAt,
      });
    }

    const updated = await prisma.file.findUnique({
      where: { id },
    });

    if (!updated) {
      return jsonError(404, "FILE_NOT_FOUND", "File not found");
    }

    return NextResponse.json({
      revision: updated.revision,
      updated_at: updated.updatedAt,
      updated_by: updated.updatedBy,
    });
  } catch (error) {
    console.error("[PUT /api/files/:id] error", error);
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
