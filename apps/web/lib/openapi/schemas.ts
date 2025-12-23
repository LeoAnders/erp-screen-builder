import { z } from "zod";
import {
  createFileSchema,
  createProjectSchema,
  createTeamSchema,
  updateFileSchema,
} from "@/lib/validators";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
});

export const TeamSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  isFavorite: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  teamId: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const FileListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  template: z.enum(["blank"]),
  revision: z.number().int(),
  updatedAt: z.string().datetime({ offset: true }),
  updatedBy: z.string().nullable(),
});

export const FileDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  template: z.enum(["blank"]),
  schema_version: z.string(),
  schema_json: z.unknown(),
  revision: z.number().int(),
  updated_by: z.string().nullable(),
  updated_at: z.string().datetime({ offset: true }),
});

export const FileUpdateResponseSchema = z.object({
  revision: z.number().int(),
  updated_at: z.string().datetime({ offset: true }),
  updated_by: z.string().nullable(),
});

export const FileCreatedSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  template: z.enum(["blank"]),
  schemaVersion: z.string(),
  schemaJson: z.unknown(),
  revision: z.number().int(),
  projectId: z.string().uuid(),
  updatedBy: z.string().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const ListProjectsQuerySchema = z.object({
  teamId: z.string().uuid(),
});

export const ListFilesQuerySchema = z.object({
  projectId: z.string().uuid(),
});

export const FileIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const requestSchemas = {
  createTeamSchema,
  createProjectSchema,
  createFileSchema,
  updateFileSchema,
};
