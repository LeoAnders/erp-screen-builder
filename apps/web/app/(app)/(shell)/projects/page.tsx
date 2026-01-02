"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Plus, FolderOpen } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { Card } from "@/components/ui/card";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectRow } from "@/components/projects/project-row";
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

export default function ProjectsPage() {
  const [view, setView] = useState<"cards" | "list">("cards");
  const showCards = view === "cards";

  const [sortBy, setSortBy] = useState<"alphabetical" | "lastModified">(
    "lastModified",
  );
  const [order, setOrder] = useState<"newest" | "oldest">("newest");

  const teamsQuery = useTeams();
  const { activeTeamId } = useTeamStore();
  const projectsQuery = useProjects(activeTeamId);

  const projectsLoading =
    teamsQuery.isLoading || projectsQuery.isLoading || projectsQuery.isPending;
  const items = useMemo(() => projectsQuery.data ?? [], [projectsQuery.data]);
  // Ordena os projetos conforme critérios selecionados na UI.
  const sortedItems = useSorting({
    items,
    sortBy,
    order,
    getDate: (p) => p.updatedAt ?? p.createdAt,
    getName: (p) => p.name,
  });
  const hasProjects = items.length > 0;

  let content: ReactNode;

  if (!activeTeamId && !teamsQuery.isLoading) {
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
          "Não foi possível recuperar a lista de projetos.",
        )}
        onRetry={() => projectsQuery.refetch()}
        error={projectsQuery.error}
      />
    );
  } else if (projectsLoading) {
    content = showCards ? <ProjectCardsSkeleton /> : <ProjectTableSkeleton />;
  } else if (!hasProjects) {
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
        {sortedItems.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            fileCount={project.fileCount}
            previews={project.previews}
          />
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
          {sortedItems.map((project) => (
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
      />

      <ListToolbar
        sortBy={sortBy}
        order={order}
        view={view}
        onSortByChange={(v) => setSortBy(v)}
        onOrderChange={(v) => setOrder(v)}
        onViewChange={(v) => setView(v)}
      />

      <div className="flex-1 flex flex-col">{content}</div>
    </PageContainer>
  );
}

function ProjectCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Card key={idx} className="rounded-2xl p-3">
          <div className="grid aspect-16/10 grid-cols-2 gap-3 rounded-xl p-2">
            <Skeleton className="rounded-lg" />
            <Skeleton className="rounded-lg" />
            <Skeleton className="rounded-lg" />
            <Skeleton className="rounded-lg" />
          </div>
          <div className="px-1 pb-1 pt-3 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ProjectTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Projeto</TableHead>
          <TableHead className="w-[120px]">Arquivos</TableHead>
          <TableHead className="w-[180px] text-left">Atualizado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, idx) => (
          <TableRow key={idx} className="border-b">
            <TableCell className="p-4">
              <Skeleton className="h-4 w-56" />
            </TableCell>
            <TableCell className="p-4">
              <Skeleton className="h-4 w-10" />
            </TableCell>
            <TableCell className="p-4">
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, previewIdx) => (
                  <Skeleton key={previewIdx} className="h-10 w-10 rounded-lg" />
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

