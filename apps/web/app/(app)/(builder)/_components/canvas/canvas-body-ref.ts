import { createRef } from "react";

/**
 * Ref compartilhada para o div de posicionamento livre do canvas.
 * Usado pelo BuilderDndContext para calcular posição relativa ao canvas
 * durante o arraste de itens da paleta.
 */
export const canvasBodyRef = createRef<HTMLDivElement>();
