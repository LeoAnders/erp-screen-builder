"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";
import type { ProjectFile } from "./project-types";

type FileCardProps = {
  file: ProjectFile;
  href?: string;
  className?: string;
};

export function FileCard({ file, href, className }: FileCardProps) {
  const relativeDate = formatRelative(file.updatedAt ?? file.createdAt);
  const linkHref = href ?? `/projects/${file.projectId}/files/${file.id}`;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card/40 p-3 transition",
        "hover:bg-card/70 hover:shadow-sm",
        "h-[180px]",
        className
      )}
    >
      <Link
        href={linkHref}
        className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="flex h-full flex-col px-1 pt-1">
          <div className="flex items-start">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
              <FileText className="size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm font-medium leading-snug line-clamp-2">
              {file.name}
            </p>
          </div>

          <div className="mt-auto pt-3">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-5 w-5 shrink-0">
                {file.editedBy?.avatarSrc ? (
                  <AvatarImage
                    src={file.editedBy.avatarSrc}
                    alt={file.editedBy.name}
                  />
                ) : null}
                <AvatarFallback>
                  {file.editedBy?.name
                    ? file.editedBy.name.slice(0, 1).toUpperCase()
                    : file.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <p className="text-xs text-muted-foreground truncate">
                {relativeDate ?? "—"}
                {file.editedBy?.name ? ` • ${file.editedBy.name}` : ""}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
