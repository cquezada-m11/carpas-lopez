/**
 * Panel de sección para el admin: card con encabezado (eyebrow + título +
 * descripción) y una acción opcional a la derecha. Da jerarquía visual a los
 * formularios largos agrupando cada bloque.
 */
export function AdminPanel({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          {eyebrow ? (
            <span className="font-mono text-eyebrow uppercase text-gold-deep">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="font-serif text-heading font-bold text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="max-w-prose text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
