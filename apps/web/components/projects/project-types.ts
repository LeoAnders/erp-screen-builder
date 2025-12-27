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

