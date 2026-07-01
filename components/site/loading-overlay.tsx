"use client";

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import { BrandSplash } from "@/components/ds/brand-splash";

// Umbral antes de mostrar: cargas más rápidas que esto no muestran nada
// (evita el parpadeo del overlay en navegaciones instantáneas).
const SHOW_DELAY = 250;
// Tiempo mínimo visible una vez mostrado (evita un flash y desaparición).
const MIN_VISIBLE = 450;
// Tope de seguridad para navegación: si algo se cancela, no dejamos el overlay
// colgado indefinidamente.
const SAFETY_TIMEOUT = 8000;

type LoadingOverlayCtx = {
  /** Inicia una carga; devuelve la función para finalizarla (idempotente). */
  begin: () => () => void;
};

const LoadingOverlayContext = createContext<LoadingOverlayCtx | null>(null);

export function useLoadingOverlay(): LoadingOverlayCtx {
  const ctx = useContext(LoadingOverlayContext);
  if (!ctx) {
    throw new Error(
      "useLoadingOverlay debe usarse dentro de <LoadingOverlayProvider>",
    );
  }
  return ctx;
}

/**
 * Enlaza un booleano `pending` (de `useTransition` / `useActionState`) al overlay
 * global. Muestra el splash mientras la acción esté en curso (respetando el
 * umbral y el tiempo mínimo del provider).
 */
export function useOverlayPending(pending: boolean) {
  const { begin } = useLoadingOverlay();
  const endRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (pending && !endRef.current) {
      endRef.current = begin();
    } else if (!pending && endRef.current) {
      endRef.current();
      endRef.current = null;
    }
    return () => {
      if (endRef.current) {
        endRef.current();
        endRef.current = null;
      }
    };
  }, [pending, begin]);
}

export function LoadingOverlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const count = useRef(0);
  const visibleRef = useRef(false);
  const shownAt = useRef(0);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const setVis = useCallback((v: boolean) => {
    visibleRef.current = v;
    setVisible(v);
  }, []);

  // `begin` mantiene identidad estable (deps solo [setVis]) para no re-disparar
  // los efectos que dependen de él.
  const begin = useCallback(() => {
    count.current += 1;
    if (count.current === 1) {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      if (!visibleRef.current && !showTimer.current) {
        showTimer.current = setTimeout(() => {
          showTimer.current = null;
          shownAt.current = Date.now();
          setVis(true);
        }, SHOW_DELAY);
      }
    }

    let ended = false;
    return () => {
      if (ended) return;
      ended = true;
      count.current = Math.max(0, count.current - 1);
      if (count.current > 0) return;

      if (showTimer.current) {
        clearTimeout(showTimer.current);
        showTimer.current = null;
      }
      if (!visibleRef.current) return; // nunca llegó a mostrarse

      const elapsed = Date.now() - shownAt.current;
      const wait = Math.max(0, MIN_VISIBLE - elapsed);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        hideTimer.current = null;
        if (count.current === 0) setVis(false);
      }, wait);
    };
  }, [setVis]);

  const value = useMemo(() => ({ begin }), [begin]);

  return (
    <LoadingOverlayContext.Provider value={value}>
      <Suspense fallback={null}>
        <NavigationWatcher />
      </Suspense>
      {children}
      {mounted && visible ? createPortal(<BrandSplash />, document.body) : null}
    </LoadingOverlayContext.Provider>
  );
}

/**
 * Muestra el overlay al iniciar una navegación (click en un enlace interno o
 * back/forward) y lo oculta cuando la ruta se asienta (cambia pathname o query).
 */
function NavigationWatcher() {
  const { begin } = useLoadingOverlay();
  const pathname = usePathname();
  const search = useSearchParams();
  const endRef = useRef<(() => void) | null>(null);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (safety.current) {
      clearTimeout(safety.current);
      safety.current = null;
    }
    endRef.current?.();
    endRef.current = null;
  }, []);

  const start = useCallback(() => {
    endRef.current?.();
    endRef.current = begin();
    if (safety.current) clearTimeout(safety.current);
    safety.current = setTimeout(() => {
      endRef.current?.();
      endRef.current = null;
      safety.current = null;
    }, SAFETY_TIMEOUT);
  }, [begin]);

  // La ruta se asentó → oculta el overlay.
  useEffect(() => {
    stop();
    // pathname/search como señal de "navegación completada".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel")?.includes("external")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Misma URL o salto de ancla en la página actual: sin overlay.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }
      start();
    }

    function onPopState() {
      start();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [start]);

  return null;
}
