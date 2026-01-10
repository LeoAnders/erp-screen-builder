"use client";

import { useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  DEFAULT_DOC_TITLE,
  DEFAULT_ORIGIN_HREF,
  DEFAULT_ORIGIN_LABEL,
} from "../builder.types";
import { ComponentsPalette } from "./components-palette";
import { FileLayers } from "./file-layers";
import { FileScreens } from "./file-screens";
import { PanelHeader } from "./panel-header";
import {
  componentCategories,
  mockComponents,
  mockLayerTree,
  mockScreens,
} from "./sidebar.data";
import type { SidebarProps } from "./sidebar.types";

export function SidebarPanel({
  docTitle = DEFAULT_DOC_TITLE,
  originLabel = DEFAULT_ORIGIN_LABEL,
  originHref = DEFAULT_ORIGIN_HREF,
  tab,
}: SidebarProps) {
  const isComponents = tab === "components";
  const [componentQuery, setComponentQuery] = useState("");
  const [isScreensOpen, setIsScreensOpen] = useState(true);
  const [isLayersOpen, setIsLayersOpen] = useState(true);

  // Estado de seleção de tela
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(
    () => mockScreens[0]?.id ?? null,
  );

  // Estado de seleção e expansão de camadas (lazy init para performance)
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    () => mockLayerTree[0]?.id ?? null,
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    () => new Set(mockLayerTree.map((node) => node.id)),
  );

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-sidebar">
      <PanelHeader
        docTitle={docTitle}
        originLabel={originLabel}
        originHref={originHref}
      />

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {!isComponents ? (
          <div className="flex h-full flex-col overflow-hidden py-2">
            {isScreensOpen ? (
              <ResizablePanelGroup direction="vertical" className="h-full">
                <ResizablePanel defaultSize={28} minSize={18}>
                  <FileScreens
                    screens={mockScreens}
                    selectedScreenId={selectedScreenId}
                    isOpen={isScreensOpen}
                    onOpenChange={setIsScreensOpen}
                    onScreenSelect={setSelectedScreenId}
                    variant="resizable"
                  />
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={72} minSize={30}>
                  <FileLayers
                    nodes={mockLayerTree}
                    selectedId={selectedLayerId}
                    expandedNodes={expandedNodes}
                    onSelect={setSelectedLayerId}
                    onToggleExpand={toggleExpanded}
                    isOpen={isLayersOpen}
                    onOpenChange={setIsLayersOpen}
                    variant="resizable"
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <div className="flex h-full flex-col overflow-hidden">
                <FileScreens
                  screens={mockScreens}
                  selectedScreenId={selectedScreenId}
                  isOpen={isScreensOpen}
                  onOpenChange={setIsScreensOpen}
                  onScreenSelect={setSelectedScreenId}
                  variant="compact"
                />

                <FileLayers
                  nodes={mockLayerTree}
                  selectedId={selectedLayerId}
                  expandedNodes={expandedNodes}
                  onSelect={setSelectedLayerId}
                  onToggleExpand={toggleExpanded}
                  isOpen={isLayersOpen}
                  onOpenChange={setIsLayersOpen}
                  variant="compact"
                />
              </div>
            )}
          </div>
        ) : (
          <ComponentsPalette
            categories={componentCategories}
            components={mockComponents}
            query={componentQuery}
            onQueryChange={setComponentQuery}
          />
        )}
      </div>
    </div>
  );
}
