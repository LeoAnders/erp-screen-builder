"use client";

import {
  createContext,
  type PropsWithChildren,
  useMemo,
  useContext,
} from "react";

import { useTeams } from "@/hooks/use-teams";
import { useTeamStore } from "@/lib/stores/team-store";
import type { ApiError } from "@/lib/utils";

type AppBootstrapState = {
  isReady: boolean;
  isLoading: boolean;
  error: ApiError | null;
};

const AppBootstrapContext = createContext<AppBootstrapState | undefined>(
  undefined,
);

export function AppBootstrapProvider({ children }: PropsWithChildren) {
  const teamsQuery = useTeams();
  const { activeTeamId, hasHydrated } = useTeamStore();

  const state = useMemo<AppBootstrapState>(() => {
    const teamsResolved = teamsQuery.data != null;
    const teams = teamsQuery.data ?? [];
    const needsActiveTeam = teams.length > 0;

    const isLoading =
      !hasHydrated || !teamsResolved || (needsActiveTeam && !activeTeamId);

    return {
      isReady: !isLoading && !teamsQuery.isError,
      isLoading,
      error: (teamsQuery.isError ? teamsQuery.error : null) as ApiError | null,
    };
  }, [
    activeTeamId,
    hasHydrated,
    teamsQuery.data,
    teamsQuery.isError,
    teamsQuery.error,
  ]);

  return (
    <AppBootstrapContext.Provider value={state}>
      {children}
    </AppBootstrapContext.Provider>
  );
}

export function useAppBootstrap(): AppBootstrapState {
  const context = useContext(AppBootstrapContext);
  if (context === undefined) {
    throw new Error("useAppBootstrap must be used within AppBootstrapProvider");
  }
  return context;
}
