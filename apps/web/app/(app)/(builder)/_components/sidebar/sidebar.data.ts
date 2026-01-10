import {
  Grid3X3,
  MousePointer2,
  RectangleHorizontal,
  Table,
} from "lucide-react";

import type { LayerNode } from "../layer-tree-view";
import type {
  ComponentCategory,
  SidebarComponent,
  SidebarScreen,
} from "./sidebar.types";

// Mock data - Camadas por Tela (similar ao Figma)
export const mockLayerTree: LayerNode[] = [
  {
    id: "cctrib100",
    name: "CCTRIB100",
    type: "screen",
    children: [
      { id: "cctrib100-grid", name: "Grid Principal", type: "grid" },
      { id: "cctrib100-btn-salvar", name: "Botão Salvar", type: "button" },
      { id: "cctrib100-btn-cancelar", name: "Botão Cancelar", type: "button" },
      { id: "cctrib100-lbl-titulo", name: "Label Título", type: "label" },
    ],
  },
  {
    id: "cctrib200",
    name: "CCTRIB200",
    type: "screen",
    children: [
      {
        id: "cctrib200-tab",
        name: "Tab Container",
        type: "tab",
        children: [
          {
            id: "cctrib200-tab-geral",
            name: "Tab Geral",
            type: "panel",
            children: [
              { id: "cctrib200-btn-novo", name: "Botão Novo", type: "button" },
              {
                id: "cctrib200-lbl-codigo",
                name: "Label Código",
                type: "label",
              },
              {
                id: "cctrib200-input-codigo",
                name: "Input Código",
                type: "input",
              },
            ],
          },
          {
            id: "cctrib200-tab-detalhes",
            name: "Tab Detalhes",
            type: "panel",
            children: [
              {
                id: "cctrib200-grid-itens",
                name: "Grid Itens",
                type: "grid",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cctrib300",
    name: "CCTRIB300",
    type: "screen",
    children: [
      {
        id: "cctrib300-panel",
        name: "Panel Filtros",
        type: "panel",
        children: [
          {
            id: "cctrib300-lbl-periodo",
            name: "Label Período",
            type: "label",
          },
          {
            id: "cctrib300-input-data-ini",
            name: "Input Data Início",
            type: "input",
          },
          {
            id: "cctrib300-input-data-fim",
            name: "Input Data Fim",
            type: "input",
          },
        ],
      },
      { id: "cctrib300-table", name: "Table Resultados", type: "table" },
      {
        id: "cctrib300-btn-pesquisar",
        name: "Botão Pesquisar",
        type: "button",
      },
    ],
  },
];

// Mock data for screens (telas) - kept for screen selector
export const mockScreens: SidebarScreen[] = [
  { id: "cctrib100", name: "CCTRIB100" },
  { id: "cctrib200", name: "CCTRIB200" },
  { id: "cctrib300", name: "CCTRIB300" },
  { id: "cctrib400", name: "CCTRIB400" },
];

// Mock data for components palette
export const mockComponents: SidebarComponent[] = [
  { id: "label", name: "Label", category: "Campos" },
  {
    id: "input",
    name: "Input",
    category: "Campos",
  },
  { id: "select", name: "Select", category: "Campos" },
  { id: "button", name: "Button", category: "Ações" },
  { id: "table", name: "Table", category: "Dados" },
  { id: "grid", name: "Grid", category: "Layout" },
];

export const componentCategories: ComponentCategory[] = [
  {
    key: "Campos",
    title: "Campos",
    bgClassName: "bg-amber-500/10 dark:bg-amber-400/10",
    icon: RectangleHorizontal,
  },
  {
    key: "Ações",
    title: "Ações",
    bgClassName: "bg-emerald-500/10 dark:bg-emerald-400/10",
    icon: MousePointer2,
  },
  {
    key: "Dados",
    title: "Dados",
    bgClassName: "bg-sky-500/10 dark:bg-sky-400/10",
    icon: Table,
  },
  {
    key: "Layout",
    title: "Layout",
    bgClassName: "bg-violet-500/10 dark:bg-violet-400/10",
    icon: Grid3X3,
  },
];
