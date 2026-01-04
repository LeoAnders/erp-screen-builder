import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton minimalista para o header durante bootstrap loading.
 */
export function HeaderSkeleton() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Skeleton className="-ml-1 size-6 rounded-md" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Skeleton className="h-4 w-48" />
    </header>
  );
}
