import { ReactNode } from "react";
import { redirect, notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { uuidSchema } from "@/lib/api-helpers";

type ProjectLayoutProps = {
  children: ReactNode;
  params: { projectId: string };
};

/**
 * Layout de projeto com validação server-side.
 *
 * Garante que:
 * - O projectId é um UUID válido
 * - O usuário está autenticado
 * - O projeto existe no banco
 * - O usuário tem acesso ao projeto
 *
 * Se qualquer validação falhar, chama notFound() que renderiza
 * a página not-found.tsx do grupo (app) em full screen.
 */
export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { projectId } = await params;

  const parsedId = uuidSchema.safeParse(projectId);
  if (!parsedId.success) {
    notFound();
  }

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userId = await getSessionUserId(session);
  if (!userId) {
    redirect("/login");
  }

  const project = await prisma.project.findUnique({
    where: { id: parsedId.data },
    include: { team: true },
  });

  if (!project) {
    notFound();
  }

  if (project.team.type === "personal" && project.team.ownerId !== userId) {
    notFound();
  }

  return <>{children}</>;
}
