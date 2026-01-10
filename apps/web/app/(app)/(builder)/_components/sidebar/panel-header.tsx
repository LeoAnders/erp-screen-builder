import Link from "next/link";

type PanelHeaderProps = {
  docTitle: string;
  originLabel: string;
  originHref: string;
};

export function PanelHeader({
  docTitle,
  originLabel,
  originHref,
}: PanelHeaderProps) {
  return (
    <div className="space-y-1 border-b border-sidebar-border px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-semibold text-sidebar-foreground">
          {docTitle}
        </span>
      </div>
      <Link
        href={originHref}
        className="block w-full cursor-pointer text-xs text-muted-foreground hover:text-sidebar-foreground"
      >
        {originLabel}
      </Link>
    </div>
  );
}
