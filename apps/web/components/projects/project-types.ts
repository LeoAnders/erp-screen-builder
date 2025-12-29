export type ProjectFilePreview = {
  id: string;
  thumbUrl?: string;
  kind?: "image" | "doc" | "frame";
  description?: string;
};

export type Project = {
  id: string;
  name: string;
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
  kind?: "image" | "doc" | "frame";
  createdAt?: string;
  updatedAt?: string;
  editedBy?: { name: string; avatarSrc?: string };
};
