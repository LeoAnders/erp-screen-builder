"use client";

import Link from "next/link";
import { FileText, Image as ImageIcon, LayoutGrid } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ProjectFilePreview } from "@/components/projects/project-types";

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
  return (
    <TableRow className="border-b border-border/60 hover:bg-muted/20">
      <TableCell className="min-w-[320px]">
        <Link
          href={href}
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

function KindIcon({
  kind,
  className,
}: {
  kind?: ProjectFilePreview["kind"];
  className?: string;
}) {
  const Icon =
    kind === "image" ? ImageIcon : kind === "doc" ? FileText : LayoutGrid;

  return <Icon className={className} />;
}
