import { create } from "zustand";
import { persist } from "zustand/middleware";

type TeamChangeSource = "user" | "auto";

type TeamStore = {
  activeTeamId: string | null;
  hasHydrated: boolean;

  lastChangedSource: TeamChangeSource | null;
  lastChangedAt: number | null;

  setHasHydrated: (hydrated: boolean) => void;
  setActiveTeamId: (
    teamId: string | null,
    opts?: { source?: TeamChangeSource },
  ) => void;
};

export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      activeTeamId: null,
      hasHydrated: false,
      lastChangedSource: null,
      lastChangedAt: null,

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setActiveTeamId: (teamId, opts) =>
        set({
          activeTeamId: teamId,
          lastChangedSource: opts?.source ?? "auto",
          lastChangedAt: Date.now(),
        }),
    }),
    {
      name: "erp-screen-builder-team-store",
      partialize: (state) => ({
        activeTeamId: state.activeTeamId,
        lastChangedSource: state.lastChangedSource,
        lastChangedAt: state.lastChangedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
