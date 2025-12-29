import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().optional(),
});

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUuid = (value: string) => UUID_REGEX.test(value);

export const createProjectSchema = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().optional(),
  teamId: z
    .string()
    .regex(UUID_REGEX, { message: "teamId must be a valid uuid" }),
});

export const createFileSchema = z.object({
  name: z.string().min(1, "name is required"),
  projectId: z
    .string()
    .regex(UUID_REGEX, { message: "projectId must be a valid uuid" }),
  template: z.enum(["blank"]),
});

const jsonObjectSchema = z
  .unknown()
  .refine(
    (value): value is Record<string, unknown> =>
      !!value && typeof value === "object" && !Array.isArray(value),
    { message: "schema_json must be an object" }
  );

export const updateFileSchema = z.object({
  schema_json: jsonObjectSchema,
  expected_revision: z.number().int().min(1, "expected_revision must be >= 1"),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateFileInput = z.infer<typeof createFileSchema>;
export type UpdateFileInput = z.infer<typeof updateFileSchema>;
