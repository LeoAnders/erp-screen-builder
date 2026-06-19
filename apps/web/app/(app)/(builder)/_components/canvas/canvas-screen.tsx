"use client";

import { useCanvasStore } from "@/lib/stores/canvas-store";

import { AlignmentGuides } from "./alignment-guides";
import { canvasBodyRef } from "./canvas-body-ref";
import { useCanvasDragContext } from "./canvas-drag-context";
import { ErpButton } from "./erp-button";
import { ErpField } from "./erp-field";

const ARIAL = "Arial, sans-serif";

type Props = {
  routineName: string;
  title?: string;
};

/**
 * Formulário ERP com posicionamento absoluto livre.
 * Canvas branco sem scroll — componentes ficam dentro dos limites do artboard.
 */
export function CanvasScreen({
  routineName,
  title = "Cadastro de Tributos",
}: Props) {
  const components = useCanvasStore((s) => s.components);
  const selectedId = useCanvasStore((s) => s.selectedId);
  const select = useCanvasStore((s) => s.select);
  const { guides } = useCanvasDragContext();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Cabeçalho teal */}
      <div
        className="flex shrink-0 items-start justify-between px-[14px] pb-2 pt-[9px]"
        style={{ background: "#1B7E8A" }}
      >
        <div>
          <div
            className="text-[14px] font-bold text-white"
            style={{ fontFamily: ARIAL }}
          >
            {title}
          </div>
          <div
            className="mt-[2px] text-[11px]"
            style={{ fontFamily: ARIAL, color: "rgba(255,255,255,.58)" }}
          >
            ... SMS - Escrituração &gt;&gt; Cadastros &gt;&gt;{" "}
            <strong style={{ color: "rgba(255,255,255,.88)" }}>{title}</strong>
          </div>
        </div>
        <span
          className="ml-5 whitespace-nowrap pt-[2px] text-[10px]"
          style={{ fontFamily: ARIAL, color: "rgba(255,255,255,.32)" }}
        >
          {routineName}
        </span>
      </div>

      {/* Área de posicionamento livre — branca, sem scroll */}
      <div
        ref={canvasBodyRef}
        className="relative min-h-0 flex-1 overflow-hidden"
        onClick={() => select(null)}
      >
        <AlignmentGuides guides={guides} />

        {components.map((component) =>
          component.kind === "button" ? (
            <ErpButton
              key={component.id}
              component={component}
              selected={component.id === selectedId}
              onSelect={select}
            />
          ) : (
            <ErpField
              key={component.id}
              component={component}
              selected={component.id === selectedId}
              onSelect={select}
            />
          ),
        )}
      </div>
    </div>
  );
}
