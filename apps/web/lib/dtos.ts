export type TeamDTO = {
  id: string;
  name: string;
  visibility: "private" | "public";
  type: "personal" | "normal";
  ownerId: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFilePreviewDTO = {
  id: string;
  name: string;
  template: string;
};

export type ProjectListItemDTO = {
  id: string;
  name: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  previews: ProjectFilePreviewDTO[];
};

export type ProjectFileDTO = {
  id: string;
  name: string;
  projectId: string;
  template: string;
  revision: number;
  updatedAt: string;
  editedBy: { name: string } | null;
  kind: string;
};

export type FileDetailDTO = {
  id: string;
  name: string;
  template: string;
  schema_version: string;
  schema_json: unknown;
  revision: number;
  updated_by: string | null;
  updated_at: string;
  origin?: {
    type: "project";
    project_id: string;
    project_name: string;
  };
};
