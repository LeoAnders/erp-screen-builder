"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { KindIcon } from "@/components/projects/kind-icon";
import { ProjectFilePreview } from "@/components/projects/project-types";
import { projectFilesQueryOptions } from "@/hooks/use-project-files";

export type ProjectRowProps = {
  id: string;
  name: string;
  fileCount: number;
  previews: ProjectFilePreview[];
  updatedAt?: string;
  href?: string;
};

export function ProjectRow({
  id,
  name,
  fileCount,
  previews,
  updatedAt,
  href = `/projects/${id}/files`,
}: ProjectRowProps) {
  const queryClient = useQueryClient();
  const prefetchFiles = useCallback(() => {
    void queryClient.prefetchQuery(projectFilesQueryOptions(id));
  }, [id, queryClient]);

  return (
    <TableRow
      className="border-b border-border/60 hover:bg-muted/20"
      onMouseEnter={prefetchFiles}
    >
      <TableCell className="min-w-[320px]">
        <Link
          href={href}
          onFocus={prefetchFiles}
          className={cn(
            "group flex items-center gap-4 rounded-md px-1 py-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <ProjectMiniGrid previews={previews} />

          <div className="min-w-0">
            <span className="truncate font-medium text-foreground">{name}</span>
          </div>
        </Link>
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {fileCount} {fileCount === 1 ? "arquivo" : "arquivos"}
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {updatedAt ?? "—"}
      </TableCell>
    </TableRow>
  );
}

function ProjectMiniGrid({ previews }: { previews: ProjectFilePreview[] }) {
  const first4 = previews?.slice(0, 4) ?? [];
  const extra = Math.max(0, (previews?.length ?? 0) - 4);

  const hasAny = first4.length > 0;

  return (
    <div
      className={cn(
        "relative shrink-0",
        "h-12 w-20 overflow-hidden rounded-sm",
        "bg-muted/50"
      )}
      aria-label="Miniaturas do projeto"
    >
      {hasAny && (
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px] p-[3px]">
          {first4.map((p) => (
            <MiniPreviewTile key={p.id} preview={p} />
          ))}
        </div>
      )}

      {hasAny && extra > 0 && (
        <div className="absolute -right-1 -top-1 rounded-full bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm ring-1 ring-border/40 backdrop-blur">
          +{extra}
        </div>
      )}
    </div>
  );
}

function MiniPreviewTile({ preview }: { preview: ProjectFilePreview }) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden")}>
      {preview.thumbUrl ? (
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${preview.thumbUrl}")` }}
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-muted-foreground">
          <KindIcon kind={preview.kind} className="h-4 w-4" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0" />
    </div>
  );
}

export function ProjectTableRowSkeleton() {
  return (
    <TableRow className="border-b border-border/60">
      <TableCell className="min-w-[320px] p-4">
        <div className="flex items-center gap-4 px-1 py-2">
          {/* mini-grid  */}
          <Skeleton className="h-12 w-20 rounded-sm" />

          {/* nome */}
          <Skeleton className="h-4 w-48" />
        </div>
      </TableCell>

      {/* Arquivos */}
      <TableCell className="p-4">
        <Skeleton className="h-4 w-24" />
      </TableCell>

      {/* Atualizado em */}
      <TableCell className="p-4">
        <Skeleton className="h-4 w-20" />
      </TableCell>
    </TableRow>
  );
}
