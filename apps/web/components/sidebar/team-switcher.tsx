"use client";

import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { CreateTeamModal } from "@/components/modals/create-team-modal";
import { useTeams } from "@/hooks/use-teams";
import { useTeamStore } from "@/lib/stores/team-store";
import { usePathname, useRouter } from "next/navigation";
import type { TeamType, TeamVisibility } from "@prisma/client";

function isProjectScopedRoute(pathname: string) {
  return /^\/projects\/[^/]+(\/|$)/.test(pathname);
}

type Team = {
  id: string;
  name: string;
  type: TeamType;
  visibility?: TeamVisibility;
};

function badgeVariantForTeam(team: Team) {
  if (team.type === "personal") return "neutral";
  return team.visibility === "public" ? "success" : "neutral";
}

function badgeLabelForTeam(team: Team) {
  if (team.type === "personal") return "Privado";
  return team.visibility === "public" ? "Público" : "Privado";
}

function TeamIcon({ team }: { team: Team }) {
  return (
    <div className="flex size-9 items-center justify-center rounded-lg border bg-background">
      {team.type === "personal" ? (
        <UserRound className="size-4 text-muted-foreground" />
      ) : (
        <Users className="size-4 text-muted-foreground" />
      )}
    </div>
  );
}

function TeamRow({
  team,
  active,
  onSelect,
}: {
  team: Team;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      onClick={onSelect}
      className="p-0 focus:bg-transparent cursor-pointer"
    >
      <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/60">
        <div className="flex size-7 items-center justify-center rounded-md border bg-background">
          {team.type === "personal" ? (
            <UserRound className="size-3.5 text-muted-foreground" />
          ) : (
            <Users className="size-3.5 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium">{team.name}</span>

            <Badge variant={badgeVariantForTeam(team)} className="shrink-0">
              {badgeLabelForTeam(team)}
            </Badge>
          </div>
        </div>

        {active ? <Check className="size-4 text-muted-foreground" /> : null}
      </div>
    </DropdownMenuItem>
  );
}

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const teamsQuery = useTeams();
  const { activeTeamId, setActiveTeamId } = useTeamStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const teams = (teamsQuery.data ?? []) as Team[];
  const activeTeam = teams.find((t) => t.id === activeTeamId) ?? teams[0];

  const handleTeamSelect = (teamId: string) => {
    if (teamId === activeTeamId) return;
    setActiveTeamId(teamId, { source: "user" });

    if (isProjectScopedRoute(pathname)) {
      router.push("/projects");
    }
  };

  const handleTeamCreated = (teamId: string) => {
    setActiveTeamId(teamId, { source: "user" });
    if (isProjectScopedRoute(pathname)) {
      router.push("/projects");
    }
  };

  const activeSubtitle = badgeLabelForTeam(activeTeam);

  /* Loading */
  if (!activeTeam && teamsQuery.isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="size-8 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeTeam.type === "personal" ? (
                  <UserRound className="size-4" />
                ) : (
                  <Users className="size-4" />
                )}
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeSubtitle}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto size-4 opacity-70" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-85 overflow-hidden rounded-xl border bg-popover shadow-lg p-0"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={8}
          >
            {/* Header */}
            <div className="bg-muted/40 px-4 py-4">
              <div className="flex items-center gap-3">
                <TeamIcon team={activeTeam} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {activeTeam.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {activeSubtitle}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 w-fit gap-2 rounded-lg px-3 text-sm cursor-pointer"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="size-4" />
                  Configurações
                </Button>
              </div>
            </div>

            <DropdownMenuSeparator className="mx-0 my-0" />

            {/* Body */}
            <div className="p-2">
              <div
                className="
                  space-y-1 pb-2
                  max-h-[min(50svh,420px)]
                  overflow-y-auto
                  overscroll-contain
                  main-scrollbar
                "
              >
                {teams.map((team) => (
                  <TeamRow
                    key={team.id}
                    team={team}
                    active={team.id === activeTeamId}
                    onSelect={() => handleTeamSelect(team.id)}
                  />
                ))}
              </div>

              <DropdownMenuSeparator className="-mx-2 my-2" />

              {/* Criar novo time */}
              <DropdownMenuItem
                className="p-0 focus:bg-transparent cursor-pointer"
                onClick={() => setCreateModalOpen(true)}
              >
                <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/60">
                  <div className="flex size-7 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-3.5 text-muted-foreground" />
                  </div>
                  <span className="truncate text-sm font-medium">
                    Criar novo time
                  </span>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <CreateTeamModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={handleTeamCreated}
      />
    </SidebarMenu>
  );
}
