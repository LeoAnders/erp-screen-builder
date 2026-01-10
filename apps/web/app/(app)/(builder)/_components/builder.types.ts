import type { LucideIcon } from "lucide-react";

export const DEFAULT_ORIGIN_LABEL = "Projeto Exemplo";
export const DEFAULT_ORIGIN_HREF = "/projects";
export const DEFAULT_DOC_TITLE = "Documento";

export type ToolKey = "select" | "hand" | "undo" | "redo";

export type ToolbarItem = {
  key: ToolKey;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
};
