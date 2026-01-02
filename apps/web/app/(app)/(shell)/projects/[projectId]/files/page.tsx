"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Plus } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { FileCard } from "@/components/projects/file-card";
import { FileRow } from "@/components/projects/file-row";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelative, getErrorMessage } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { useSorting } from "@/hooks/use-sorting";
import { useProjectFiles } from "@/hooks/use-project-files";
import { usePageContextStore } from "@/lib/stores/page-context-store";
import { useTeamStore } from "@/lib/stores/team-store";

export default function ProjectFilesPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId ?? null;

  const [view, setView] = useState<"cards" | "list">("cards");
  const showCards = view === "cards";

  const [sortBy, setSortBy] = useState<"alphabetical" | "lastModified">(
    "lastModified"
  );
  const [order, setOrder] = useState<"newest" | "oldest">("newest");

  const { activeTeamId, setActiveTeamId } = useTeamStore();
  const { setProjectContext, clearProjectContext } = usePageContextStore();

  const filesQuery = useProjectFiles(projectId);

  const syncedProjectTeamIdRef = useRef<string | null>(null);

  const projectTeamId = filesQuery.data?.project?.teamId ?? null;
  const projectName = filesQuery.data?.project?.name ?? null;

  const filesLoading = filesQuery.isLoading || filesQuery.isPending;

  // Sempre que mudar de projeto, permite um novo autosync
  useEffect(() => {
    syncedProjectTeamIdRef.current = null;
  }, [projectId]);

  useEffect(() => {
    if (!projectTeamId) return;

    if (syncedProjectTeamIdRef.current === projectTeamId) return;

    if (!activeTeamId || projectTeamId !== activeTeamId) {
      setActiveTeamId(projectTeamId, { source: "auto" });
    }

    syncedProjectTeamIdRef.current = projectTeamId;
  }, [activeTeamId, projectTeamId, setActiveTeamId]);

  useEffect(() => {
    if (projectId && projectName) {
      setProjectContext({ projectId, projectName });
    }

    return () => clearProjectContext();
  }, [clearProjectContext, projectId, projectName, setProjectContext]);

  const items = useMemo(
    () => filesQuery.data?.items ?? [],
    [filesQuery.data?.items]
  );

  const sortedItems = useSorting({
    items,
    sortBy,
    order,
    getDate: (p) => p.updatedAt ?? p.createdAt,
    getName: (p) => p.name,
  });

  // Proteger contra parâmetros ausentes (após os hooks)
  if (!projectId) {
    return (
      <PageContainer className="flex h-full flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Arquivos do Projeto</h1>
            <p className="text-muted-foreground text-sm">
              Projeto não encontrado.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  const hasFiles = items.length > 0;

  const projectLabel =
    projectName ?? `Projeto ${shortId(projectId ?? undefined)}`;

  let content;

  if (filesQuery.isError) {
    content = (
      <ErrorState
        title="Erro ao carregar arquivos"
        message={getErrorMessage(
          filesQuery.error,
          "Não foi possível recuperar a lista de arquivos."
        )}
        onRetry={() => filesQuery.refetch()}
        error={filesQuery.error}
      />
    );
  } else if (filesLoading) {
    content = showCards ? <FileCardsSkeleton /> : <FileTableSkeleton />;
  } else if (!hasFiles) {
    content = (
      <EmptyState
        icon={FileText}
        title="Nenhum arquivo encontrado"
        description='Envie ou crie seu primeiro arquivo clicando em "Novo Arquivo".'
      />
    );
  } else if (showCards) {
    content = (
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {sortedItems.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    );
  } else {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Arquivo</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Atualizado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              href={`/projects/${projectId}/files/${file.id}`}
              updatedAtLabel={formatRelative(file.updatedAt)}
            />
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <PageContainer className="flex h-full flex-col gap-6">
      <PageHeader
        title="Arquivos do Projeto"
        description={
          <>
            <span className="font-semibold text-foreground">
              {projectLabel}
            </span>{" "}
            · Visualize e gerencie os arquivos do projeto
          </>
        }
        actionLabel="Novo Arquivo"
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

function FileCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
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

function FileTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Arquivo</TableHead>
          <TableHead className="w-[160px]">Tipo</TableHead>
          <TableHead className="w-[180px]">Atualizado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, idx) => (
          <TableRow key={idx} className="border-b">
            <TableCell className="p-4">
              <Skeleton className="h-4 w-56" />
            </TableCell>
            <TableCell className="p-4">
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="p-4">
              <Skeleton className="h-4 w-24" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function shortId(value: string | undefined): string {
  if (!value) return "";
  if (value.length > 12) return value.slice(0, 8);
  return value;
}
