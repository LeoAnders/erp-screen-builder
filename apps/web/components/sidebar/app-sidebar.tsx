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
import {
  SquareTerminal,
  Command,
  AudioWaveform,
  GalleryVerticalEnd,
} from "lucide-react";

const teams = [
  { name: "Acme Inc", plan: "Enterprise", logo: Command },
  { name: "Acme Corp.", plan: "Startup", logo: GalleryVerticalEnd },
  { name: "Evil Corp.", plan: "Free", logo: AudioWaveform },
];

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

const projectsData = {
  total: 243,
  items: [
    {
      name: "Contas a Pagar",
      url: "/projects/contas-a-pagar/files",
      icon: SquareTerminal,
    },
    {
      name: "Relatórios Fiscais",
      url: "/projects/relatorios-fiscais/files",
      icon: SquareTerminal,
    },
    {
      name: "Gestão de Usuários",
      url: "/projects/gestao-de-usuarios/files",
      icon: SquareTerminal,
    },
    {
      name: "Integração Bancária",
      url: "/projects/integracao-bancaria/files",
      icon: SquareTerminal,
    },
    {
      name: "Landing Page",
      url: "/projects/landing-page/files",
      icon: SquareTerminal,
    },
    {
      name: "Outro Projeto",
      url: "/projects/outro-projeto/files",
      icon: SquareTerminal,
    },
  ],
};

export function AppSidebar() {
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name ?? "Usuário",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain data={navData} />

        <NavProjects
          projects={projectsData.items}
          total={projectsData.total}
          viewAllUrl="/projects"
          newProjectUrl="/projects"
          maxVisible={5}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
