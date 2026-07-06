import { Suspense } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  StickyNote,
  Archive,
  RotateCcw,
} from "lucide-react";
import {
  listCotizacionesAdmin,
  countCotizacionesArchivadas,
  type CotizacionListItem,
} from "@/lib/content/admin";
import { restoreCotizacion } from "@/app/admin/cotizaciones/actions";
import { formatFechaCorta } from "@/lib/content/format";
import { Button } from "@/components/ui/button";
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

function RowInfo({ c }: { c: CotizacionListItem }) {
  return (
    <>
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
    </>
  );
}

export default function CotizacionesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ archivadas?: string }>;
}) {
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
        <Lista searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Lista({
  searchParams,
}: {
  searchParams: Promise<{ archivadas?: string }>;
}) {
  const { archivadas } = await searchParams;
  const archived = archivadas === "1";
  const [rows, archivadasCount] = await Promise.all([
    listCotizacionesAdmin({ archivadas: archived }),
    countCotizacionesArchivadas(),
  ]);

  const tabClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors",
      active
        ? "bg-gold/15 font-semibold text-foreground"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/cotizaciones" className={tabClass(!archived)}>
          Activas
        </Link>
        <Link
          href="/admin/cotizaciones?archivadas=1"
          className={tabClass(archived)}
        >
          <Archive className="size-3.5" aria-hidden />
          Archivadas
          {archivadasCount > 0 ? ` (${archivadasCount})` : ""}
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded border border-dashed border-input px-4 py-12 text-center text-muted-foreground">
          {archived
            ? "No hay cotizaciones archivadas."
            : "Aún no llegan cotizaciones."}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {rows.map((c) =>
            archived ? (
              <li key={c.id} className="flex items-center gap-4 px-4 py-3.5">
                <Link
                  href={`/admin/cotizaciones/${c.id}`}
                  className="min-w-0 flex-1 transition-opacity hover:opacity-80"
                >
                  <RowInfo c={c} />
                </Link>
                <form
                  action={restoreCotizacion.bind(null, c.id)}
                  className="shrink-0"
                >
                  <Button type="submit" variant="outline" size="sm">
                    <RotateCcw className="size-4" /> Restaurar
                  </Button>
                </form>
              </li>
            ) : (
              <li key={c.id}>
                <Link
                  href={`/admin/cotizaciones/${c.id}`}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-foreground/5"
                >
                  <div className="min-w-0 flex-1">
                    <RowInfo c={c} />
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <EstadoPill estado={c.estado} />
                    <span className="text-[11px] text-muted-foreground">
                      {formatFechaCorta(c.created_at.slice(0, 10))}
                    </span>
                  </div>
                </Link>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
