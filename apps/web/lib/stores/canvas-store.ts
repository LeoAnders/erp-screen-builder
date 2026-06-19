import { create } from "zustand";

import type {
  CanvasComponent,
  CanvasKind,
} from "@/app/(app)/(builder)/_components/canvas/canvas.types";
import { GRID_SIZE } from "@/app/(app)/(builder)/_components/canvas/canvas.types";

let idCounter = 0;
function nextId(kind: CanvasKind): string {
  idCounter += 1;
  return `${kind}-${idCounter}`;
}

let bindingCounter = 0;
function nextBinding(): string {
  bindingCounter += 1;
  return `campo${bindingCounter}`;
}

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

/** Cria um componente recém-inserido com valores-padrão por tipo. */
function createComponent(
  kind: CanvasKind,
  x: number,
  y: number,
): CanvasComponent {
  const base: CanvasComponent = {
    id: nextId(kind),
    kind,
    label: "",
    binding: nextBinding(),
    x: snapToGrid(x),
    y: snapToGrid(y),
  };

  switch (kind) {
    case "label":
      return { ...base, label: "Novo Rótulo", binding: undefined };
    case "input":
      return {
        ...base,
        label: "Novo Campo",
        value: "",
        inputWidth: 160,
        align: "left",
        lookup: "none",
      };
    case "select":
      return {
        ...base,
        label: "Nova Seleção",
        options: ["Opção 1", "Opção 2"],
        selectedOption: "Opção 1",
      };
    case "button":
      return {
        ...base,
        label: "Botão",
        binding: undefined,
        buttonText: "Novo Botão",
        buttonVariant: "default",
      };
    case "table":
      return { ...base, label: "Nova Tabela" };
    case "grid":
      return { ...base, label: "Novo Grid" };
    default:
      return base;
  }
}

/**
 * Seed do formulário CCTRIB100 — "Cadastro de Tributos".
 * Os componentes são posicionados com coordenadas absolutas (x, y).
 */
function seedComponents(): CanvasComponent[] {
  idCounter = 0;
  bindingCounter = 0;

  const X = 10;
  const Y_START = 10;
  const ROW = 30;

  return [
    {
      id: nextId("input"),
      kind: "input",
      label: "Código da Empresa",
      binding: "empresaCodigo",
      value: "1",
      inputWidth: 54,
      lookup: "dots",
      secondaryValue: "EMPRESA MODELO 1",
      x: X,
      y: Y_START,
    },
    {
      id: nextId("input"),
      kind: "input",
      label: "Código do Cadastro",
      binding: "cadastroCodigo",
      value: "1",
      inputWidth: 120,
      lookup: "search",
      x: X,
      y: Y_START + ROW,
    },
    {
      id: nextId("input"),
      kind: "input",
      label: "Descrição do Cadastro",
      binding: "descricao",
      value: "",
      inputWidth: 500,
      lookup: "none",
      x: X,
      y: Y_START + ROW * 2,
    },
    {
      id: nextId("input"),
      kind: "input",
      label: "Data do Cadastro",
      binding: "dataCadastro",
      value: "",
      inputWidth: 92,
      lookup: "date",
      x: X,
      y: Y_START + ROW * 3,
    },
    {
      id: nextId("select"),
      kind: "select",
      label: "Situação",
      binding: "situacao",
      options: ["Ativo", "Inativo"],
      selectedOption: "Ativo",
      x: X,
      y: Y_START + ROW * 4,
    },
    {
      id: nextId("input"),
      kind: "input",
      label: "Valor Inicial",
      binding: "valorInicial",
      value: "",
      inputWidth: 120,
      align: "right",
      lookup: "none",
      x: X,
      y: Y_START + ROW * 5,
    },
    {
      id: nextId("button"),
      kind: "button",
      label: "Botão Salvar",
      buttonText: "Salvar",
      buttonVariant: "primary",
      x: 10,
      y: Y_START + ROW * 5 + 50,
    },
    {
      id: nextId("button"),
      kind: "button",
      label: "Botão Excluir",
      buttonText: "Excluir",
      buttonVariant: "danger",
      x: 100,
      y: Y_START + ROW * 5 + 50,
    },
    {
      id: nextId("button"),
      kind: "button",
      label: "Botão Cancelar",
      buttonText: "Cancelar",
      buttonVariant: "default",
      x: 190,
      y: Y_START + ROW * 5 + 50,
    },
  ];
}

type CanvasStore = {
  components: CanvasComponent[];
  selectedId: string | null;
  /** Id do rascunho criado a partir da paleta enquanto se arrasta. */
  draftId: string | null;

  select: (id: string | null) => void;
  /** Atualiza a posição de um componente (coordenadas absolutas, grid-snapped). */
  setPosition: (id: string, x: number, y: number) => void;
  /**
   * Insere um rascunho na posição indicada (cursor sobre o canvas).
   * Idempotente: ignora chamadas subsequentes enquanto draftId existir.
   */
  insertDraft: (kind: CanvasKind, x: number, y: number) => void;
  /** Confirma o rascunho como componente definitivo e o seleciona. */
  commitDraft: () => void;
  /** Remove o rascunho do array (arrasto cancelado ou fora do canvas). */
  discardDraft: () => void;

  updateSelected: (patch: Partial<CanvasComponent>) => void;
  remove: (id: string) => void;
  reset: () => void;
};

export const useCanvasStore = create<CanvasStore>()((set) => ({
  components: seedComponents(),
  selectedId: "input-1",
  draftId: null,

  select: (id) => set({ selectedId: id }),

  setPosition: (id, x, y) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, x: snapToGrid(x), y: snapToGrid(y) } : c,
      ),
    })),

  insertDraft: (kind, x, y) =>
    set((state) => {
      if (state.draftId) return state;

      const component = createComponent(kind, x, y);
      return {
        components: [...state.components, component],
        draftId: component.id,
      };
    }),

  commitDraft: () =>
    set((state) => {
      if (!state.draftId) return { draftId: null };
      return { selectedId: state.draftId, draftId: null };
    }),

  discardDraft: () =>
    set((state) => {
      if (!state.draftId) return { draftId: null };
      return {
        components: state.components.filter((c) => c.id !== state.draftId),
        draftId: null,
      };
    }),

  updateSelected: (patch) =>
    set((state) => {
      if (!state.selectedId) return state;
      return {
        components: state.components.map((component) =>
          component.id === state.selectedId
            ? { ...component, ...patch }
            : component,
        ),
      };
    }),

  remove: (id) =>
    set((state) => ({
      components: state.components.filter((component) => component.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  reset: () =>
    set({
      components: seedComponents(),
      selectedId: "input-1",
      draftId: null,
    }),
}));
