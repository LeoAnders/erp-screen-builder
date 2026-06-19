"use client";

import type { CSSProperties } from "react";

import { useCanvasStore } from "@/lib/stores/canvas-store";

import { CanvasScreen } from "./canvas-screen";

type Props = {
  routineName: string;
};

// Resolução simulada da tela ERP (proporção 16:9, ajustada à área disponível).
const SCREEN_WIDTH = 1920;
const SCREEN_HEIGHT = 1080;

export function BuilderCanvas({ routineName }: Props) {
  const select = useCanvasStore((s) => s.select);

  const artboardStyle = {
    width: `min(${SCREEN_WIDTH}px, calc(100vw - 760px))`,
    minWidth: "520px",
    aspectRatio: `${SCREEN_WIDTH} / ${SCREEN_HEIGHT}`,
    background: "#EBEBEB",
    boxShadow: "0 24px 80px rgba(0,0,0,.55)",
  } satisfies CSSProperties;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="main-scrollbar h-full w-full overflow-auto"
        style={{ background: "#141414" }}
        onClick={() => select(null)}
      >
        {/* Grade pontilhada de fundo */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #272727 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Artboard (tamanho único, ajustado à área) */}
        <div className="relative z-[1] flex min-h-full flex-col items-center justify-center px-10 py-12">
          <div className="overflow-hidden" style={artboardStyle}>
            <CanvasScreen routineName={routineName} />
          </div>
        </div>
      </div>
    </div>
  );
}
