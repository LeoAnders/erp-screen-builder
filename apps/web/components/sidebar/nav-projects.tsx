"use client";

import { Folder, MoreHorizontal, Plus, type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type Project = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export function NavProjects({
  projects,
  total,
  viewAllUrl = "/projects",
  newProjectUrl = "/projects/new",
  maxVisible = 5,
}: {
  projects: Project[];
  total: number;
  viewAllUrl?: string;
  newProjectUrl?: string;
  maxVisible?: number;
}) {
  const visible = projects.slice(0, maxVisible);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projetos</SidebarGroupLabel>

      <SidebarGroupAction asChild title="Novo projeto">
        <Link href={newProjectUrl}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Novo projeto</span>
        </Link>
      </SidebarGroupAction>

      <SidebarGroupContent>
        <SidebarMenu>
          {visible.map((item) => (
            <SidebarMenuItem key={item.name} className="group/menu-item">
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <Folder className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-sidebar-foreground/70">
              <Link href={viewAllUrl}>
                <MoreHorizontal />
                <span>Ver todos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
