import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TeamDTO } from "@/lib/dtos";
import type { ApiError } from "@/lib/utils";
import { useTeamStore } from "@/lib/stores/team-store";

async function fetchTeams(): Promise<TeamDTO[]> {
  const res = await fetch("/api/teams", { method: "GET" });

  if (!res.ok) {
    let body: ApiError | undefined;
    try {
      body = await res.json();
    } catch {
      /* noop */
    }
    throw body ?? new Error("Não foi possível carregar os times");
  }

  const json = await res.json();
  return json.items as TeamDTO[];
}

export function useTeams() {
  const { activeTeamId, hasHydrated, setActiveTeamId } = useTeamStore();

  const query = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (!hasHydrated) return;
    if (!query.data?.length) return;

    const teamIds = query.data.map((team) => team.id);
    const personalTeam = query.data.find((team) => team.type === "personal");

    if (activeTeamId && !teamIds.includes(activeTeamId)) {
      setActiveTeamId(personalTeam?.id ?? query.data[0]?.id ?? null);
      return;
    }

    if (!activeTeamId) {
      setActiveTeamId(personalTeam?.id ?? query.data[0]?.id ?? null);
    }
  }, [activeTeamId, hasHydrated, query.data, setActiveTeamId]);

  return query;
}
