import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewType = "cards" | "list";

type ViewPreferenceStore = {
  projectsView: ViewType;
  filesView: ViewType;

  setProjectsView: (view: ViewType) => void;
  setFilesView: (view: ViewType) => void;
};

export const useViewPreferenceStore = create<ViewPreferenceStore>()(
  persist(
    (set) => ({
      projectsView: "cards",
      filesView: "cards",

      setProjectsView: (view) => set({ projectsView: view }),
      setFilesView: (view) => set({ filesView: view }),
    }),
    {
      name: "erp-screen-builder-view-preference",
    },
  ),
);
