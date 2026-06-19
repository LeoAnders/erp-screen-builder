/**
 * Mapa global das dimensões (width, height) de cada componente do canvas.
 * Atualizado por ErpField/ErpButton via ResizeObserver após o mount.
 * Usado pelo modificador de snap/guias no BuilderDndContext.
 */
export const componentSizes = new Map<string, { width: number; height: number }>();
