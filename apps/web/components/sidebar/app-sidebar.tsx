"use client";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useSession } from "next-auth/react";
import { useProjects } from "@/hooks/use-projects";
import { useTeams } from "@/hooks/use-teams";
import { useTeamStore } from "@/lib/stores/team-store";

const navData = {
  search: { title: "Buscar", url: "/dashboard" },
  dashboard: { title: "Início", url: "/dashboard" },
  favorites: {
    title: "Favoritos",
    items: [
      { title: "Projeto Alpha", url: "/projects/projeto-alpha/files" },
      {
        title: "Dashboard Financeiro",
        url: "/projects/dashboard-financeiro/files",
      },
    ],
  },
};

export function AppSidebar() {
  const { data: session } = useSession();
  useTeams();
  const { activeTeamId } = useTeamStore();
  const projectsQuery = useProjects(activeTeamId);

  const user = {
    name: session?.user?.name ?? "Usuário",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
  };

  const projects = (projectsQuery.data ?? []).map((project) => ({
    id: project.id,
    name: project.name,
    href: `/projects/${project.id}/files`,
  }));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain data={navData} />

        <NavProjects
          projects={projects}
          total={projects.length}
          viewAllUrl="/projects"
          newProjectUrl="/projects"
          maxVisible={5}
          isLoading={projectsQuery.isLoading || projectsQuery.isPending}
          isError={projectsQuery.isError}
          emptyLabel={
            activeTeamId
              ? "Nenhum projeto recente"
              : "Selecione um time"
          }
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
