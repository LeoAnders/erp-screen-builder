"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

import { mockScreens } from "./sidebar/sidebar.data";

type Props = {
  selectedScreenId?: string | null;
};

const SCREEN_WIDTH = 1920;
const SCREEN_HEIGHT = 1080;

export function CanvasPlaceholder({ selectedScreenId }: Props) {
  const activeScreen =
    mockScreens.find((screen) => screen.id === selectedScreenId) ??
    mockScreens[0];

  const screenStyle = {
    width: `min(${SCREEN_WIDTH}px, calc(100vw - 760px))`,
    minWidth: "520px",
    aspectRatio: `${SCREEN_WIDTH} / ${SCREEN_HEIGHT}`,
  } satisfies CSSProperties;

  return (
    <div className="main-scrollbar h-full w-full overflow-auto bg-muted/20">
      <div className="flex min-h-full flex-col items-center justify-center px-10 py-12">
        <div className="mb-4 w-full max-w-230">
          <div className="flex items-center gap-4">
            <div className="truncate text-[12px] font-semibold text-foreground">
              {activeScreen?.name ?? "Tela"}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "relative overflow-hidden border border-[#2a2a2a] bg-[#f4f4f4]",
            "shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
          )}
          style={screenStyle}
        >
          <div className="absolute inset-0 bg-white" />
        </div>
      </div>
    </div>
  );
}
