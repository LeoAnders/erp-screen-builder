"use client";

import type { CanvasKind } from "./canvas.types";

const ARIAL = "Arial, sans-serif";
const BORDER = "#ADADAD";
const ACCENT = "#E84F3D";

/**
 * Pré-visualização com o formato real do componente ERP, usada como imagem
 * de arrasto (setDragImage) quando o usuário pega um item da paleta — em vez
 * do card padrão da sidebar. Vem com a mesma moldura vermelha de seleção do
 * canvas, para manter a linguagem visual consistente.
 */
export function PaletteDragPreview({ kind }: { kind: CanvasKind }) {
  return (
    <div
      className="relative inline-flex items-center"
      style={{ background: "#EBEBEB", padding: 8, fontFamily: ARIAL }}
    >
      <Shape kind={kind} />

      {/* Moldura de seleção + alças de canto */}
      <div
        className="pointer-events-none absolute inset-[2px]"
        style={{ border: `2px solid ${ACCENT}` }}
      />
      <Handle style={{ top: 0, left: 0 }} />
      <Handle style={{ top: 0, right: 0 }} />
      <Handle style={{ bottom: 0, left: 0 }} />
      <Handle style={{ bottom: 0, right: 0 }} />
    </div>
  );
}

function Handle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="pointer-events-none absolute size-[7px] rounded-[1px]"
      style={{ background: ACCENT, ...style }}
    />
  );
}

function Shape({ kind }: { kind: CanvasKind }) {
  switch (kind) {
    case "label":
      return <span className="text-[12px] font-bold text-[#333]">Rótulo</span>;

    case "select":
      return (
        <div
          className="relative flex h-[22px] items-center bg-white pr-[20px] pl-[3px]"
          style={{ width: 150, border: `1px solid ${BORDER}` }}
        >
          <span className="text-[12px] text-[#333]">Opção</span>
          <span className="absolute top-1/2 right-[3px] -translate-y-1/2">
            <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
              <path
                d="M1 1l3.5 3.5L8 1"
                stroke="#555"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      );

    case "button":
      return (
        <div
          className="flex h-[28px] items-center px-5 text-[12px] font-bold text-white"
          style={{ background: "#3E3E3E", border: "1px solid #2a2a2a" }}
        >
          Botão
        </div>
      );

    case "table":
      return (
        <div
          className="bg-white"
          style={{ width: 220, border: `1px solid ${BORDER}` }}
        >
          <div className="flex h-[18px] items-center bg-[#1B7E8A] px-2">
            {["Código", "Descrição"].map((col) => (
              <span
                key={col}
                className="flex-1 text-[10px] font-bold text-white"
              >
                {col}
              </span>
            ))}
          </div>
          {[0, 1].map((row) => (
            <div
              key={row}
              className="flex h-[16px] items-center px-2"
              style={{ background: row % 2 ? "#F5F5F5" : "#fff" }}
            >
              {[0, 1].map((cell) => (
                <span key={cell} className="flex-1">
                  <span className="block h-[5px] w-[60%] rounded-[1px] bg-[#DADADA]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      );

    case "grid":
      return (
        <div
          className="grid grid-cols-2 gap-1 bg-[#F0F0F0] p-1"
          style={{ width: 160, border: `1px dashed ${BORDER}` }}
        >
          {[0, 1, 2, 3].map((cell) => (
            <div
              key={cell}
              className="h-[20px] bg-white"
              style={{ border: "1px solid #DADADA" }}
            />
          ))}
        </div>
      );

    case "input":
    default:
      return (
        <div
          className="h-[22px] bg-white"
          style={{ width: 160, border: `1px solid ${BORDER}` }}
        />
      );
  }
}
