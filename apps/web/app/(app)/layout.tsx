import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { auth } from "@/lib/auth";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { QueryClientProviderWrapper } from "@/components/query-client-provider";

type Props = {
  children: ReactNode;
};

/**
 * Layout base para o app autenticado.
 * - Garante sessão (redirect /login se ausente)
 * - Fornece providers (Auth + React Query)
 * - NÃO renderiza AppShell (Sidebar/Header) para permitir not-found full page
 */
export default async function AppLayout({ children }: Props) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <AuthSessionProvider session={session}>
      <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
    </AuthSessionProvider>
  );
}
