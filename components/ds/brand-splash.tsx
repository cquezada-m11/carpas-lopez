import { cn } from "@/lib/utils";

/**
 * Splash de carga de marca: fondo ink con el wordmark dorado y un indicador
 * "Cargando…". Se usa como overlay global (ver `LoadingOverlayProvider`) y puede
 * reutilizarse como fallback de un `loading.tsx` de ruta.
 */
export function BrandSplash({
  label = "Cargando…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-ink",
        "duration-200 animate-in fade-in",
        className,
      )}
    >
      <span className="font-serif text-3xl font-bold tracking-tight text-gold md:text-4xl">
        Carpas López
      </span>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="size-5 animate-spin rounded-full border-2 border-gold/25 border-t-gold"
        />
        <span className="font-mono text-eyebrow uppercase tracking-widest text-bone/70">
          {label}
        </span>
      </div>
      <span className="sr-only">Cargando</span>
    </div>
  );
}
