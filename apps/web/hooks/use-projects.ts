import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/lib/utils";
import type { ProjectListItemDTO } from "@/lib/dtos";
import type { Project, ProjectFilePreview } from "@/components/projects/project-types";
import { templateToKind } from "@/lib/project-kinds";

async function fetchProjects(teamId: string): Promise<ProjectListItemDTO[]> {
  const res = await fetch(`/api/projects?teamId=${teamId}`, { method: "GET" });

  if (!res.ok) {
    let body: ApiError | undefined;
    try {
      body = await res.json();
    } catch {
      /* noop */
    }
    throw body ?? new Error("Não foi possível carregar os projetos");
  }

  const json = await res.json();
  return json.items as ProjectListItemDTO[];
}

function mapPreview(preview: ProjectListItemDTO["previews"][number]): ProjectFilePreview {
  return {
    id: preview.id,
    kind: templateToKind(preview.template),
    description: preview.name,
  };
}

export function useProjects(teamId: string | null) {
  return useQuery<Project[], ApiError>({
    queryKey: ["projects", teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const items = await fetchProjects(teamId);
      return items.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        teamId: project.teamId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        fileCount: project.fileCount,
        previews: project.previews.slice(0, 4).map(mapPreview),
      }));
    },
    enabled: Boolean(teamId),
  });
}
