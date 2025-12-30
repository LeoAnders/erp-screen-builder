import { create } from "zustand";
import { persist } from "zustand/middleware";

type TeamChangeSource = "user" | "auto";

type TeamStore = {
  activeTeamId: string | null;

  lastChangedSource: TeamChangeSource | null;
  lastChangedAt: number | null;

  setActiveTeamId: (
    teamId: string | null,
    opts?: { source?: TeamChangeSource },
  ) => void;
};

export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      activeTeamId: null,
      lastChangedSource: null,
      lastChangedAt: null,

      setActiveTeamId: (teamId, opts) =>
        set({
          activeTeamId: teamId,
          lastChangedSource: opts?.source ?? "auto",
          lastChangedAt: Date.now(),
        }),
    }),
    { name: "erp-screen-builder-team-store" },
  ),
);
