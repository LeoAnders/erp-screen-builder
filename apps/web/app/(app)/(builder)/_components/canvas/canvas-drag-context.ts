import { createContext, useContext } from "react";

export type Guide = {
  orientation: "h" | "v";
  /** y para "h" (linha horizontal), x para "v" (linha vertical) */
  position: number;
  /** extremidade mínima da linha (x para "h", y para "v") */
  from: number;
  /** extremidade máxima da linha */
  to: number;
};

type CanvasDragContextValue = {
  guides: Guide[];
};

export const CanvasDragContext = createContext<CanvasDragContextValue>({
  guides: [],
});

export const useCanvasDragContext = () => useContext(CanvasDragContext);
