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
        className="group flex w-full cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-[#151515]"
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
            className="h-6 w-6 cursor-pointer text-[#4b4b4b] hover:bg-[#1a1a1a] hover:text-[#7a7a7a]"
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
            isResizable ? "h-full" : "max-h-44",
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
                      "flex w-full items-center gap-3 rounded-md border px-2 py-2 text-left text-sm transition-colors",
                      "border-transparent hover:bg-[#191919]",
                      isSelected && "border-[#303030] bg-[#242424]",
                      "cursor-pointer",
                    )}
                    onClick={() => onScreenSelect?.(screen.id)}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded border bg-[#111]",
                        isSelected ? "border-[#343434]" : "border-[#222]",
                      )}
                    >
                      {isSelected ? (
                        <div className="h-full w-full bg-[#1a1a1a] p-1.5">
                          <div className="h-1 w-8 rounded bg-[#3f3f3f]" />
                          <div className="mt-1 h-1 w-6 rounded bg-[#313131]" />
                          <div className="mt-1 h-1 w-5 rounded bg-[#2a2a2a]" />
                        </div>
                      ) : (
                        <div className="h-full w-full bg-[#101010] p-1.5">
                          <div className="h-1 w-7 rounded bg-[#252525]" />
                          <div className="mt-1 h-1 w-5 rounded bg-[#202020]" />
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "truncate text-[13px] font-medium",
                        "text-white",
                      )}
                    >
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
