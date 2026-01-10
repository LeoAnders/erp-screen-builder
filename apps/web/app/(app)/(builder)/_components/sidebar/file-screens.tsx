"use client";

import { ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { SidebarScreen } from "./sidebar.types";

type FileScreensProps = {
  screens: SidebarScreen[];
  selectedScreenId?: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "resizable" | "compact";
  onScreenSelect?: (screenId: string) => void;
};

export function FileScreens({
  screens,
  selectedScreenId,
  isOpen,
  onOpenChange,
  variant = "resizable",
  onScreenSelect,
}: FileScreensProps) {
  const isResizable = variant === "resizable";

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className={cn(isResizable && "flex h-full flex-col")}
    >
      <CollapsibleTrigger
        aria-label={
          isOpen ? "Colapsar seção de telas" : "Expandir seção de telas"
        }
        className="group flex w-full cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50"
      >
        <div className="flex items-center gap-2">
          <ChevronRight className="size-4 transition-transform group-data-[state=open]:rotate-90" />
          <span>Telas</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-6 w-6 cursor-pointer"
            onClick={(e) => {
              // Impede que o clique expanda/colapse o bloco ao acionar o botão de adicionar.
              e.stopPropagation();
            }}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent
        className={cn(
          isResizable && "min-h-0 flex-1",
          !isResizable && "data-[state=closed]:hidden",
        )}
      >
        <div
          className={cn(
            "main-scrollbar select-none overflow-y-auto px-2 pb-2 pr-3",
            isResizable ? "h-full" : "max-h-[176px]",
          )}
          style={{ scrollbarGutter: "stable both-edges" }}
        >
          {screens.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground">
              Nenhuma tela encontrada.
            </div>
          ) : (
            <div className="space-y-0.5">
              {screens.map((screen) => {
                const isSelected = selectedScreenId === screen.id;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                      "hover:bg-sidebar-accent",
                      isSelected && "bg-sidebar-accent",
                      "cursor-pointer",
                    )}
                    onClick={() => onScreenSelect?.(screen.id)}
                  >
                    <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-sidebar-border bg-card">
                      {isSelected ? (
                        <div className="h-full w-full bg-muted-foreground/10 p-1">
                          <div className="h-1 w-6 rounded bg-muted-foreground/30" />
                          <div className="mt-1 h-1 w-4 rounded bg-muted-foreground/20" />
                        </div>
                      ) : (
                        <div className="h-full w-full bg-card" />
                      )}
                    </div>
                    <span className="truncate text-[13px] text-sidebar-foreground">
                      {screen.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
