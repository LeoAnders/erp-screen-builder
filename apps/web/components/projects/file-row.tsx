"use client";

import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { KindIcon, kindLabels } from "./kind-icon";
import type { ProjectFile } from "./project-types";

type FileRowProps = {
  file: ProjectFile;
  href?: string;
  updatedAtLabel?: string;
};

export function FileRow({ file, href = "#", updatedAtLabel }: FileRowProps) {
  const kind = file.kind ?? "doc";

  return (
    <TableRow className="border-b border-border/60 hover:bg-muted/20">
      <TableCell className="min-w-[320px]">
        <Link
          href={href}
          className={cn(
            "group flex items-center gap-4 rounded-md px-1 py-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          <div
            className="grid h-12 w-12 place-items-center rounded-lg bg-muted/60 text-muted-foreground"
            aria-label={kindLabels[kind]}
          >
            <KindIcon kind={kind} className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="block max-w-[200px] truncate font-medium text-foreground sm:max-w-[260px] md:max-w-[320px] lg:max-w-[420px]">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {file.editedBy?.name ?? kindLabels[kind]}
            </p>
          </div>
        </Link>
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {kindLabels[kind]}
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {updatedAtLabel ?? "—"}
      </TableCell>
    </TableRow>
  );
}

export function FileTableRowSkeleton() {
  return (
    <TableRow className="border-b border-border/60">
      {/* coluna: ícone + nome + subtítulo */}
      <TableCell className="min-w-[320px]">
        <div className="flex items-center gap-4 px-1 py-2">
          {/* quadrado do ícone */}
          <Skeleton className="h-12 w-12 rounded-lg" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </TableCell>

      {/* coluna: tipo */}
      <TableCell className="text-sm text-muted-foreground">
        <Skeleton className="h-4 w-20" />
      </TableCell>

      {/* coluna: atualizado em */}
      <TableCell className="text-sm text-muted-foreground">
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  );
}
