"use client";

import { Trash2 } from "lucide-react";

import { CANVAS_KIND_META, type CanvasKind } from "./canvas.types";

const ACCENT = "#E84F3D";
const DARK = "#c03d2d";

type Props = {
  kind: CanvasKind;
  binding?: string;
  onDelete?: () => void;
};

/**
 * Overlay de seleção estilo editor visual: moldura vermelha, 4 alças de
 * canto e uma barra inline com tipo, binding e ações (excluir, etc.).
 * Posiciona-se de forma absoluta sobre o componente selecionado
 * (o pai precisa ser `relative`).
 */
export function SelectionFrame({ kind, binding, onDelete }: Props) {
  const meta = CANVAS_KIND_META[kind];

  return (
    <div className="pointer-events-none absolute -inset-[6px] z-10">
      {/* Moldura */}
      <div
        className="absolute inset-0"
        style={{ border: `2px solid ${ACCENT}` }}
      />

      {/* Alças de canto */}
      <Handle className="-left-[3px] -top-[3px]" />
      <Handle className="-right-[3px] -top-[3px]" />
      <Handle className="-bottom-[3px] -left-[3px]" />
      <Handle className="-bottom-[3px] -right-[3px]" />

      {/* Barra de tipo + binding + ações (pointer-events-auto para interação) */}
      <div
        className="pointer-events-auto absolute -top-[22px] left-0 flex"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span
          className="select-none rounded-l-[3px] px-[7px] py-[2px] text-[11px] font-bold leading-none text-white"
          style={{ background: ACCENT }}
        >
          {meta.label}
        </span>

        {binding ? (
          <span
            className="select-none px-[7px] py-[2px] font-mono text-[10px] leading-none"
            style={{ background: DARK, color: "rgba(255,255,255,.7)" }}
          >
            {binding}
          </span>
        ) : null}

        {onDelete ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex cursor-pointer items-center rounded-r-[3px] px-[6px] transition-colors hover:bg-red-700"
            style={{ background: DARK }}
            title="Excluir componente"
          >
            <Trash2 className="size-[10px] text-white/60" />
          </button>
        ) : (
          <span
            className="rounded-r-[3px] px-[3px]"
            style={{ background: DARK }}
          />
        )}
      </div>
    </div>
  );
}

function Handle({ className }: { className: string }) {
  return (
    <div
      className={`absolute size-[7px] rounded-[1px] ${className}`}
      style={{ background: ACCENT }}
    />
  );
}
