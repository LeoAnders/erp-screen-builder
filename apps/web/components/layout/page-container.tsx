import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = {
  className?: string;
  children: ReactNode;
};

export function PageContainer({ className, children }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl", className)}>{children}</div>
  );
}
