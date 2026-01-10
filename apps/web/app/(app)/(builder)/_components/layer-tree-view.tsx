"use client";

import { useState, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  ChevronRight,
  Grid3X3,
  Layout,
  Layers,
  MousePointer2,
  RectangleHorizontal,
  Square,
  Table,
  Type,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type LayerNodeType =
  | "screen"
  | "grid"
  | "button"
  | "label"
  | "input"
  | "tab"
  | "table"
  | "panel"
  | "container";

export type LayerNode = {
  id: string;
  name: string;
  type: LayerNodeType;
  visible?: boolean;
  locked?: boolean;
  children?: LayerNode[];
};

type LayerTreeViewProps = {
  nodes: LayerNode[];
  selectedId: string | null;
  expandedNodes: Set<string>;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  className?: string;
  style?: CSSProperties;
  showIndentGuides?: boolean;
};

const INDENT_SIZE = 14;
const BASE_PADDING = 8;
const INDENT_GUIDE_OFFSET = 14;

const layerTypeIcons: Record<LayerNodeType, LucideIcon> = {
  screen: AppWindow,
  grid: Grid3X3,
  button: MousePointer2,
  label: Type,
  input: RectangleHorizontal,
  tab: Layers,
  table: Table,
  panel: Layout,
  container: Square,
};

const layerTypeColors: Record<LayerNode["type"], string> = {
  screen: "text-muted-foreground",
  grid: "text-sky-500/70 dark:text-sky-400/70",
  button: "text-emerald-500/70 dark:text-emerald-400/70",
  label: "text-muted-foreground/80",
  input: "text-amber-500/70 dark:text-amber-400/70",
  tab: "text-violet-500/70 dark:text-violet-400/70",
  table: "text-sky-500/70 dark:text-sky-400/70",
  panel: "text-rose-500/70 dark:text-rose-400/70",
  container: "text-muted-foreground/70",
};

export function LayerTreeView({
  nodes,
  selectedId,
  expandedNodes,
  onSelect,
  onToggleExpand,
  className,
  style,
  showIndentGuides,
}: LayerTreeViewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldShowIndentGuides = showIndentGuides ?? isHovered;

  return (
    <div
      className={cn("select-none", className)}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {nodes.length === 0 ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          Nenhuma camada encontrada.
        </div>
      ) : (
        nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            selectedId={selectedId}
            expandedNodes={expandedNodes}
            onSelect={onSelect}
            onToggleExpand={onToggleExpand}
            showIndentGuides={shouldShowIndentGuides}
          />
        ))
      )}
    </div>
  );
}

type TreeNodeProps = {
  node: LayerNode;
  depth: number;
  selectedId: string | null;
  expandedNodes: Set<string>;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  showIndentGuides: boolean;
};

function TreeNode({
  node,
  depth,
  selectedId,
  expandedNodes,
  onSelect,
  onToggleExpand,
  showIndentGuides,
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedId === node.id;
  const Icon = layerTypeIcons[node.type] || Square;

  const paddingLeft = depth * INDENT_SIZE + BASE_PADDING;

  const handleRowClick = () => {
    onSelect(node.id);
    if (hasChildren) {
      onToggleExpand(node.id);
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "group relative flex cursor-pointer select-none items-center gap-1.5 py-1.5 pr-2 text-[13px] transition-colors",
          "hover:bg-sidebar-accent/60",
          isSelected && "bg-sidebar-accent",
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleRowClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRowClick();
          }
        }}
      >
        {depth > 0 &&
          Array.from({ length: depth }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "pointer-events-none absolute top-0 h-full w-px transition-colors duration-200",
                showIndentGuides ? "bg-sidebar-border/40" : "bg-transparent",
              )}
              style={{ left: `${i * INDENT_SIZE + INDENT_GUIDE_OFFSET}px` }}
            />
          ))}

        <span className="flex size-4 shrink-0 items-center justify-center">
          {hasChildren && (
            <ChevronRight
              className={cn(
                "size-3 text-muted-foreground/70 transition-transform duration-150",
                isExpanded && "rotate-90",
              )}
            />
          )}
        </span>

        <Icon className={cn("size-3.5 shrink-0", layerTypeColors[node.type])} />

        <span className="min-w-0 flex-1 truncate text-sidebar-foreground/90">
          {node.name}
        </span>
      </div>

      {hasChildren &&
        isExpanded &&
        node.children!.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            expandedNodes={expandedNodes}
            onSelect={onSelect}
            onToggleExpand={onToggleExpand}
            showIndentGuides={showIndentGuides}
          />
        ))}
    </div>
  );
}
