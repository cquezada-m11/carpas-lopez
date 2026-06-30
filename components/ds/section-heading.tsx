import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

/**
 * Título de sección serif, con eyebrow opcional encima.
 * Las secciones oscuras heredan el color vía contexto `.on-dark`.
 */
export function SectionHeading({
  eyebrow,
  children,
  className,
  tone = "light",
  as: Tag = "h2",
}: {
  eyebrow?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {eyebrow ? (
        <Eyebrow tone={tone === "dark" ? "light" : "gold"}>{eyebrow}</Eyebrow>
      ) : null}
      <Tag className="text-balance font-serif text-heading-lg font-bold">
        {children}
      </Tag>
    </div>
  );
}
