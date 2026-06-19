"use client";

import { type CSSProperties, type MouseEvent, useCallback, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { useCanvasStore } from "@/lib/stores/canvas-store";

import type { CanvasComponent } from "./canvas.types";
import { componentSizes } from "./component-sizes-ref";
import { SelectionFrame } from "./selection-frame";

const ARIAL = "Arial, sans-serif";
const BORDER = "#ADADAD";

type Props = {
  component: CanvasComponent;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function ErpField({ component, selected, onSelect }: Props) {
  const remove = useCanvasStore((s) => s.remove);

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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className="relative flex items-center"
    >
      {selected && !isDragging ? (
        <SelectionFrame
          kind={component.kind}
          binding={component.binding}
          onDelete={() => remove(component.id)}
        />
      ) : null}

      {component.kind !== "label" ? (
        <div
          className="shrink-0 pr-1 text-right text-[12px] leading-[22px] text-[#555]"
          style={{ width: 177, fontFamily: ARIAL }}
        >
          {component.label}
        </div>
      ) : null}

      <FieldControl component={component} selected={selected} />
    </div>
  );
}

function FieldControl({
  component,
  selected,
}: {
  component: CanvasComponent;
  selected: boolean;
}) {
  switch (component.kind) {
    case "label":
      return (
        <div
          className="text-[13px] font-bold leading-[22px] text-[#333]"
          style={{ fontFamily: ARIAL }}
        >
          {component.label}
        </div>
      );

    case "select":
      return (
        <div
          className="relative box-border flex h-[22px] cursor-pointer items-center bg-white pl-[3px] pr-[20px]"
          style={{ width: 150, border: `1px solid ${BORDER}` }}
        >
          <span
            className="flex-1 text-[12px] text-[#333]"
            style={{ fontFamily: ARIAL }}
          >
            {component.selectedOption ?? component.options?.[0] ?? ""}
          </span>
          <Chevron className="absolute right-[3px] top-1/2 -translate-y-1/2" />
        </div>
      );

    case "table":
      return <TablePreview />;

    case "grid":
      return <GridPreview />;

    case "input":
    default:
      return <InputControl component={component} highlight={selected} />;
  }
}

function InputControl({
  component,
  highlight,
}: {
  component: CanvasComponent;
  highlight: boolean;
}) {
  const width = component.inputWidth ?? 160;
  const lookup = component.lookup ?? "none";

  return (
    <div className="flex items-center">
      <input
        readOnly
        value={component.value ?? ""}
        placeholder={component.placeholder}
        className="box-border h-[22px] bg-white px-[3px] text-[12px] outline-none"
        style={{
          width,
          fontFamily: ARIAL,
          textAlign: component.align ?? "left",
          border: highlight ? "2px solid #E84F3D" : `1px solid ${BORDER}`,
          boxShadow: highlight ? "0 0 0 2px rgba(232,79,61,.1)" : "none",
        }}
      />

      {lookup === "dots" ? (
        <LookupButton width={16}>
          <svg width="4" height="13" viewBox="0 0 4 13" fill="none">
            <circle cx="2" cy="2" r="1.5" fill="#666" />
            <circle cx="2" cy="6.5" r="1.5" fill="#666" />
            <circle cx="2" cy="11" r="1.5" fill="#666" />
          </svg>
        </LookupButton>
      ) : null}

      {lookup === "search" ? (
        <LookupButton width={20}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="4.5" cy="4.5" r="3.5" stroke="#666" strokeWidth="1.2" />
            <path
              d="M7.5 7.5l2 2"
              stroke="#666"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </LookupButton>
      ) : null}

      {lookup === "date" ? (
        <LookupButton width={20}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <rect
              x=".5"
              y="1.5"
              width="10"
              height="9"
              rx="1"
              stroke="#666"
              strokeWidth="1"
            />
            <path d="M.5 4h10" stroke="#666" strokeWidth="1" />
            <path
              d="M3.5 .5v2M7.5 .5v2"
              stroke="#666"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </LookupButton>
      ) : null}

      {component.secondaryValue ? (
        <input
          readOnly
          value={component.secondaryValue}
          className="box-border h-[22px] px-1 text-[12px] text-[#666] outline-none"
          style={{
            width: 200,
            fontFamily: ARIAL,
            background: "#D8D8D8",
            borderTop: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
          }}
        />
      ) : null}
    </div>
  );
}

function LookupButton({
  width,
  children,
}: {
  width: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-[22px] shrink-0 cursor-pointer items-center justify-center bg-[#E0E0E0]"
      style={{
        width,
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
        borderRight: `1px solid ${BORDER}`,
      }}
    >
      {children}
    </div>
  );
}

function TablePreview() {
  return (
    <div
      className="box-border bg-white"
      style={{ width: 500, border: `1px solid ${BORDER}` }}
    >
      <div className="flex h-[22px] items-center border-b border-[#ADADAD] bg-[#1B7E8A] px-2">
        {["Código", "Descrição", "Valor"].map((col) => (
          <span
            key={col}
            className="flex-1 text-[11px] font-bold text-white"
            style={{ fontFamily: ARIAL }}
          >
            {col}
          </span>
        ))}
      </div>
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="flex h-[20px] items-center border-b border-[#E0E0E0] px-2"
          style={{ background: row % 2 ? "#F5F5F5" : "#fff" }}
        >
          {[0, 1, 2].map((cell) => (
            <span key={cell} className="flex-1">
              <span className="block h-[6px] w-[60%] rounded-[1px] bg-[#DADADA]" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function GridPreview() {
  return (
    <div
      className="box-border grid grid-cols-2 gap-1 bg-[#F0F0F0] p-1"
      style={{ width: 320, border: `1px dashed ${BORDER}` }}
    >
      {[0, 1, 2, 3].map((cell) => (
        <div
          key={cell}
          className="flex h-[28px] items-center justify-center bg-white text-[10px] text-[#AAA]"
          style={{ border: `1px solid #DADADA`, fontFamily: ARIAL }}
        >
          célula
        </div>
      ))}
    </div>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <span className={className}>
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
  );
}
