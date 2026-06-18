"use client";

import { useMemo, useState } from "react";
import { Braces, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InspectorTab = "properties" | "code";

type Props = {
  selectedScreenName?: string;
};

export function InspectorPanel({ selectedScreenName = "CCTRIB100" }: Props) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("properties");

  const mockCode = useMemo(
    () =>
      JSON.stringify(
        {
          rotina: selectedScreenName,
          titulo: "Cadastro de Tributos",
          modulo: "escrituracao",
          versao: "1.0",
          layout: "form",
          campos: [
            {
              id: "empresaCodigo",
              label: "Codigo da Empresa",
              tipo: "inteiro",
              largura: 55,
              obrigatorio: true,
              f7: true,
              f8: true,
              lookup: {
                tabela: "EMPRESA",
                displayField: "empresaNome",
                displayLargura: 220,
              },
            },
            { id: "descricao", tipo: "string", largura: 380 },
            { id: "dataValidade", tipo: "data" },
            { id: "situacao", tipo: "combo", default: "A" },
            { id: "aliquota", tipo: "decimal", decimais: 3 },
          ],
          botoes: [
            { id: "salvar", tipo: "primary", atalho: "F2" },
            { id: "excluir", tipo: "danger", atalho: "F5" },
            { id: "cancelar", tipo: "default", atalho: "ESC" },
          ],
        },
        null,
        2,
      ),
    [selectedScreenName],
  );

  return (
    <aside className="flex h-full w-75 shrink-0 flex-col border-l border-border bg-background text-foreground">
      <div className="flex h-12 shrink-0 items-end gap-6 border-b border-border px-4">
        <InspectorTabButton
          active={activeTab === "properties"}
          onClick={() => setActiveTab("properties")}
        >
          Propriedades
        </InspectorTabButton>
        <InspectorTabButton
          active={activeTab === "code"}
          onClick={() => setActiveTab("code")}
        >
          Código
        </InspectorTabButton>
      </div>

      {activeTab === "properties" ? (
        <PropertiesPanel />
      ) : (
        <CodePanel code={mockCode} selectedScreenName={selectedScreenName} />
      )}
    </aside>
  );
}

function InspectorTabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "h-12 border-b border-transparent text-[12px] font-semibold transition-colors",
        active
          ? "border-[#ffffff] text-white"
          : "text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function PropertiesPanel() {
  return (
    <div className="main-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5">
      <section className="pb-4">
        <h3 className="mb-3 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
          PROPRIEDADES
        </h3>
      </section>
    </div>
  );
}

function CodePanel({
  code,
  selectedScreenName,
}: {
  code: string;
  selectedScreenName: string;
}) {
  return (
    <div className="main-scrollbar min-h-0 flex-1 overflow-auto">
      <div className="sticky top-0 z-10 flex h-9 items-center gap-2 border-b border-border bg-background px-4">
        <span className="rounded bg-[#0b7f64] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          json
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
          {selectedScreenName}.schema
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 text-muted-foreground"
          aria-label="Copiar código"
        >
          <Copy className="size-3.5" />
        </Button>
      </div>

      <div className="px-4 py-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Braces className="size-3.5" />
          <span>{selectedScreenName}.schema.json</span>
        </div>
        <pre className="wrap-break-word whitespace-pre-wrap font-mono text-[11px] leading-5 text-[#ff8a3d]">
          {code}
        </pre>
      </div>
    </div>
  );
}
