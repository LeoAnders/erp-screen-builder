import { z } from "zod";

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUuid = (value: string) => UUID_REGEX.test(value);

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  description: z.string().optional(),
});

export const createProjectSchema = z
  .object({
    name: z
      .string()
      .transform((v) => v.trim().replace(/\s+/g, " "))
      .refine((v) => v.length > 0, {
        message: "Nome é obrigatório",
      }),
    teamId: z.string().regex(UUID_REGEX, { message: "Time inválido" }),
  })
  .refine((data) => data.name.length <= 100, {
    message: "Nome deve ter no máximo 100 caracteres",
    path: ["name"],
  });

export const createFileSchema = z.object({
  name: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const sanitized = value.trim().replace(/\s+/g, " ");
    return sanitized.length ? sanitized : undefined;
  }, z.string().max(100, "Nome deve ter no máximo 100 caracteres").optional()),
  projectId: z.string().regex(UUID_REGEX, { message: "Projeto inválido" }),
  template: z.enum(["blank"], { message: "Template inválido" }),
});

const jsonObjectSchema = z
  .unknown()
  .refine(
    (value): value is Record<string, unknown> =>
      !!value && typeof value === "object" && !Array.isArray(value),
    { message: "schema_json deve ser um objeto" }
  );

export const updateFileSchema = z.object({
  schema_json: jsonObjectSchema,
  expected_revision: z
    .number()
    .int("expected_revision deve ser um inteiro")
    .min(1, "expected_revision deve ser maior ou igual a 1"),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateFileInput = z.infer<typeof createFileSchema>;
export type UpdateFileInput = z.infer<typeof updateFileSchema>;
