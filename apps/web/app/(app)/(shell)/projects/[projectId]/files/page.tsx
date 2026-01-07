"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Plus } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { FileCard, FileCardSkeleton } from "@/components/projects/file-card";
import { FileRow, FileTableRowSkeleton } from "@/components/projects/file-row";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelative, getErrorMessage } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { useSorting } from "@/hooks/use-sorting";
import { useProjectFiles } from "@/hooks/use-project-files";
import { usePageContextStore } from "@/lib/stores/page-context-store";
import { useTeamStore } from "@/lib/stores/team-store";
import { useDeferredLoading } from "@/hooks/use-deferred-loading";
import { useViewPreferenceStore } from "@/lib/stores/view-preference-store";

export default function ProjectFilesPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId ?? null;

  const { filesView, setFilesView } = useViewPreferenceStore();
  const [view, setView] = useState<"cards" | "list">(filesView);

  // Sincroniza o estado local com a store quando ela muda
  useEffect(() => {
    setView(filesView);
  }, [filesView]);

  // Atualiza a store quando o usuário muda a visualização
  const handleViewChange = (newView: "cards" | "list") => {
    setView(newView);
    setFilesView(newView);
  };

  const showCards = view === "cards";

  const [sortBy, setSortBy] = useState<"alphabetical" | "lastModified">(
    "lastModified",
  );
  const [order, setOrder] = useState<"newest" | "oldest">("newest");

  const { activeTeamId, setActiveTeamId } = useTeamStore();
  const { setProjectContext, clearProjectContext } = usePageContextStore();

  const filesQuery = useProjectFiles(projectId);

  const syncedProjectTeamIdRef = useRef<string | null>(null);

  const projectTeamId = filesQuery.data?.project?.teamId ?? null;
  const projectName = filesQuery.data?.project?.name ?? null;

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

    return () => {
      const currentContext = usePageContextStore.getState();
      if (currentContext.projectId === projectId) {
        clearProjectContext();
      }
    };
  }, [clearProjectContext, projectId, projectName, setProjectContext]);

  const items = useMemo(
    () => filesQuery.data?.items ?? [],
    [filesQuery.data?.items],
  );

  const hasFilesData = filesQuery.data != null || filesQuery.isPlaceholderData;
  const showSkeleton = useDeferredLoading(
    Boolean(projectId) && filesQuery.isPending && !hasFilesData,
    180,
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

  const isEmpty = hasFilesData && items.length === 0;

  let content;

  if (filesQuery.isError) {
    content = (
      <ErrorState
        title="Erro ao carregar arquivos"
        message={getErrorMessage(
          filesQuery.error,
          "Não foi possível recuperar a lista de arquivos.",
        )}
        onRetry={() => filesQuery.refetch()}
        error={filesQuery.error}
      />
    );
  } else if (isEmpty) {
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
        {showSkeleton && !hasFilesData
          ? Array.from({ length: 6 }).map((_, idx) => (
              <FileCardSkeleton key={idx} />
            ))
          : sortedItems.map((file) => (
              <div
                key={file.id}
                className="animate-in fade-in-0 zoom-in-98 duration-120 motion-reduce:animate-none"
              >
                <FileCard file={file} />
              </div>
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
          {showSkeleton && !hasFilesData
            ? Array.from({ length: 5 }).map((_, idx) => (
                <FileTableRowSkeleton key={idx} />
              ))
            : sortedItems.map((file) => (
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
        description="Visualize e gerencie os arquivos do projeto"
        actionLabel="Novo Arquivo"
        actionIcon={<Plus className="size-4" />}
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
    </PageContainer>
  );
}
