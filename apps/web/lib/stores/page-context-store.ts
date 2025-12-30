import { create } from "zustand";

type PageContextState = {
  projectId: string | null;
  projectName: string | null;

  setProjectContext: (ctx: {
    projectId?: string | null;
    projectName?: string | null;
  }) => void;

  clearProjectContext: () => void;
};

export const usePageContextStore = create<PageContextState>()((set) => ({
  projectId: null,
  projectName: null,
  setProjectContext: (ctx) =>
    set((state) => ({
      ...state,
      ...ctx,
    })),
  clearProjectContext: () => set({ projectId: null, projectName: null }),
}));
