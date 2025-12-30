import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function getSessionUserId(
  session: Session
): Promise<string | null> {
  const directId = (session.user as { id?: string } | undefined)?.id;
  if (directId) return directId;

  const email = session.user?.email;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user?.id ?? null;
}
