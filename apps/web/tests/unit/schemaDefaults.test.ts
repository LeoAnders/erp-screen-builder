import { describe, expect, it } from "vitest";

import { getSchemaDefaults } from "../../lib/schemaDefaults";

describe("getSchemaDefaults", () => {
  it("returns blank template structure", () => {
    const result = getSchemaDefaults("blank");

    expect(result).toEqual({
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
    });
  });
});

