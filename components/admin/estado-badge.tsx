import { cn } from "@/lib/utils";

type Estado = "borrador" | "publicado" | "archivado";

const styles: Record<Estado, string> = {
  borrador: "bg-bone-dark text-muted-foreground",
  publicado: "bg-gold text-ink-deep",
  archivado: "border border-input text-muted-foreground",
};

export function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
        styles[estado],
      )}
    >
      {estado}
    </span>
  );
}
