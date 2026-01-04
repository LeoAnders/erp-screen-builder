"use client";

import { useEffect, useState } from "react";

/**
 * Mostra loading apenas após um delay, evitando "flash" em loads rápidos.
 * Reset imediato quando `loading` volta a false.
 */
export function useDeferredLoading(loading: boolean, delayMs = 180) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShow(false);
      return;
    }

    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs, loading]);

  return show;
}
