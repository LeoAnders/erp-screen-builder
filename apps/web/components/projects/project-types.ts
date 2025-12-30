export type ProjectFilePreview = {
  id: string;
  thumbUrl?: string;
  kind?: "image" | "doc" | "frame";
  description?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  teamId: string;
  createdAt?: string;
  updatedAt?: string;
  fileCount: number;
  previews: ProjectFilePreview[];
};

export type ProjectFile = {
  id: string;
  name: string;
  projectId: string;
  template?: string;
  revision?: number;
  kind?: "image" | "doc" | "frame";
  createdAt?: string;
  updatedAt?: string;
  editedBy?: { name: string; avatarSrc?: string };
};
