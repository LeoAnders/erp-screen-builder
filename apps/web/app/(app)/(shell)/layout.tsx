"use client";

import { ReactNode } from "react";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HeaderBreadcrumbs } from "@/components/layout/header-breadcrumbs";
import { useAppBootstrap } from "@/components/bootstrap/app-bootstrap-context";
import { ErrorState } from "@/components/ui/error-state";
import { useTeams } from "@/hooks/use-teams";
import { SidebarSkeleton } from "@/components/skeletons/sidebar-skeleton";
import { HeaderSkeleton } from "@/components/skeletons/header-skeleton";

type Props = {
  children: ReactNode;
};

/**
 * AppShell (Sidebar + Header) para rotas autenticadas.
 * Assume que providers de auth/query/bootstrap já foram aplicados pelo layout pai (app).
 * Mostra skeletons simplificados para sidebar e header durante bootstrap loading.
 */
export default function ShellLayout({ children }: Props) {
  const { isReady, error } = useAppBootstrap();
  const teamsQuery = useTeams();

  if (!isReady && !error) {
    return (
      <SidebarProvider>
        <SidebarSkeleton />
        <SidebarInset className="flex h-screen flex-col overflow-hidden">
          <HeaderSkeleton />
          <main
            className="main-scrollbar flex-1 overflow-y-auto overflow-x-hidden"
            style={{ scrollbarGutter: "stable both-edges" }}
          />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <HeaderBreadcrumbs />
        <main
          className="main-scrollbar flex-1 overflow-y-auto overflow-x-hidden p-6"
          style={{ scrollbarGutter: "stable both-edges" }}
        >
          {error ? (
            <div className="flex h-full items-center justify-center">
              <ErrorState
                title="Erro ao carregar times"
                message="Não foi possível carregar os times. Tente novamente."
                onRetry={() => teamsQuery.refetch()}
                error={error}
              />
            </div>
          ) : (
            children
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
