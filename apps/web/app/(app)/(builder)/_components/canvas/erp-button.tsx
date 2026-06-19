"use client";

import { type CSSProperties, type MouseEvent, useCallback, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { useCanvasStore } from "@/lib/stores/canvas-store";

import type { CanvasComponent } from "./canvas.types";
import { componentSizes } from "./component-sizes-ref";
import { SelectionFrame } from "./selection-frame";

const ARIAL = "Arial, sans-serif";

type Props = {
  component: CanvasComponent;
  selected: boolean;
  onSelect: (id: string) => void;
};

const VARIANT_STYLE: Record<
  NonNullable<CanvasComponent["buttonVariant"]>,
  { bg: string; color: string; border: string }
> = {
  primary: { bg: "#3E3E3E", color: "#fff", border: "#2a2a2a" },
  default: { bg: "#3E3E3E", color: "#fff", border: "#2a2a2a" },
  danger: { bg: "#8C8C8C", color: "#cccccc", border: "#787878" },
};

export function ErpButton({ component, selected, onSelect }: Props) {
  const remove = useCanvasStore((s) => s.remove);
  const variant = component.buttonVariant ?? "default";
  const variantStyle = VARIANT_STYLE[variant];

  const {
    attributes,
    listeners,
    setNodeRef: dndSetNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: component.id,
    data: { source: "canvas", kind: component.kind },
  });

  // Referência local para medir o elemento via ResizeObserver
  const measureRef = useRef<HTMLDivElement | null>(null);

  const setNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      measureRef.current = node;
      dndSetNodeRef(node);
    },
    [dndSetNodeRef],
  );

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0) componentSizes.set(component.id, { width, height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => {
      ro.disconnect();
      componentSizes.delete(component.id);
    };
  }, [component.id]);

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    onSelect(component.id);
  };

  const style: CSSProperties = {
    position: "absolute",
    left: component.x,
    top: component.y,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : selected ? 10 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    background: variantStyle.bg,
    color: variantStyle.color,
    border: `1px solid ${variantStyle.border}`,
    fontFamily: ARIAL,
    whiteSpace: "nowrap",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className="relative flex h-[28px] select-none items-center gap-[5px] px-5 text-[12px] font-bold"
    >
      {selected && !isDragging ? (
        <SelectionFrame
          kind="button"
          binding={component.binding}
          onDelete={() => remove(component.id)}
        />
      ) : null}

      <ButtonIcon variant={variant} color={variantStyle.color} />
      <span>{component.buttonText ?? "Botão"}</span>
    </div>
  );
}

function ButtonIcon({
  variant,
  color,
}: {
  variant: NonNullable<CanvasComponent["buttonVariant"]>;
  color: string;
}) {
  if (variant === "danger") {
    return (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path
          d="M1.5 1.5l8 8M9.5 1.5l-8 8"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "primary") {
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect
          x=".5"
          y=".5"
          width="12"
          height="12"
          rx="1"
          stroke={color}
          strokeWidth="1.1"
        />
        <rect
          x="3"
          y=".5"
          width="6"
          height="3.5"
          rx=".5"
          fill={color}
          opacity=".75"
        />
        <rect
          x="2.5"
          y="7"
          width="8"
          height="5"
          rx=".5"
          fill={color}
          opacity=".7"
        />
      </svg>
    );
  }

  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M3.5 8.8A4.2 4.2 0 107.8 4"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M3.5 8.8V6.3M3.5 8.8H6"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
