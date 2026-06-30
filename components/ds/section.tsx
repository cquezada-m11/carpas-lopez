import { cn } from "@/lib/utils";

type Tone = "bone" | "alt" | "dark" | "white";

const toneStyles: Record<Tone, string> = {
  bone: "bg-bone text-foreground",
  alt: "bg-bone-alt text-foreground border-y border-border",
  dark: "bg-ink text-bone on-dark",
  white: "bg-white text-foreground",
};

/**
 * Contenedor de sección con tono y padding consistentes.
 * `tone="dark"` activa el contexto `.on-dark` para invertir los tonos de texto.
 */
export function Section({
  children,
  className,
  innerClassName,
  tone = "bone",
  as: Tag = "section",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: Tone;
  as?: React.ElementType;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn(toneStyles[tone], className)}>
      <div
        className={cn(
          "mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-24",
          innerClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
