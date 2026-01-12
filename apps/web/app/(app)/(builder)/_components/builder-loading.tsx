"use client";

import { LayoutTemplate } from "lucide-react";

export function BuilderLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="animate-builder-fade-in flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-card shadow-sm">
          <LayoutTemplate className="size-7 text-primary" strokeWidth={1.5} />
        </div>
        {/* Progress bar */}
        <div className="h-0.5 w-32 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/5 animate-builder-progress rounded-full bg-linear-to-r from-primary/60 via-primary to-primary/60" />
        </div>
      </div>
    </div>
  );
}
