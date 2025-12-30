"use client";
import { ChevronsUpDown, Plus, UserRound, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeams } from "@/hooks/use-teams";
import { useTeamStore } from "@/lib/stores/team-store";
import { usePathname, useRouter } from "next/navigation";

function isProjectScopedRoute(pathname: string) {
  return /^\/projects\/[^/]+(\/|$)/.test(pathname);
}

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const teamsQuery = useTeams();
  const { activeTeamId, setActiveTeamId } = useTeamStore();

  const router = useRouter();
  const pathname = usePathname();

  const teams = teamsQuery.data ?? [];
  const activeTeam = teams.find((team) => team.id === activeTeamId) ?? teams[0];

  const handleTeamSelect = (teamId: string) => {
    if (teamId === activeTeamId) return;

    setActiveTeamId(teamId, { source: "user" });

    if (isProjectScopedRoute(pathname)) {
      router.push("/projects");
    }
  };

  if (!activeTeam && teamsQuery.isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="size-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeTeam) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="bg-sidebar-primary/20 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Users className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {teamsQuery.isError ? "Times indisponíveis" : "Nenhum time"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {teamsQuery.isError
                  ? "Tente novamente"
                  : "Crie um time público"}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const isPersonalActive = activeTeam.type === "personal";
  const personalTeams = teams.filter((team) => team.type === "personal");
  const publicTeams = teams.filter((team) => team.visibility === "public");

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
                {isPersonalActive ? (
                  <UserRound className="size-4" />
                ) : (
                  <Users className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">
                  {activeTeam.type === "personal" ? "Privado" : "Time público"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Privado
            </DropdownMenuLabel>
            {personalTeams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleTeamSelect(team.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <UserRound className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Times públicos
            </DropdownMenuLabel>
            {publicTeams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleTeamSelect(team.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Users className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>
                  ⌘{index + personalTeams.length + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

            {teamsQuery.isError ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled
                  className="text-xs text-muted-foreground"
                >
                  Erro ao carregar times
                </DropdownMenuItem>
              </>
            ) : null}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Criar time público
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
