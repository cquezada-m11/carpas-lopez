import { Suspense } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, StickyNote } from "lucide-react";
import { listCotizacionesAdmin } from "@/lib/content/admin";
import { formatFechaCorta } from "@/lib/content/format";
import { cn } from "@/lib/utils";

const ESTADO_STYLES: Record<string, string> = {
  nuevo: "bg-gold text-ink-deep",
  contactado: "bg-bone-dark text-foreground",
  cotizado: "bg-gold/15 text-gold-deep",
  cerrado: "bg-ink text-bone",
  descartado: "border border-input text-muted-foreground",
};

function EstadoPill({ estado }: { estado: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
        ESTADO_STYLES[estado] ?? "bg-bone-dark text-muted-foreground",
      )}
    >
      {estado}
    </span>
  );
}

export default function CotizacionesAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-heading-lg font-bold">Cotizaciones</h1>
        <p className="mt-2 text-muted-foreground">
          Solicitudes recibidas desde el formulario del sitio. Abre una para ver
          el detalle y dejar notas internas.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Lista />
      </Suspense>
    </div>
  );
}

async function Lista() {
  const rows = await listCotizacionesAdmin();

  if (rows.length === 0) {
    return (
      <p className="rounded border border-dashed border-input px-4 py-12 text-center text-muted-foreground">
        Aún no llegan cotizaciones.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {rows.map((c) => (
        <li key={c.id}>
          <Link
            href={`/admin/cotizaciones/${c.id}`}
            className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-foreground/5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate font-semibold text-foreground">
                  {c.nombre}
                </span>
                {c.tieneNotas ? (
                  <StickyNote
                    className="size-3.5 shrink-0 text-gold-deep"
                    aria-label="Con notas"
                  />
                ) : null}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>{c.tipo_evento ?? "—"}</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" aria-hidden />
                  {c.fecha_evento
                    ? formatFechaCorta(c.fecha_evento)
                    : (c.fecha_rango ?? "—")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" aria-hidden />
                  {c.ubicacion ?? "—"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3" aria-hidden />
                  {c.numero_personas ?? "—"}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <EstadoPill estado={c.estado} />
              <span className="text-[11px] text-muted-foreground">
                {formatFechaCorta(c.created_at.slice(0, 10))}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
