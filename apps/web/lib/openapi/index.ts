import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  ApiErrorSchema,
  FileDetailSchema,
  FileCreatedSchema,
  FileIdParamSchema,
  FileListItemSchema,
  FileUpdateResponseSchema,
  ListFilesQuerySchema,
  ListProjectsQuerySchema,
  ProjectSchema,
  TeamSchema,
  requestSchemas,
} from "@/lib/openapi/schemas";

const registry = new OpenAPIRegistry();

const ApiError = registry.register("ApiError", ApiErrorSchema);
const Team = registry.register("Team", TeamSchema);
const Project = registry.register("Project", ProjectSchema);
const FileListItem = registry.register("FileListItem", FileListItemSchema);
const FileDetail = registry.register("FileDetail", FileDetailSchema);
const FileCreated = registry.register("FileCreated", FileCreatedSchema);
const FileUpdateResponse = registry.register(
  "FileUpdateResponse",
  FileUpdateResponseSchema,
);

const ProjectMeta = registry.register(
  "ProjectMeta",
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    teamId: z.string().uuid(),
  }),
);

const ListTeamsResponse = registry.register(
  "ListTeamsResponse",
  z.object({ items: z.array(Team) }),
);

const ListProjectsResponse = registry.register(
  "ListProjectsResponse",
  z.object({ items: z.array(Project) }),
);

const ListFilesResponse = registry.register(
  "ListFilesResponse",
  z.object({
    project: ProjectMeta,
    items: z.array(FileListItem),
  }),
);

const FileCreateResponse = registry.register(
  "FileCreateResponse",
  z.object({ file: FileCreated }),
);

registry.registerPath({
  method: "get",
  path: "/api/teams",
  tags: ["Teams"],
  responses: {
    200: {
      description: "List teams (personal + public)",
      content: {
        "application/json": {
          schema: ListTeamsResponse,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/teams",
  tags: ["Teams"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: requestSchemas.createTeamSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Public team created",
      content: {
        "application/json": {
          schema: z.object({ team: Team }),
        },
      },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ApiError } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ApiError } },
    },
    409: {
      description: "Conflict",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/projects",
  tags: ["Projects"],
  request: {
    query: ListProjectsQuerySchema,
  },
  responses: {
    200: {
      description: "List projects by team",
      content: {
        "application/json": {
          schema: ListProjectsResponse,
        },
      },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ApiError } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ApiError } },
    },
    403: {
      description: "Forbidden - Access denied to personal team",
      content: { "application/json": { schema: ApiError } },
    },
    404: {
      description: "Team not found",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/projects",
  tags: ["Projects"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: requestSchemas.createProjectSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Project created",
      content: {
        "application/json": {
          schema: z.object({ project: Project }),
        },
      },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ApiError } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ApiError } },
    },
    404: {
      description: "Team not found",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/files",
  tags: ["Files"],
  request: {
    query: ListFilesQuerySchema,
  },
  responses: {
    200: {
      description: "List files by project",
      content: {
        "application/json": {
          schema: ListFilesResponse,
        },
      },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ApiError } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ApiError } },
    },
    403: {
      description: "Forbidden",
      content: { "application/json": { schema: ApiError } },
    },
    404: {
      description: "Project not found",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/files",
  tags: ["Files"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: requestSchemas.createFileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "File created",
      content: {
        "application/json": {
          schema: FileCreateResponse,
        },
      },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ApiError } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ApiError } },
    },
    404: {
      description: "Project not found",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/files/{id}",
  tags: ["Files"],
  request: {
    params: FileIdParamSchema,
  },
  responses: {
    200: {
      description: "Get file by id",
      content: {
        "application/json": {
          schema: FileDetail,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ApiError } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/files/{id}",
  tags: ["Files"],
  request: {
    params: FileIdParamSchema,
    body: {
      content: {
        "application/json": {
          schema: requestSchemas.updateFileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Update file by id",
      content: {
        "application/json": {
          schema: FileUpdateResponse,
        },
      },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ApiError } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ApiError } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ApiError } },
    },
    409: {
      description: "Revision conflict",
      content: { "application/json": { schema: ApiError } },
    },
  },
});

export function getOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "ERP Screen Builder API",
      version: "1.0.0",
    },
    tags: [{ name: "Teams" }, { name: "Projects" }, { name: "Files" }],
  });
}
