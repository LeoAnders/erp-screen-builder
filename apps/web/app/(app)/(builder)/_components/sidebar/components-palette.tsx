"use client";

import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  Grid3X3,
  GripVertical,
  MousePointer2,
  RectangleHorizontal,
  Search,
  Square,
  Table,
  Type,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  ComponentCategory,
  SidebarComponent,
  SidebarComponentId,
} from "./sidebar.types";

type ComponentsPaletteProps = {
  categories: ComponentCategory[];
  components: SidebarComponent[];
  query: string;
  onQueryChange: (value: string) => void;
  onComponentSelect?: (component: SidebarComponent) => void;
};

export function ComponentsPalette({
  categories,
  components,
  query,
  onQueryChange,
  onComponentSelect,
}: ComponentsPaletteProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        className="main-scrollbar min-h-0 flex-1 select-none overflow-y-auto p-3 pt-0 pr-4"
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        <div className="sticky top-0 z-10 bg-sidebar pb-3 pt-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar componentes..."
              className="h-10 pl-9"
            />
          </div>
        </div>

        <div className="space-y-5 pb-2">
          {categories.map((category) => {
            const trimmedQuery = query.trim().toLowerCase();
            const items = components.filter((component) => {
              if (component.category !== category.key) return false;
              if (trimmedQuery.length === 0) return true;
              return component.name.toLowerCase().includes(trimmedQuery);
            });

            if (items.length === 0) return null;

            return (
              <div key={category.key} className="space-y-2">
                <div className="px-1 text-[12px] font-medium tracking-wide text-muted-foreground">
                  {category.title}
                </div>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={cn(
                        "group flex w-full cursor-grab items-center justify-between gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-2 py-2 text-left transition-colors",
                        "hover:bg-sidebar-accent/60 active:cursor-grabbing",
                      )}
                      onClick={() => onComponentSelect?.(item)}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={cn(
                            "flex size-11 shrink-0 items-center justify-center rounded-xl border border-sidebar-border",
                          )}
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg">
                            <ComponentIcon type={item.id} />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-medium text-sidebar-foreground">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      <GripVertical className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------
// Icon mapping by component type
// -------------------------------------------------

const componentIcons: Record<SidebarComponentId, LucideIcon> = {
  label: Type,
  input: RectangleHorizontal,
  select: ChevronDown,
  button: MousePointer2,
  table: Table,
  grid: Grid3X3,
};

function ComponentIcon({ type }: { type: SidebarComponentId }) {
  const Icon = componentIcons[type] ?? Square;
  return <Icon className="size-5 text-sidebar-foreground/70" />;
}
