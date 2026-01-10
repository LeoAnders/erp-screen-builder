import type { LucideIcon } from "lucide-react";

export type SidebarTab = "file" | "components";

export type RailItem = {
  key: SidebarTab;
  label: string;
  icon: LucideIcon;
};

export type SidebarComponentId =
  | "label"
  | "input"
  | "select"
  | "button"
  | "table"
  | "grid";

export type SidebarProps = {
  docTitle?: string;
  originLabel?: string;
  originHref?: string;
  tab: SidebarTab;
};

export type SidebarScreen = {
  id: string;
  name: string;
};

export type SidebarComponent = {
  id: SidebarComponentId;
  name: string;
  category: ComponentCategory["key"];
};

export type ComponentCategory = {
  key: string;
  title: string;
  bgClassName: string;
  icon: LucideIcon;
};
