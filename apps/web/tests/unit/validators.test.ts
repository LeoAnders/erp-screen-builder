import { describe, expect, it } from "vitest";

import {
  createFileSchema,
  createProjectSchema,
  createTeamSchema,
  updateFileSchema,
} from "../../lib/validators";

describe("createTeamSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = createTeamSchema.parse({
      name: "Team A",
    });
    expect(parsed).toEqual({ name: "Team A" });
  });

  it("rejects missing name", () => {
    expect(() => createTeamSchema.parse({})).toThrow();
  });

  it("rejects name with only spaces", () => {
    expect(() => createTeamSchema.parse({ name: "   " })).toThrow();
  });

  it("rejects name longer than 50 characters", () => {
    expect(() => createTeamSchema.parse({ name: "a".repeat(51) })).toThrow();
  });
});

describe("createProjectSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = createProjectSchema.parse({
      name: "Project A",
      teamId: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(parsed).toMatchObject({
      name: "Project A",
      teamId: "123e4567-e89b-12d3-a456-426614174000",
    });
  });

  it("normalizes project name spacing", () => {
    const parsed = createProjectSchema.parse({
      name: "  Novo   Projeto  ",
      teamId: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(parsed.name).toBe("Novo Projeto");
  });

  it("rejects name with only spaces", () => {
    expect(() =>
      createProjectSchema.parse({
        name: "   ",
        teamId: "123e4567-e89b-12d3-a456-426614174000",
      }),
    ).toThrow();
  });

  it("rejects name longer than 100 characters", () => {
    expect(() =>
      createProjectSchema.parse({
        name: "a".repeat(101),
        teamId: "123e4567-e89b-12d3-a456-426614174000",
      }),
    ).toThrow();
  });

  it("rejects invalid uuid", () => {
    expect(() =>
      createProjectSchema.parse({ name: "Project", teamId: "not-uuid" }),
    ).toThrow();
  });
});

describe("createFileSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = createFileSchema.parse({
      name: "File",
      projectId: "123e4567-e89b-12d3-a456-426614174000",
      template: "blank",
    });

    expect(parsed.template).toBe("blank");
  });

  it("normalizes file name spacing", () => {
    const parsed = createFileSchema.parse({
      name: "  Meu   Arquivo  ",
      projectId: "123e4567-e89b-12d3-a456-426614174000",
      template: "blank",
    });

    expect(parsed.name).toBe("Meu Arquivo");
  });

  it("accepts an empty name and normalizes to undefined", () => {
    const parsed = createFileSchema.parse({
      name: "   ",
      projectId: "123e4567-e89b-12d3-a456-426614174000",
      template: "blank",
    });

    expect(parsed.name).toBeUndefined();
  });

  it("rejects name longer than 100 characters", () => {
    expect(() =>
      createFileSchema.parse({
        name: "a".repeat(101),
        projectId: "123e4567-e89b-12d3-a456-426614174000",
        template: "blank",
      }),
    ).toThrow();
  });

  it("rejects unsupported template", () => {
    expect(() =>
      createFileSchema.parse({
        name: "File",
        projectId: "123e4567-e89b-12d3-a456-426614174000",
        template: "form",
      }),
    ).toThrow();
  });
});

describe("updateFileSchema", () => {
  it("accepts valid update payload", () => {
    const parsed = updateFileSchema.parse({
      schema_json: { screen: { type: "ScreenRoot" } },
      expected_revision: 2,
    });

    expect(parsed.expected_revision).toBe(2);
  });

  it("rejects non-object schema_json", () => {
    expect(() =>
      updateFileSchema.parse({
        schema_json: "not-an-object",
        expected_revision: 1,
      }),
    ).toThrow();
  });

  it("rejects non-integer expected_revision", () => {
    expect(() =>
      updateFileSchema.parse({
        schema_json: {},
        expected_revision: 1.5,
      }),
    ).toThrow();
  });
});
