import { cn } from "@/lib/utils";

/**
 * Cifra destacada: valor serif en dorado + etiqueta mono en versalitas.
 * Usado en la barra de stats del hero y en la ficha técnica de proyectos.
 */
export function Stat({
  value,
  label,
  className,
}: {
  value: React.ReactNode;
  label: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <div className="font-serif text-2xl font-bold leading-none text-gold-deep">
        {value}
      </div>
      <div className="mt-1.5 font-mono text-eyebrow uppercase text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/**
 * Fila de stats con divisores verticales (barra del hero).
 */
export function StatRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex divide-x divide-border border-y border-border [&>*]:flex-1 [&>*]:py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
