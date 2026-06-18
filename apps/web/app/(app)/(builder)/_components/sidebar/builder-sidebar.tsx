"use client";

import { Separator } from "@/components/ui/separator";

import { SidebarPanel } from "./sidebar-panel";
import { SidebarRail } from "./sidebar-rail";
import type { RailItem, SidebarTab } from "./sidebar.types";

type Props = {
  docTitle?: string;
  originLabel?: string;
  originHref?: string;
  railItems: RailItem[];
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  selectedScreenId?: string | null;
  onScreenSelect?: (screenId: string) => void;
};

export function BuilderSidebar({
  docTitle,
  originLabel,
  originHref,
  railItems,
  activeTab,
  onTabChange,
  selectedScreenId,
  onScreenSelect,
}: Props) {
  return (
    <aside className="flex h-full w-90 shrink-0 overflow-hidden bg-sidebar">
      <SidebarRail
        items={railItems}
        activeKey={activeTab}
        onChange={onTabChange}
      />

      <Separator orientation="vertical" />

      <SidebarPanel
        docTitle={docTitle}
        originLabel={originLabel}
        originHref={originHref}
        tab={activeTab}
        selectedScreenId={selectedScreenId}
        onScreenSelect={onScreenSelect}
      />
    </aside>
  );
}
