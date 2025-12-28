"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

/**
 * Simple empty state placeholder to keep empty views consistent.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="grid flex-1 justify-items-center px-6 pt-8">
      <div className="flex w-full max-w-md flex-col items-center gap-2 text-center">
        <Icon className="size-11 text-muted-foreground/70" />

        <h2 className="text-[1.25rem] font-semibold tracking-tight text-foreground">
          {title}
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {actionLabel ? (
          <Button
            size="sm"
            className="mt-2 gap-2"
            onClick={onActionClick}
            variant="default"
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
