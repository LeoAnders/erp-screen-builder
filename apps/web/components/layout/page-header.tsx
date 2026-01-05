import { Plus } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
};

/**
 * Cabeçalho de página compartilhado usado nas páginas de listagem (Dashboard/Projetos/Arquivos).
 * Mantém o layout consistente e evita duplicação de marcação de botão/cabeçalho.
 */
export function PageHeader({
  title,
  description,
  actionLabel,
  actionIcon = <Plus className="size-4" />,
  onActionClick,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>

      {actionLabel ? (
        <Button
          size="sm"
          className="gap-2 cursor-pointer"
          onClick={onActionClick}
        >
          {actionIcon}
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
