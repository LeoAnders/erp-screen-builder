import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotFoundScreenProps = {
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function NotFoundScreen({
  description = "O recurso que você tentou acessar não existe ou não está disponível.",
  ctaLabel = "Ir para o Início",
  ctaHref = "/dashboard",
  className,
}: NotFoundScreenProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center bg-background px-6",
        className
      )}
    >
      <div className="max-w-lg text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="text-5xl font-medium tracking-tight">404</span>
          <span className="h-8 w-px bg-border" />
          <span className="text-sm font-medium">Não encontrado</span>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-10 flex justify-center">
          <Button asChild>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
