"use client";

import { Folder, MoreHorizontal, Plus } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

type Project = {
  id: string;
  name: string;
  href: string;
};

export function NavProjects({
  projects,
  total,
  viewAllUrl = "/projects",
  newProjectUrl = "/projects/new",
  maxVisible = 5,
  isLoading = false,
  isError = false,
  emptyLabel = "Nenhum projeto encontrado",
}: {
  projects: Project[];
  total: number;
  viewAllUrl?: string;
  newProjectUrl?: string;
  maxVisible?: number;
  isLoading?: boolean;
  isError?: boolean;
  emptyLabel?: string;
}) {
  const visible = projects.slice(0, maxVisible);
  const showViewAll = total > maxVisible;

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
          {isLoading ? (
            Array.from({ length: Math.min(3, maxVisible) }).map((_, index) => (
              <SidebarMenuItem key={`skeleton-${index}`}>
                <SidebarMenuButton>
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-24" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : isError ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled
                className="text-sidebar-foreground/70"
              >
                <Folder className="h-4 w-4" />
                <span>Erro ao carregar projetos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : visible.length ? (
            visible.map((item) => (
              <SidebarMenuItem key={item.id} className="group/menu-item">
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    <Folder className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled
                className="text-sidebar-foreground/70"
              >
                <Folder className="h-4 w-4" />
                <span>{emptyLabel}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {showViewAll ? (
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-sidebar-foreground/70">
                <Link href={viewAllUrl}>
                  <MoreHorizontal />
                  <span>Ver todos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
