"use client";

import { useState } from "react";
import { Boxes, Hand, File, MousePointer2, Redo2, Undo2 } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { BottomToolbar } from "./bottom-toolbar";
import { CanvasPlaceholder } from "./canvas-placeholder";
import { BuilderSidebar, type RailItem, type SidebarTab } from "./sidebar";
import type { ToolbarItem, ToolKey } from "./builder.types";
import { DEFAULT_ORIGIN_HREF, DEFAULT_ORIGIN_LABEL } from "./builder.types";

type Props = {
  docId: string;
  docTitle?: string;
  originLabel?: string;
  originHref?: string;
};

const RAIL_ITEMS: RailItem[] = [
  { key: "file", label: "Arquivo", icon: File },
  { key: "components", label: "Componentes", icon: Boxes },
];

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { key: "select", label: "Selecionar", icon: MousePointer2 },
  { key: "hand", label: "Mover", icon: Hand },
  { key: "undo", label: "Desfazer", icon: Undo2, disabled: true },
  { key: "redo", label: "Refazer", icon: Redo2, disabled: true },
];

export function BuilderShell({
  docId,
  docTitle,
  originLabel = DEFAULT_ORIGIN_LABEL,
  originHref = DEFAULT_ORIGIN_HREF,
}: Props) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("file");
  const [activeTool, setActiveTool] = useState<ToolKey>("select");

  const effectiveDocTitle = docTitle ?? docId;

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-background text-foreground">
      <BuilderSidebar
        docTitle={effectiveDocTitle}
        originLabel={originLabel}
        originHref={originHref}
        railItems={RAIL_ITEMS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <Separator orientation="vertical" />

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <CanvasPlaceholder />

        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <BottomToolbar
            items={TOOLBAR_ITEMS}
            activeKey={activeTool}
            onChange={setActiveTool}
          />
        </div>
      </div>
    </div>
  );
}
