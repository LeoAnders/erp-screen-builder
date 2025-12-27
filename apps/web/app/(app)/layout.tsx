import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { auth } from "@/lib/auth";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { QueryClientProviderWrapper } from "@/components/query-client-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <AuthSessionProvider session={session}>
      <QueryClientProviderWrapper>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex h-screen flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Início</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <main
              className="main-scrollbar flex-1 overflow-y-auto overflow-x-hidden p-6"
              style={{ scrollbarGutter: "stable both-edges" }}
            >
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </QueryClientProviderWrapper>
    </AuthSessionProvider>
  );
}
