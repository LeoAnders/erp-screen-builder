'use client';

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import type { Project, ProjectFile } from "@/components/projects/project-types";
import {
  matchBreadcrumbConfig,
  normalizePathname,
  resolveBreadcrumbs,
  type BreadcrumbLabels,
  type BreadcrumbMatch,
  type ResolvedBreadcrumb,
} from "@/lib/navigation/breadcrumbs-registry";

export function useBreadcrumbs(pathnameOverride?: string): ResolvedBreadcrumb[] {
  const pathname = usePathname();
  const normalized = useMemo(
    () => normalizePathname(pathnameOverride ?? pathname ?? "/"),
    [pathname, pathnameOverride]
  );

  const match = useMemo<BreadcrumbMatch | null>(
    () => matchBreadcrumbConfig(normalized),
    [normalized]
  );

  const labels = useBreadcrumbLabels(match?.params);

  return useMemo(
    () => resolveBreadcrumbs(normalized, { labels, match }),
    [labels, match, normalized]
  );
}

function useBreadcrumbLabels(
  params?: Record<string, string>
): BreadcrumbLabels | undefined {
  const queryClient = useQueryClient();

  const projectId = params?.projectId;
  const fileId = params?.fileId;

  return useMemo(() => {
    if (!projectId && !fileId) return undefined;

    const projectName = projectId
      ? getProjectNameFromCache(queryClient, projectId)
      : undefined;

    const fileName =
      projectId && fileId
        ? getFileNameFromCache(queryClient, projectId, fileId)
        : undefined;

    return { projectName, fileName };
  }, [fileId, projectId, queryClient]);
}

function getProjectNameFromCache(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string
): string | undefined {
  const projects = queryClient.getQueryData<Project[]>(["projects"]);
  const found = projects?.find((project) => project.id === projectId);
  return found?.name;
}

function getFileNameFromCache(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
  fileId: string
): string | undefined {
  const files = queryClient.getQueryData<ProjectFile[]>([
    "project-files",
    projectId,
  ]);
  const found = files?.find((file) => file.id === fileId);
  return found?.name;
}

