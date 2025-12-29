"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  Project,
  ProjectFilePreview,
} from "@/components/projects/project-types";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError, formatRelative, getErrorMessage } from "@/lib/utils";
import { useSorting } from "@/hooks/use-sorting";
import { ListToolbar } from "@/components/ui/list-toolbar";

function makeMockProjects(): Project[] {
  const now = Date.now();
  const iso = (ms: number) => new Date(ms).toISOString();

  const mkPrev = (n: number) =>
    Array.from({ length: n }).map((_, i) => ({
      id: `f_${i + 1}`,
      kind: i % 3 === 0 ? "image" : i % 3 === 1 ? "doc" : "frame",
    })) as ProjectFilePreview[];

  //return [];
  return [
    {
      id: "proj_1",
      name: "Team project",
      teamId: "team_1",
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 20),
      updatedAt: iso(now - 1000 * 60 * 25),
      fileCount: 2,
      previews: mkPrev(2),
    },
    {
      id: "proj_2",
      name: "Design system",
      teamId: "team_1",
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 40),
      updatedAt: iso(now - 1000 * 60 * 60 * 6),
      fileCount: 7,
      previews: mkPrev(4),
    },
    {
      id: "proj_3",
      name: "Mobile App",
      teamId: "team_2",
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 10),
      updatedAt: iso(now - 1000 * 60 * 60 * 24 * 2),
      fileCount: 0,
      previews: [],
    },

    {
      id: "proj_4",
      name: "Design system",
      teamId: "team_1",
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 40),
      updatedAt: iso(now - 1000 * 60 * 60 * 6),
      fileCount: 10,
      previews: mkPrev(4),
    },
    {
      id: "proj_5",
      name: "Design system",
      teamId: "team_1",
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 40),
      updatedAt: iso(now - 1000 * 60 * 60 * 6),
      fileCount: 8,
      previews: mkPrev(4),
    },

    {
      id: "proj_6",
      name: "Teste Projeto 6",
      teamId: "team_1",
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 40),
      updatedAt: iso(now - 1000 * 60 * 60 * 6),
      fileCount: 7,
      previews: mkPrev(4),
    },
  ];
}

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects", { method: "GET" });

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
  return json.items as Project[];
}

export default function ProjectsPage() {
  const [view, setView] = useState<"cards" | "list">("cards");
  const showCards = view === "cards";

  const [sortBy, setSortBy] = useState<"alphabetical" | "lastModified">(
    "lastModified"
  );
  const [order, setOrder] = useState<"newest" | "oldest">("newest");

  const useMocks =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_MOCKS === "true";

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (useMocks) return makeMockProjects();
      try {
        return await fetchProjects();
      } catch {
        return makeMockProjects();
      }
    },
  });

  const projectsLoading = projectsQuery.isLoading || projectsQuery.isPending;
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

  if (projectsQuery.isError) {
    content = (
      <ErrorState
        title="Erro ao carregar projetos"
        message={getErrorMessage(
          projectsQuery.error,
          "Não foi possível recuperar a lista de projetos."
        )}
        onRetry={() => projectsQuery.refetch()}
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
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
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
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
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
          <TableHead className="w-[180px]">Atualizado</TableHead>
          <TableHead className="w-[160px] text-left">Atualizado em</TableHead>
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
              <Skeleton className="h-4 w-24" />
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
