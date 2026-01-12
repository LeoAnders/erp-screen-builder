import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/lib/utils";
import type { FileDetailDTO } from "@/lib/dtos";

export async function fetchFileDetail(fileId: string): Promise<FileDetailDTO> {
  const res = await fetch(`/api/files/${fileId}`, { method: "GET" });

  if (!res.ok) {
    let body: ApiError | undefined;
    try {
      body = await res.json();
    } catch {
      /* noop */
    }
    throw body ?? new Error("Não foi possível carregar o documento");
  }

  return (await res.json()) as FileDetailDTO;
}

export function fileDetailQueryOptions(fileId: string) {
  return {
    queryKey: ["file-detail", fileId] as const,
    queryFn: () => fetchFileDetail(fileId),
  };
}

export function useFileDetail(fileId: string | null) {
  return useQuery<FileDetailDTO, ApiError | Error>({
    queryKey: ["file-detail", fileId],
    queryFn: () => fetchFileDetail(fileId!),
    enabled: Boolean(fileId),
  });
}
