"use client";

import { useEffect } from "react";

/**
 * Scroll al inicio al cargar o refrescar la página.
 * Mantiene la pantalla actual pero la muestra desde arriba.
 */
export function ScrollToTop() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);
  return null;
}
