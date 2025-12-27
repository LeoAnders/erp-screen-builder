"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutGrid,
  List,
  Plus,
  RefreshCcw,
  TriangleAlert,
  ChevronDown,
  FolderOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ApiError = { error: { message: string } };

function getErrorMessage(error: unknown, fallback: string) {
  if (!error) return fallback;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "error" in error) {
    const apiError = error as ApiError;
    return apiError.error?.message ?? fallback;
  }
  return fallback;
}

function formatRelative(dateString?: string) {
  if (!dateString) return undefined;

  const date = new Date(dateString);
  const diffMs = date.getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);

  const formatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  if (Math.abs(diffMins) < 60) return formatter.format(diffMins, "minute");
  const diffHours = Math.round(diffMins / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

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
  const sortedItems = useMemo(() => {
    const sorted = [...items];

    sorted.sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name, "pt-BR");
      }

      const aDate = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      const bDate = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
      return bDate - aDate;
    });

    return order === "oldest" ? sorted.reverse() : sorted;
  }, [items, order, sortBy]);
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
    content = <ProjectsEmptyState />;
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

  const sortLabel =
    sortBy === "alphabetical" ? "Alfabética" : "Última modificação";
  const orderLabel =
    order === "newest" ? "Mais novos primeiro" : "Mais antigos primeiro";

  return (
    <PageContainer className="flex h-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Projetos</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie e acesse os projetos da equipe
          </p>
        </div>

        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="flex items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[220px] justify-between gap-2"
            >
              <span className="truncate">{sortLabel}</span>
              <ChevronDown className="size-4 shrink-0 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[240px]">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sortBy}
              onValueChange={(val) =>
                setSortBy(val as "alphabetical" | "lastModified")
              }
            >
              <DropdownMenuRadioItem value="alphabetical">
                Alfabética
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lastModified">
                Última modificação
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Ordem</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={order}
              onValueChange={(val) => setOrder(val as "newest" | "oldest")}
            >
              <DropdownMenuRadioItem value="oldest">
                Mais antigas primeiro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="newest">
                Mais novas primeiro
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(val) => val && setView(val as "cards" | "list")}
        >
          <ToggleGroupItem value="cards" aria-label="Ver em cards">
            <LayoutGrid className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Ver em lista">
            <List className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex-1 flex flex-col">{content}</div>
    </PageContainer>
  );
}

function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
      <TriangleAlert className="size-5 text-destructive" />
      <div className="space-y-1">
        <p className="font-medium text-destructive">{title}</p>
        <p className="text-sm text-destructive/90">{message}</p>
        {onRetry ? (
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="mt-2 gap-2"
          >
            <RefreshCcw className="size-4" />
            Tentar novamente
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function ProjectsEmptyState() {
  return (
    <div className="grid flex-1 place-items-center">
      <div className="flex max-w-md flex-col items-center px-6 text-center">
        {/* Ícone */}
        <FolderOpen className="mb-5 size-11 text-muted-foreground/70" />

        <h2 className="text-[1.25rem] font-semibold tracking-tight text-foreground">
          Nenhum projeto encontrado
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Crie seu primeiro projeto clicando em{" "}
          <span className="font-medium text-foreground/80">“Novo Projeto”</span>
          .
        </p>
      </div>
    </div>
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
