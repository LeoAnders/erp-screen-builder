export type TeamDTO = {
  id: string;
  name: string;
  visibility: "private" | "public";
  type: "personal" | "normal";
  ownerId: string | null;
  isFavorite: boolean;
};

export type ProjectFilePreviewDTO = {
  id: string;
  name: string;
  template: string;
};

export type ProjectListItemDTO = {
  id: string;
  name: string;
  description: string | null;
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
