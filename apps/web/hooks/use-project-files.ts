import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/lib/utils";
import type { ProjectFileDTO } from "@/lib/dtos";
import type { ProjectFile } from "@/components/projects/project-types";
import { templateToKind } from "@/lib/project-kinds";

type ProjectMeta = { id: string; name: string; teamId: string };

type ProjectFilesResponse = {
  project: ProjectMeta;
  items: ProjectFileDTO[];
};

async function fetchProjectFiles(
  projectId: string,
): Promise<ProjectFilesResponse> {
  const res = await fetch(`/api/files?projectId=${projectId}`, {
    method: "GET",
  });

  if (!res.ok) {
    let body: ApiError | undefined;
    try {
      body = await res.json();
    } catch {
      /* noop */
    }
    throw body ?? new Error("Não foi possível carregar os arquivos do projeto");
  }

  return (await res.json()) as ProjectFilesResponse;
}

export function projectFilesQueryOptions(projectId: string) {
  return {
    queryKey: ["project-files", projectId] as const,
    queryFn: async () => {
      const data = await fetchProjectFiles(projectId);
      return {
        project: data.project,
        items: data.items.map((file) => ({
          id: file.id,
          name: file.name,
          projectId: file.projectId,
          template: file.template,
          revision: file.revision,
          kind: templateToKind(file.template),
          createdAt: undefined,
          updatedAt: file.updatedAt,
          editedBy: file.editedBy ?? undefined,
        })),
      };
    },
  };
}

export function useProjectFiles(projectId: string | null) {
  return useQuery<{ project: ProjectMeta; items: ProjectFile[] }, ApiError>({
    queryKey: ["project-files", projectId],
    enabled: Boolean(projectId),
    queryFn: projectId
      ? projectFilesQueryOptions(projectId).queryFn
      : async () => ({ project: null as any, items: [] }),
  });
}
