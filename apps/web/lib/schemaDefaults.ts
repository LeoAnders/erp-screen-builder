export type SchemaTemplate = "blank";

export type ScreenLayout = {
  row: number;
  col: number;
  width: number;
  height: number;
};

export type ScreenProps = {
  routineName: string;
  description: string;
  namespace: string;
};

export type ScreenNode = {
  type: "ScreenRoot";
  layout: ScreenLayout;
  props: ScreenProps;
  children: unknown[];
};

export type SchemaDefaults = {
  schemaVersion: "1.0.0";
  screen: ScreenNode;
};

export function getSchemaDefaults(template: SchemaTemplate): SchemaDefaults {
  if (template === "blank") {
    return {
      schemaVersion: "1.0.0",
      screen: {
        type: "ScreenRoot",
        layout: { row: 1, col: 1, width: 80, height: 24 },
        props: {
          routineName: "",
          description: "",
          namespace: "",
        },
        children: [],
      },
    };
  }

  throw new Error(`Unsupported template: ${template}`);
}

