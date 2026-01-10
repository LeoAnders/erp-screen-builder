"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { LayerTreeView, type LayerNode } from "../layer-tree-view";

type FileLayersProps = {
  nodes: LayerNode[];
  selectedId: string | null;
  expandedNodes: Set<string>;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "resizable" | "compact";
};

export function FileLayers({
  nodes,
  selectedId,
  expandedNodes,
  onSelect,
  onToggleExpand,
  isOpen,
  onOpenChange,
  variant = "resizable",
}: FileLayersProps) {
  const isResizable = variant === "resizable";

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className={cn(
        isResizable ? "flex h-full flex-col" : "min-h-0 flex flex-1 flex-col",
      )}
    >
      <CollapsibleTrigger
        aria-label={
          isOpen ? "Colapsar seção de camadas" : "Expandir seção de camadas"
        }
        className="group flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50"
      >
        <ChevronRight className="size-4 transition-transform group-data-[state=open]:rotate-90" />
        <span>Camadas</span>
      </CollapsibleTrigger>

      <CollapsibleContent className="min-h-0 flex-1">
        <LayerTreeView
          className="main-scrollbar h-full overflow-y-auto px-2 py-1 pr-3"
          style={{ scrollbarGutter: "stable both-edges" }}
          nodes={nodes}
          selectedId={selectedId}
          expandedNodes={expandedNodes}
          onSelect={onSelect}
          onToggleExpand={onToggleExpand}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
