export type FileKind = "image" | "doc" | "frame";

export function templateToKind(template: string | null | undefined): FileKind {
  if (!template) return "doc";
  if (template === "blank") return "frame";
  return "doc";
}
