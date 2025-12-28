import { FileText, Image as ImageIcon, LayoutGrid } from "lucide-react";

import type { ProjectFile, ProjectFilePreview } from "./project-types";

export type FileKind =
  | NonNullable<ProjectFile["kind"]>
  | ProjectFilePreview["kind"];

export const kindLabels: Record<Exclude<FileKind, undefined>, string> = {
  image: "Imagem",
  doc: "Documento",
  frame: "Frame",
};

type KindIconProps = {
  kind?: FileKind;
  className?: string;
};

export function KindIcon({ kind, className }: KindIconProps) {
  const Icon =
    kind === "image" ? ImageIcon : kind === "doc" ? FileText : LayoutGrid;
  return <Icon className={className} />;
}
