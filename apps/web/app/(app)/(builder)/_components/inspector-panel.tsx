"use client";

import { useMemo, useState } from "react";
import { Braces, Copy, MousePointerClick } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { CANVAS_KIND_META, type CanvasComponent } from "./canvas/canvas.types";

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
  const components = useCanvasStore((s) => s.components);
  const selectedId = useCanvasStore((s) => s.selectedId);
  const updateSelected = useCanvasStore((s) => s.updateSelected);

  const selectedIndex = components.findIndex((c) => c.id === selectedId);
  const selected = selectedIndex >= 0 ? components[selectedIndex] : null;

  if (!selected) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <MousePointerClick className="size-6 text-muted-foreground/60" />
        <p className="text-[13px] text-muted-foreground">
          Selecione um componente no canvas para editar suas propriedades.
        </p>
      </div>
    );
  }

  const meta = CANVAS_KIND_META[selected.kind];

  return (
    <div className="main-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
      {/* Badge do componente */}
      <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-[#E84F3D]/15 bg-[#E84F3D]/[0.07] px-3 py-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#E84F3D]/15 text-[12px] font-bold text-[#f87171]">
          {meta.label.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-bold leading-tight text-[#f87171]">
            {meta.label}
          </div>
          <div className="mt-0.5 truncate font-mono text-[9.5px] text-muted-foreground">
            {selected.binding ?? "—"} · linha {selectedIndex + 1}
          </div>
        </div>
      </div>

      <section className="space-y-2.5">
        <h3 className="mb-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
          PROPS
        </h3>

        {selected.binding !== undefined ? (
          <PropRow
            label="id"
            value={selected.binding}
            onChange={(v) => updateSelected({ binding: v })}
          />
        ) : null}

        <PropRow
          label={selected.kind === "button" ? "texto" : "label"}
          value={
            selected.kind === "button"
              ? (selected.buttonText ?? "")
              : selected.label
          }
          onChange={(v) =>
            selected.kind === "button"
              ? updateSelected({ buttonText: v })
              : updateSelected({ label: v })
          }
        />

        {selected.kind === "input" ? (
          <>
            <PropRow
              label="value"
              value={selected.value ?? ""}
              onChange={(v) => updateSelected({ value: v })}
            />
            <PropRow
              label="placeholder"
              value={selected.placeholder ?? ""}
              onChange={(v) => updateSelected({ placeholder: v })}
            />
          </>
        ) : null}

        {selected.kind === "select" ? (
          <PropRow
            label="opções"
            value={(selected.options ?? []).join(", ")}
            onChange={(v) =>
              updateSelected({
                options: v
                  .split(",")
                  .map((o) => o.trim())
                  .filter(Boolean),
              })
            }
          />
        ) : null}

        {selected.kind === "button" ? (
          <SelectRow
            label="variante"
            value={selected.buttonVariant ?? "default"}
            options={["primary", "default", "danger"]}
            onChange={(v) =>
              updateSelected({
                buttonVariant: v as CanvasComponent["buttonVariant"],
              })
            }
          />
        ) : null}
      </section>
    </div>
  );
}

function PropRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-[82px] shrink-0 text-[13px] leading-tight text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 rounded-[5px] border border-border bg-[#141414] px-2.5 py-1.5 font-mono text-[10.5px] text-[#fb923c] outline-none focus:border-[#E84F3D]/50"
      />
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-[82px] shrink-0 text-[13px] leading-tight text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 rounded-[5px] border border-border bg-[#141414] px-2.5 py-1.5 font-mono text-[10.5px] text-[#fb923c] outline-none focus:border-[#E84F3D]/50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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
