"use client";

import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function ScreenThumbnail({
  title,
  subtitle = "Desktop • Primary",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Play className="size-3.5 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-medium text-card-foreground">
            {title}
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="px-3 py-1.5 text-[11px] text-muted-foreground">
        {subtitle}
      </div>

      {/* Canvas area - branco/claro representando a tela */}
      <div className="relative aspect-[4/3] overflow-hidden bg-card">
        <div className="absolute inset-2 rounded border border-border bg-background" />
      </div>
    </div>
  );
}
