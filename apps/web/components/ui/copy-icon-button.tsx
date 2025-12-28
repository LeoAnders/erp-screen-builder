"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CopyIconButtonProps = {
  copied: boolean;
  onCopy: () => void;
};

export function CopyIconButton({ copied, onCopy }: CopyIconButtonProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCopy}
            className="h-8 w-8 text-muted-foreground hover:bg-muted/40 hover:text-muted-foreground"
            aria-label={
              copied ? "Copiado" : "Copiar para a área de transferência"
            }
          >
            {copied ? (
              <Check className="size-3 text-inherit" />
            ) : (
              <Copy className="size-3 text-inherit" />
            )}
          </Button>
        </TooltipTrigger>

        <TooltipContent side="top" align="end">
          {copied ? "Copiado" : "Copiar para a área de transferência"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
