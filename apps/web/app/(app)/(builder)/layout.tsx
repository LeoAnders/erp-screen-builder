import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function BuilderLayout({ children }: Props) {
  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      {children}
    </div>
  );
}
