import { cn } from "@/lib/utils";

/**
 * Divisor ornamental: línea — rombo dorado — línea.
 * Detalle premium que separa bloques (PRD §11.2: el dorado como acento puntual).
 */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="size-[7px] rotate-45 bg-gold" />
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
