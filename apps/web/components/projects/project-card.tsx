"use client";

import { useCallback } from "react";
import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { KindIcon } from "@/components/projects/kind-icon";
import { ProjectFilePreview } from "@/components/projects/project-types";
import { projectFilesQueryOptions } from "@/hooks/use-project-files";

export type ProjectCardProps = {
  id: string;
  name: string;
  fileCount: number;
  previews: ProjectFilePreview[];
  href?: string;
  className?: string;
  onCreateFile?: (projectId: string) => void;
};

function PreviewTile({ p }: { p: ProjectFilePreview }) {
  const description =
    p.description ?? "Descrição do arquivo não disponível no momento.";
  return (
    <div
      className="
    group/preview relative flex h-full w-full cursor-pointer items-center justify-center
   overflow-hidden rounded-lg border border-gray-100/20 bg-muted/10 text-muted-foreground
    transition-colors hover:border-gray-100/35 hover:bg-muted/20
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  "
    >
      <KindIcon kind={p.kind ?? "doc"} className="h-5 w-5" />
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-background/30 backdrop-blur-sm opacity-0 transition-opacity duration-200 group-hover/preview:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 rounded-b-lg bg-linear-to-t from-background/80 via-background/40 to-transparent p-2 text-left text-xs font-medium opacity-0 transition-all duration-200 group-hover/preview:opacity-100 sm:text-sm">
        <span className="leading-snug text-muted-foreground/90 line-clamp-2">
          {description}
        </span>
      </div>
    </div>
  );
}

function EmptySlot({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/slot relative h-full w-full overflow-hidden rounded-lg cursor-pointer",
        "border border-dashed border-gray-100/20",
        "bg-muted/10 text-muted-foreground",
        "transition-colors hover:bg-muted/20 hover:border-gray-100/35",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
      aria-label="Criar novo arquivo"
    >
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover/slot:opacity-100">
        <div className="grid size-10 place-items-center rounded-full border bg-background/80 shadow-sm">
          <Plus className="size-5 text-muted-foreground" />
        </div>
      </div>
    </button>
  );
}

export function ProjectCard({
  id,
  name,
  fileCount,
  previews,
  href = `/projects/${id}/files`,
  className,
  onCreateFile,
}: ProjectCardProps) {
  const queryClient = useQueryClient();
  const prefetchFiles = useCallback(() => {
    void queryClient.prefetchQuery(projectFilesQueryOptions(id));
  }, [id, queryClient]);

  // Mantém 4 células para preservar o layout mesmo com menos previews.
  const slots = Array.from({ length: 4 }).map((_, i) => previews[i]);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card/40 p-3 transition",
        "hover:bg-card/70 hover:shadow-sm",
        className,
      )}
      onMouseEnter={prefetchFiles}
      onFocusCapture={prefetchFiles}
    >
      {/* Link do projeto (mantém click no card / título) */}
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      >
        {/* Header minimal */}
        <div className="mb-3 flex items-center gap-3 px-1 pt-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
            <FolderOpen className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {fileCount} {fileCount === 1 ? "file" : "files"}
            </p>
          </div>
        </div>
      </Link>

      {/* Grade 2x2 sempre com 4 blocos */}
      <div className="grid aspect-16/10 grid-cols-2 grid-rows-2 auto-rows-fr gap-3 rounded-xl p-2">
        {slots.map((p, idx) =>
          p ? (
            <PreviewTile key={p.id} p={p} />
          ) : (
            <EmptySlot
              key={`empty-${idx}`}
              onClick={onCreateFile ? () => onCreateFile(id) : undefined}
            />
          ),
        )}
      </div>
    </Card>
  );
}
export function ProjectCardSkeleton() {
  return (
    <Card className="rounded-2xl bg-card/40 p-3">
      {/* header */}
      <div className="mb-3 flex items-center gap-3 px-1 pt-1">
        <Skeleton className="size-9 rounded-lg" />

        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* grid 2x2 */}
      <div className="grid aspect-16/10 grid-cols-2 grid-rows-2 gap-3 rounded-xl p-2">
        <Skeleton className="rounded-lg" />
        <Skeleton className="rounded-lg" />
        <Skeleton className="rounded-lg" />
        <Skeleton className="rounded-lg" />
      </div>
    </Card>
  );
}
