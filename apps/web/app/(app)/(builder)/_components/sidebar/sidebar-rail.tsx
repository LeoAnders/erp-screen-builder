"use client";

import Link from "next/link";
import { LayoutTemplate } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import type { RailItem, SidebarTab } from "./sidebar.types";

type Props = {
  items: RailItem[];
  activeKey: SidebarTab;
  onChange: (key: SidebarTab) => void;
};

export function SidebarRail({ items, activeKey, onChange }: Props) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full w-[60px] flex-col items-center border-r border-sidebar-border bg-sidebar p-2">
        {/* Logo / Home link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="mb-1 h-11 w-11 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground cursor-pointer"
            >
              <Link href="/dashboard">
                <LayoutTemplate className="size-5" strokeWidth={1.5} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Voltar ao início</TooltipContent>
        </Tooltip>

        <Separator className="my-2 w-8" />

        {/* Navigation items */}
        <div className="flex flex-col items-center gap-2">
          {items.map((item) => {
            const isActive = item.key === activeKey;
            const Icon = item.icon;

            return (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={isActive ? "secondary" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-11 w-11 rounded-xl cursor-pointer",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
                      !isActive &&
                        "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                    onClick={() => onChange(item.key)}
                  >
                    <Icon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
