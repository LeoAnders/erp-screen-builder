"use client";

import { useCallback, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  type Modifier,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { snapToGrid, useCanvasStore } from "@/lib/stores/canvas-store";

import { canvasBodyRef } from "./canvas-body-ref";
import { CanvasDragContext, type Guide } from "./canvas-drag-context";
import type { CanvasKind } from "./canvas.types";
import { componentSizes } from "./component-sizes-ref";
import { PaletteDragPreview } from "./palette-drag-preview";

type ActiveDrag = {
  id: string;
  source: "palette" | "canvas";
  kind: CanvasKind;
} | null;

const SNAP_THRESHOLD = 6;

/**
 * Calcula guias de alinhamento e o ajuste de snap para um componente sendo
 * arrastado. Usa posições do store e tamanhos medidos via ResizeObserver.
 *
 * @returns snapDx/snapDy – pixels de ajuste para alinhar ao guia mais próximo.
 *          guides – linhas visuais a renderizar no canvas.
 */
function computeAlignment(
  activeId: string,
  dx: number,
  dy: number,
): { snapDx: number; snapDy: number; guides: Guide[] } {
  const state = useCanvasStore.getState();
  const activeComp = state.components.find((c) => c.id === activeId);
  if (!activeComp) return { snapDx: 0, snapDy: 0, guides: [] };

  const aSize = componentSizes.get(activeId) ?? { width: 160, height: 22 };
  const aLeft = activeComp.x + dx;
  const aTop = activeComp.y + dy;
  const aRight = aLeft + aSize.width;
  const aBottom = aTop + aSize.height;
  const aCX = aLeft + aSize.width / 2;
  const aCY = aTop + aSize.height / 2;

  type Candidate = { diff: number; position: number; from: number; to: number };
  const xCandidates: Candidate[] = [];
  const yCandidates: Candidate[] = [];

  for (const comp of state.components) {
    if (comp.id === activeId) continue;
    const sSize = componentSizes.get(comp.id) ?? { width: 160, height: 22 };
    const sLeft = comp.x;
    const sTop = comp.y;
    const sRight = comp.x + sSize.width;
    const sBottom = comp.y + sSize.height;
    const sCX = sLeft + sSize.width / 2;
    const sCY = sTop + sSize.height / 2;

    // Pares de borda/centro para alinhamento no eixo X (guias verticais)
    const xPairs: [number, number][] = [
      [aLeft, sLeft],
      [aLeft, sRight],
      [aRight, sLeft],
      [aRight, sRight],
      [aCX, sCX],
    ];
    for (const [a, s] of xPairs) {
      const diff = s - a;
      if (Math.abs(diff) < SNAP_THRESHOLD) {
        xCandidates.push({
          diff,
          position: s,
          from: Math.min(aTop, sTop),
          to: Math.max(aBottom, sBottom),
        });
      }
    }

    // Pares de borda/centro para alinhamento no eixo Y (guias horizontais)
    const yPairs: [number, number][] = [
      [aTop, sTop],
      [aTop, sBottom],
      [aBottom, sTop],
      [aBottom, sBottom],
      [aCY, sCY],
    ];
    for (const [a, s] of yPairs) {
      const diff = s - a;
      if (Math.abs(diff) < SNAP_THRESHOLD) {
        yCandidates.push({
          diff,
          position: s,
          from: Math.min(aLeft, sLeft),
          to: Math.max(aRight, sRight),
        });
      }
    }
  }

  // Melhor snap por eixo (menor diferença absoluta)
  let snapDx = 0;
  let snapDy = 0;
  const guides: Guide[] = [];

  if (xCandidates.length > 0) {
    const minDiff = Math.min(...xCandidates.map((c) => Math.abs(c.diff)));
    snapDx = xCandidates.find((c) => Math.abs(c.diff) === minDiff)!.diff;
    for (const c of xCandidates) {
      if (c.diff === snapDx) {
        guides.push({ orientation: "v", position: c.position, from: c.from, to: c.to });
      }
    }
  }

  if (yCandidates.length > 0) {
    const minDiff = Math.min(...yCandidates.map((c) => Math.abs(c.diff)));
    snapDy = yCandidates.find((c) => Math.abs(c.diff) === minDiff)!.diff;
    for (const c of yCandidates) {
      if (c.diff === snapDy) {
        guides.push({ orientation: "h", position: c.position, from: c.from, to: c.to });
      }
    }
  }

  return { snapDx, snapDy, guides };
}

/**
 * Contexto de DnD do Builder. Cobre sidebar + canvas para arrastar da paleta
 * para o canvas e mover componentes livremente com snap de alinhamento.
 */
export function BuilderDndContext({ children }: { children: React.ReactNode }) {
  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const snapAdjRef = useRef({ x: 0, y: 0 });

  const select = useCanvasStore((s) => s.select);
  const setPosition = useCanvasStore((s) => s.setPosition);
  const insertDraft = useCanvasStore((s) => s.insertDraft);
  const commitDraft = useCanvasStore((s) => s.commitDraft);
  const discardDraft = useCanvasStore((s) => s.discardDraft);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function cursorToCanvas() {
    const body = canvasBodyRef.current;
    if (!body) return null;
    const rect = body.getBoundingClientRect();
    return {
      x: snapToGrid(Math.max(0, cursorRef.current.x - rect.left)),
      y: snapToGrid(Math.max(0, cursorRef.current.y - rect.top)),
    };
  }

  function isCursorInCanvas() {
    const body = canvasBodyRef.current;
    if (!body) return false;
    const rect = body.getBoundingClientRect();
    const { x, y } = cursorRef.current;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  /** Modificador dnd-kit: aplica snap de alinhamento ao transform em tempo real. */
  const alignmentModifier: Modifier = useCallback(({ transform, active }) => {
    if (!active || active.data.current?.source !== "canvas") return transform;

    const { snapDx, snapDy } = computeAlignment(
      String(active.id),
      transform.x,
      transform.y,
    );
    snapAdjRef.current = { x: snapDx, y: snapDy };

    return { ...transform, x: transform.x + snapDx, y: transform.y + snapDy };
  }, []);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const source = active.data.current?.source as "palette" | "canvas";
    const kind = active.data.current?.kind as CanvasKind;
    setActiveDrag({ id: String(active.id), source, kind });
    if (source === "palette") select(null);
  };

  const handleDragMove = ({ active, delta }: DragMoveEvent) => {
    if (active.data.current?.source === "canvas") {
      const { guides: newGuides } = computeAlignment(
        String(active.id),
        delta.x,
        delta.y,
      );
      setGuides(newGuides);
      return;
    }

    // Arrastar da paleta: rastreia rascunho no canvas
    if (!isCursorInCanvas()) return;
    const pos = cursorToCanvas();
    if (!pos) return;
    const kind = active.data.current?.kind as CanvasKind;
    const state = useCanvasStore.getState();
    if (!state.draftId) {
      insertDraft(kind, pos.x, pos.y);
    } else {
      setPosition(state.draftId, pos.x, pos.y);
    }
  };

  const handleDragEnd = ({ active, delta }: DragEndEvent) => {
    const source = active.data.current?.source as string;

    if (source === "canvas") {
      const state = useCanvasStore.getState();
      const comp = state.components.find((c) => c.id === String(active.id));
      if (comp) {
        const adj = snapAdjRef.current;
        setPosition(
          String(active.id),
          snapToGrid(comp.x + delta.x + adj.x),
          snapToGrid(comp.y + delta.y + adj.y),
        );
      }
    } else if (source === "palette") {
      const { draftId } = useCanvasStore.getState();
      if (isCursorInCanvas() && draftId) {
        commitDraft();
      } else {
        discardDraft();
      }
    }

    setGuides([]);
    snapAdjRef.current = { x: 0, y: 0 };
    setActiveDrag(null);
  };

  const handleDragCancel = () => {
    const { draftId } = useCanvasStore.getState();
    if (draftId) discardDraft();
    setGuides([]);
    snapAdjRef.current = { x: 0, y: 0 };
    setActiveDrag(null);
  };

  return (
    <CanvasDragContext.Provider value={{ guides }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[alignmentModifier]}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          className="contents"
          onPointerMove={(e) => {
            cursorRef.current = { x: e.clientX, y: e.clientY };
          }}
        >
          {children}
        </div>

        {/* Preview só para itens vindos da paleta — componentes do canvas se movem diretamente. */}
        <DragOverlay dropAnimation={null}>
          {activeDrag?.source === "palette" ? (
            <div style={{ opacity: 0.85, cursor: "grabbing" }}>
              <PaletteDragPreview kind={activeDrag.kind} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </CanvasDragContext.Provider>
  );
}
