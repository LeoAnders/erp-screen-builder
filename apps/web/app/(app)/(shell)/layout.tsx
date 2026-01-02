import { ReactNode } from "react";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HeaderBreadcrumbs } from "@/components/layout/header-breadcrumbs";

type Props = {
  children: ReactNode;
};

/**
 * AppShell (Sidebar + Header) para rotas autenticadas.
 * Assume que providers de auth/query já foram aplicados pelo layout pai (app).
 */
export default function ShellLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <HeaderBreadcrumbs />
        </header>
        <main
          className="main-scrollbar flex-1 overflow-y-auto overflow-x-hidden p-6"
          style={{ scrollbarGutter: "stable both-edges" }}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

