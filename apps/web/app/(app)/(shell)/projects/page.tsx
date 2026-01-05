"use client";

import { useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Plus, FolderOpen } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ProjectCard,
  ProjectCardSkeleton,
} from "@/components/projects/project-card";
import {
  ProjectRow,
  ProjectTableRowSkeleton,
} from "@/components/projects/project-row";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelative, getErrorMessage } from "@/lib/utils";
import { useSorting } from "@/hooks/use-sorting";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { useProjects } from "@/hooks/use-projects";
import { useTeams } from "@/hooks/use-teams";
import { useTeamStore } from "@/lib/stores/team-store";
import { useDeferredLoading } from "@/hooks/use-deferred-loading";
import { useViewPreferenceStore } from "@/lib/stores/view-preference-store";
import { CreateProjectModal } from "@/components/modals/create-project-modal";

export default function ProjectsPage() {
  const { projectsView, setProjectsView } = useViewPreferenceStore();
  const [view, setView] = useState<"cards" | "list">(projectsView);
  const [createOpen, setCreateOpen] = useState(false);

  // Sincroniza o estado local com a store quando ela muda
  useEffect(() => {
    setView(projectsView);
  }, [projectsView]);

  // Atualiza a store quando o usuário muda a visualização
  const handleViewChange = (newView: "cards" | "list") => {
    setView(newView);
    setProjectsView(newView);
  };

  const showCards = view === "cards";

  const [sortBy, setSortBy] = useState<"alphabetical" | "lastModified">(
    "lastModified"
  );
  const [order, setOrder] = useState<"newest" | "oldest">("newest");

  const teamsQuery = useTeams();
  const { activeTeamId } = useTeamStore();
  const projectsQuery = useProjects(activeTeamId);

  const items = useMemo(() => projectsQuery.data ?? [], [projectsQuery.data]);
  // Ordena os projetos conforme critérios selecionados na UI.
  const sortedItems = useSorting({
    items,
    sortBy,
    order,
    getDate: (p) => p.updatedAt ?? p.createdAt,
    getName: (p) => p.name,
  });

  const hasProjectsData =
    projectsQuery.data != null || projectsQuery.isPlaceholderData;
  const showSkeleton = useDeferredLoading(
    Boolean(activeTeamId) && projectsQuery.isPending && !hasProjectsData,
    180
  );
  const isEmpty = hasProjectsData && items.length === 0;

  let content: ReactNode;

  if (!activeTeamId && teamsQuery.data != null) {
    content = (
      <EmptyState
        icon={FolderOpen}
        title="Selecione um time"
        description="Escolha um time na sidebar para visualizar os projetos."
      />
    );
  } else if (projectsQuery.isError) {
    content = (
      <ErrorState
        title="Erro ao carregar projetos"
        message={getErrorMessage(
          projectsQuery.error,
          "Não foi possível recuperar a lista de projetos."
        )}
        onRetry={() => projectsQuery.refetch()}
        error={projectsQuery.error}
      />
    );
  } else if (isEmpty) {
    content = (
      <EmptyState
        icon={FolderOpen}
        title="Nenhum projeto encontrado"
        description='Crie seu primeiro projeto clicando em "Novo Projeto".'
      />
    );
  } else if (showCards) {
    content = (
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {showSkeleton && !hasProjectsData
          ? Array.from({ length: 6 }).map((_, idx) => (
              <ProjectCardSkeleton key={idx} />
            ))
          : sortedItems.map((project) => (
              <div
                key={project.id}
                className="animate-in fade-in-0 zoom-in-98 duration-120 motion-reduce:animate-none"
              >
                <ProjectCard
                  id={project.id}
                  name={project.name}
                  fileCount={project.fileCount}
                  previews={project.previews}
                />
              </div>
            ))}
      </div>
    );
  } else {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Projeto</TableHead>
            <TableHead>Arquivos</TableHead>
            <TableHead>Atualizado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showSkeleton && !hasProjectsData
            ? Array.from({ length: 5 }).map((_, idx) => (
                <ProjectTableRowSkeleton key={idx} />
              ))
            : sortedItems.map((project) => (
                <ProjectRow
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  fileCount={project.fileCount}
                  previews={project.previews}
                  updatedAt={formatRelative(project.updatedAt)}
                />
              ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <PageContainer className="flex h-full flex-col gap-6">
      <PageHeader
        title="Projetos"
        description="Gerencie e acesse os projetos da equipe"
        actionLabel="Novo Projeto"
        actionIcon={<Plus className="size-4" />}
        onActionClick={() => setCreateOpen(true)}
      />

      <ListToolbar
        sortBy={sortBy}
        order={order}
        view={view}
        onSortByChange={(v) => setSortBy(v)}
        onOrderChange={(v) => setOrder(v)}
        onViewChange={handleViewChange}
      />

      <div className="flex-1 flex flex-col">{content}</div>

      <CreateProjectModal open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
