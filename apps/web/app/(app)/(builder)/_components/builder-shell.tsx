"use client";

import { useEffect, useState } from "react";
import { Boxes, Hand, File, MousePointer2, Redo2, Undo2 } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { NotFoundScreen } from "@/components/ui/not-found-screen";
import { useFileDetail } from "@/hooks/use-file-detail";
import { useEditorStore } from "@/lib/stores/editor-store";
import { isApiError } from "@/lib/utils";

import { BottomToolbar } from "./bottom-toolbar";
import { CanvasPlaceholder } from "./canvas-placeholder";
import { BuilderSidebar, type RailItem, type SidebarTab } from "./sidebar";
import type { ToolbarItem, ToolKey } from "./builder.types";
import {
  DEFAULT_DOC_TITLE,
  DEFAULT_ORIGIN_HREF,
  DEFAULT_ORIGIN_LABEL,
} from "./builder.types";
import { BuilderLoading } from "./builder-loading";

type Props = {
  docId: string;
  docTitle?: string;
  originLabel?: string;
  originHref?: string;
};

const RAIL_ITEMS: RailItem[] = [
  { key: "file", label: "Arquivo", icon: File },
  { key: "components", label: "Componentes", icon: Boxes },
];

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { key: "select", label: "Selecionar", icon: MousePointer2 },
  { key: "hand", label: "Mover", icon: Hand },
  { key: "undo", label: "Desfazer", icon: Undo2, disabled: true },
  { key: "redo", label: "Refazer", icon: Redo2, disabled: true },
];

export function BuilderShell({
  docId,
  docTitle,
  originLabel = DEFAULT_ORIGIN_LABEL,
  originHref = DEFAULT_ORIGIN_HREF,
}: Props) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("file");
  const [activeTool, setActiveTool] = useState<ToolKey>("select");

  const fileDetailQuery = useFileDetail(docId);

  const storeDocId = useEditorStore((s) => s.docId);
  const hasInitialized = useEditorStore((s) => s.hasInitialized);
  const initializeFromFile = useEditorStore((s) => s.initializeFromFile);

  useEffect(() => {
    if (!fileDetailQuery.data) return;

    if (hasInitialized && storeDocId === docId) return;

    initializeFromFile({ docId, payload: fileDetailQuery.data });
  }, [
    docId,
    fileDetailQuery.data,
    hasInitialized,
    initializeFromFile,
    storeDocId,
  ]);

  const hasData =
    fileDetailQuery.data != null || fileDetailQuery.isPlaceholderData;
  const isColdStart = fileDetailQuery.isPending && !hasData;

  // Loading global: não renderiza o builder até ter dados
  if (isColdStart) {
    return <BuilderLoading />;
  }

  // Error state
  if (fileDetailQuery.isError) {
    const error = fileDetailQuery.error;
    const isNotFound =
      isApiError(error) && error.error?.code === "FILE_NOT_FOUND";

    if (isNotFound) {
      return <NotFoundScreen />;
    }
  }

  const origin = fileDetailQuery.data?.origin;
  const effectiveOriginLabel =
    origin?.type === "project" ? origin.project_name : originLabel;
  const effectiveOriginHref =
    origin?.type === "project"
      ? `/projects/${origin.project_id}/files`
      : originHref;

  const effectiveDocTitle =
    fileDetailQuery.data?.name ?? docTitle ?? DEFAULT_DOC_TITLE;

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-background text-foreground">
      <BuilderSidebar
        docTitle={effectiveDocTitle}
        originLabel={effectiveOriginLabel}
        originHref={effectiveOriginHref}
        railItems={RAIL_ITEMS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <Separator orientation="vertical" />

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <CanvasPlaceholder />

        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <BottomToolbar
            items={TOOLBAR_ITEMS}
            activeKey={activeTool}
            onChange={setActiveTool}
          />
        </div>
      </div>
    </div>
  );
}
