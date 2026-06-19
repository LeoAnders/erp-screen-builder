export type CanvasKind =
  | "label"
  | "input"
  | "select"
  | "button"
  | "table"
  | "grid";

export type InputLookup = "none" | "dots" | "search" | "date";

/**
 * Representa um componente posicionado no canvas (formulário ERP).
 * O modelo é "achatado" e usa coordenadas absolutas (x, y) em pixels,
 * com snap em grade de 10px para manter alinhamento.
 */
export type CanvasComponent = {
  id: string;
  kind: CanvasKind;
  /** Rótulo à esquerda do campo (linha do formulário ERP). */
  label: string;
  /** Nome do binding exibido na tag de seleção. */
  binding?: string;
  /** Posição horizontal no canvas (px, múltiplo de GRID_SIZE). */
  x: number;
  /** Posição vertical no canvas (px, múltiplo de GRID_SIZE). */
  y: number;

  // Específico de input
  value?: string;
  placeholder?: string;
  inputWidth?: number;
  align?: "left" | "right";
  lookup?: InputLookup;
  /** Campo somente-leitura que acompanha o input (ex.: "EMPRESA MODELO 1"). */
  secondaryValue?: string;

  // Específico de select
  options?: string[];
  selectedOption?: string;

  // Específico de button
  buttonText?: string;
  buttonVariant?: "primary" | "danger" | "default";
};

export type CanvasKindMeta = {
  label: string;
  hint: string;
};

export const CANVAS_KIND_META: Record<CanvasKind, CanvasKindMeta> = {
  label: { label: "Label", hint: "Texto" },
  input: { label: "Input", hint: "Campo de texto" },
  select: { label: "Select", hint: "Lista de opções" },
  button: { label: "Button", hint: "Ação" },
  table: { label: "Table", hint: "Grade de dados" },
  grid: { label: "Grid", hint: "Layout" },
};

/** Tamanho da grade de alinhamento (px). */
export const GRID_SIZE = 10;
