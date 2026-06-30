import { cn } from "@/lib/utils";

/**
 * Eyebrow / kicker: etiqueta mono en versalitas con tracking amplio.
 * Patrón recurrente del diseño ("Para cada ocasión", "Por qué elegirnos").
 */
export function Eyebrow({
  children,
  className,
  tone = "gold",
}: {
  children: React.ReactNode;
  className?: string;
  /** gold = sobre claro; light = sobre fondo oscuro */
  tone?: "gold" | "light";
}) {
  return (
    <span
      className={cn(
        "block font-mono text-eyebrow uppercase",
        tone === "gold" ? "text-gold-deep" : "text-gold",
        className,
      )}
    >
      {children}
    </span>
  );
}
