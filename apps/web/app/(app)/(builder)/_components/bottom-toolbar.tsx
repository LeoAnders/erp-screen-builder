"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import type { ToolbarItem, ToolKey } from "./builder.types";

type Props = {
  items: ToolbarItem[];
  activeKey?: ToolKey;
  onChange?: (key: ToolKey) => void;
};

export function BottomToolbar({ items, activeKey, onChange }: Props) {
  return (
    <div className="pointer-events-auto rounded-full border border-border bg-popover/95 p-1 shadow-lg backdrop-blur">
      <div className="flex items-center gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          return (
            <Button
              key={item.key}
              type="button"
              size="icon-sm"
              variant={isActive ? "secondary" : "ghost"}
              aria-label={item.label}
              className={cn(
                "rounded-full",
                isActive && "bg-accent text-accent-foreground",
              )}
              disabled={item.disabled ?? false}
              onClick={() => onChange?.(item.key)}
            >
              <Icon className="size-4" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
