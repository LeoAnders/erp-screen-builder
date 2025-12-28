"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { FileCard } from "@/components/projects/file-card";
import { FileRow } from "@/components/projects/file-row";
import type { ProjectFile } from "@/components/projects/project-types";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError, formatRelative, getErrorMessage } from "@/lib/utils";
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

function makeMockFiles(projectId: string): ProjectFile[] {
  return [
    {
      id: "f1a2b3c4-d5e6-7890-abcd-ef1234567890",
      name: "GCO",
      projectId,
      createdAt: "2025-12-20T10:00:00Z",
      updatedAt: "2025-12-20T14:30:00Z",
      editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
    },
    {
      id: "f2b3c4d5-e6f7-8901-bcde-f12345678901",
      name: "Screen Builder de Interfaces",
      projectId,
      createdAt: "2025-12-23T09:00:00Z",
      updatedAt: "2025-12-25T16:45:00Z",
      editedBy: { name: "Ana", avatarSrc: "/avatars/02.png" },
    },
    {
      id: "f3c4d5e6-f7a8-9012-cdef-123456789012",
      name: "@December 10, 2025 2:31 PM",
      projectId,
      createdAt: "2025-12-10T14:31:00Z",
      updatedAt: "2025-12-13T11:20:00Z",
      editedBy: { name: "Roberto", avatarSrc: "/avatars/03.png" },
    },
    {
      id: "f4d5e6f7-a8b9-0123-def0-234567890123",
      name: "Especificação Principal do Projeto",
      projectId,
      createdAt: "2025-12-22T08:00:00Z",
      updatedAt: "2025-12-25T10:15:00Z",
      editedBy: { name: "Ana", avatarSrc: "/avatars/02.png" },
    },
    {
      id: "f5e6f7a8-b9c0-1234-ef01-345678901234",
      name: "Configurações do Sistema",
      projectId,
      createdAt: "2025-09-09T10:00:00Z",
      updatedAt: "2025-09-09T15:30:00Z",
      editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
    },
    {
      id: "f6f7a8b9-c0d1-2345-f012-456789012345",
      name: "Layout Principal",
      projectId,
      createdAt: "2025-09-08T14:00:00Z",
      updatedAt: "2025-09-09T09:45:00Z",
      editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
    },
    {
      id: "f7a8b9c0-d1e2-3456-0123-567890123456",
      name: "Dashboard Overview",
      projectId,
      createdAt: "2025-09-07T11:00:00Z",
      updatedAt: "2025-09-09T08:20:00Z",
      editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
    },
    {
      id: "f8b9c0d1-e2f3-4567-1234-678901234567",
      name: "Formulário de Cadastro",
      projectId,
      createdAt: "2025-09-06T16:00:00Z",
      updatedAt: "2025-09-09T12:10:00Z",
      editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
    },
    {
      id: "f9c0d1e2-f3a4-5678-2345-789012345678",
      name: "Relatórios Financeiros",
      projectId,
      createdAt: "2025-09-05T09:00:00Z",
      updatedAt: "2025-09-09T14:55:00Z",
      editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
    },
    {
      id: "f0d1e2f3-a4b5-6789-3456-890123456789",
      name: "Gestão de Usuários",
      projectId,
      createdAt: "2025-09-04T13:00:00Z",
      updatedAt: "2025-09-09T16:40:00Z",
      editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
    },
    {
      id: "f1e2f3a4-b5c6-7890-4567-901234567890",
      name: "Painel de Controle",
      projectId,
      createdAt: "2025-09-03T10:30:00Z",
      updatedAt: "2025-09-09T11:25:00Z",
      editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
    },
  ];
}

async function fetchFiles(projectId: string): Promise<ProjectFile[]> {
  const res = await fetch(`/api/projects/${projectId}/files`, {
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

  const json = await res.json();
  return json.items as ProjectFile[];
}

export default function ProjectFilesPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;

  // Proteger contra parâmetros ausentes
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

  const [view, setView] = useState<"cards" | "list">("cards");
  const showCards = view === "cards";

  const [sortBy, setSortBy] = useState<"alphabetical" | "lastModified">(
    "lastModified"
  );
  const [order, setOrder] = useState<"newest" | "oldest">("newest");

  const useMocks =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_MOCKS === "true";

  const filesQuery = useQuery({
    queryKey: ["project-files", projectId],
    queryFn: async () => {
      if (useMocks) return makeMockFiles(projectId);
      try {
        return await fetchFiles(projectId);
      } catch {
        return makeMockFiles(projectId);
      }
    },
  });

  const filesLoading = filesQuery.isLoading || filesQuery.isPending;
  const items = useMemo(() => filesQuery.data ?? [], [filesQuery.data]);

  const sortedItems = useSorting({
    items,
    sortBy,
    order,
    getDate: (p) => p.updatedAt ?? p.createdAt,
    getName: (p) => p.name,
  });

  const hasFiles = items.length > 0;

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
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
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
        onViewChange={(v) => setView(v)}
      />

      <div className="flex-1 flex flex-col">{content}</div>
    </PageContainer>
  );
}

function FileCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
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
