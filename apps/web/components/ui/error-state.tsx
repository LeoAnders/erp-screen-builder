"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TriangleAlert, Bug, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CopyIconButton } from "@/components/ui/copy-icon-button";
import {
  sanitizeErrorForSummary,
  sanitizeErrorForVerboseDisplay,
  safeStringify,
} from "@/lib/errors/sanitize";
import { shouldShowTechnicalDetails } from "@/lib/errors/debug";

type ErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  error?: unknown;
};

export function ErrorState({
  title,
  message,
  onRetry,
  error,
}: ErrorStateProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const verboseEnabled = shouldShowTechnicalDetails();

  const summaryObj = sanitizeErrorForSummary(error);
  const verboseObj = verboseEnabled
    ? sanitizeErrorForVerboseDisplay(error)
    : null;

  const technicalObj = verboseObj ?? summaryObj;
  const technicalDetails = technicalObj ? safeStringify(technicalObj) : null;

  const handleCopy = useCallback(() => {
    if (!technicalDetails) return;

    const clipboard =
      typeof navigator !== "undefined" ? navigator.clipboard : undefined;
    if (!clipboard?.writeText) return;

    clipboard.writeText(technicalDetails).then(() => {
      setCopied(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
    });
  }, [technicalDetails]);

  return (
    <div className="grid flex-1 justify-items-center px-6 pt-8">
      <div className="flex w-full max-w-md flex-col items-center gap-2 text-center">
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
          <TriangleAlert className="size-6 text-destructive" />
        </div>

        <h2 className="text-[1.25rem] font-semibold tracking-tight text-foreground">
          {title}
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>

        {onRetry ? (
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="mt-2 gap-2"
          >
            Tentar novamente
          </Button>
        ) : null}

        {technicalDetails ? (
          <Collapsible
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            className="mt-3 w-full"
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 text-xs text-muted-foreground cursor-pointer",
                  "hover:underline underline-offset-4 hover:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              >
                <Bug className="size-3" />
                {detailsOpen
                  ? "Ocultar detalhes técnicos"
                  : "Mostrar detalhes técnicos"}
                <ChevronDown
                  className={cn(
                    "size-3 transition-transform duration-200",
                    detailsOpen && "rotate-180",
                  )}
                />
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="mt-3 w-full overflow-hidden rounded-md border border-border bg-muted/50">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-[11px] text-muted-foreground">
                    Detalhes técnicos
                  </span>

                  <CopyIconButton copied={copied} onCopy={handleCopy} />
                </div>

                <pre className="max-h-[220px] overflow-auto p-3 text-left font-mono text-[11px] leading-relaxed text-muted-foreground">
                  <code className="whitespace-pre-wrap wrap-break-word">
                    {technicalDetails}
                  </code>
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </div>
    </div>
  );
}
