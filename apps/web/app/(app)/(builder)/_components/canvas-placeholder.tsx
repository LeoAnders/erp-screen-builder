"use client";

import { ScreenThumbnail } from "./screen-thumbnail";

const mockThumbnails = [
  { id: "cctrib100", title: "CCTRIB100", subtitle: "Cadastro de Tributos" },
  { id: "cctrib200", title: "CCTRIB200", subtitle: "Manutenção de Tributos" },
];

export function CanvasPlaceholder() {
  return (
    <div className="main-scrollbar h-full w-full overflow-auto bg-muted/20">
      <div className="flex min-h-full items-center justify-center p-12">
        <div className="flex gap-6">
          {mockThumbnails.map((t) => (
            <ScreenThumbnail
              key={t.id}
              title={t.title}
              subtitle={t.subtitle}
              className="w-[260px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
