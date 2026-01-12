import { create } from "zustand";

import { getSchemaDefaults } from "@/lib/schemaDefaults";
import type { SchemaDefaults, SchemaTemplate } from "@/lib/schemaDefaults";
import type { FileDetailDTO } from "@/lib/dtos";

type EditorSource = { type: "file"; fileId: string };

type EditorStoreState = {
  docId: string | null;
  source: EditorSource | null;
  schemaVersion: string | null;
  schema: SchemaDefaults | null;
  revision: number | null;
  dirty: boolean;
  hasInitialized: boolean;
};

type EditorStoreActions = {
  initializeFromFile: (args: { docId: string; payload: FileDetailDTO }) => void;
  reset: () => void;
};

type EditorStore = EditorStoreState & EditorStoreActions;

const INITIAL_STATE: EditorStoreState = {
  docId: null,
  source: null,
  schemaVersion: null,
  schema: null,
  revision: null,
  dirty: false,
  hasInitialized: false,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSchemaDefaults(value: unknown): value is SchemaDefaults {
  if (!isPlainObject(value)) return false;

  if (value.schemaVersion !== "1.0.0") return false;

  const screen = value.screen;
  if (!isPlainObject(screen)) return false;
  if (screen.type !== "ScreenRoot") return false;

  const layout = screen.layout;
  if (!isPlainObject(layout)) return false;
  if (
    typeof layout.row !== "number" ||
    typeof layout.col !== "number" ||
    typeof layout.width !== "number" ||
    typeof layout.height !== "number"
  ) {
    return false;
  }

  const props = screen.props;
  if (!isPlainObject(props)) return false;
  if (
    typeof props.routineName !== "string" ||
    typeof props.description !== "string" ||
    typeof props.namespace !== "string"
  ) {
    return false;
  }

  const children = screen.children;
  if (!Array.isArray(children)) return false;

  return true;
}

function parseTemplate(template: string): SchemaTemplate {
  if (template === "blank") return "blank";
  return "blank";
}

export const useEditorStore = create<EditorStore>()((set) => ({
  ...INITIAL_STATE,

  initializeFromFile: ({ docId, payload }) =>
    set(() => {
      const template = parseTemplate(payload.template);
      const schema = isSchemaDefaults(payload.schema_json)
        ? payload.schema_json
        : getSchemaDefaults(template);

      return {
        docId,
        source: { type: "file", fileId: payload.id },
        schemaVersion: payload.schema_version,
        schema,
        revision: payload.revision,
        dirty: false,
        hasInitialized: true,
      };
    }),

  reset: () => set(INITIAL_STATE),
}));
