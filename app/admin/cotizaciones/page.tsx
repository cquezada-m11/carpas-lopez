import { Suspense } from "react";
import { Calendar, MapPin, Users, Mail, Phone } from "lucide-react";
import { listCotizacionesAdmin } from "@/lib/content/admin";
import { EstadoLeadSelect } from "@/components/admin/estado-lead-select";
import { segmentoLabel, isSegmento } from "@/lib/content/segmento";
import { formatFechaCorta, formatFechaHora } from "@/lib/content/format";

export default function CotizacionesAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-heading-lg font-bold">Cotizaciones</h1>
        <p className="mt-2 text-muted-foreground">
          Solicitudes recibidas desde el formulario del sitio.
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
    <ul className="flex flex-col gap-4">
      {rows.map((c) => (
        <li
          key={c.id}
          className="flex flex-col gap-4 rounded border border-border bg-card p-5 shadow-card"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-lg font-bold">{c.nombre}</span>
                {isSegmento(c.segmento) ? (
                  <span className="font-mono text-eyebrow uppercase text-gold-deep">
                    {segmentoLabel[c.segmento]}
                  </span>
                ) : null}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatFechaHora(c.created_at)} · {c.origen ?? "—"}
              </span>
            </div>
            <EstadoLeadSelect id={c.id} estado={c.estado} />
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4 text-gold-deep" aria-hidden />
              {formatFechaCorta(c.fecha_evento) ?? "—"}
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 text-gold-deep" aria-hidden />
              {c.ubicacion ?? "—"}
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4 text-gold-deep" aria-hidden />
              {c.numero_personas ? `${c.numero_personas} personas` : "—"}
            </span>
            <span className="text-muted-foreground">
              {c.tipo_evento ?? "—"}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {c.email ? (
              <a
                href={`mailto:${c.email}`}
                className="flex items-center gap-2 text-foreground hover:text-gold-deep"
              >
                <Mail className="size-4 text-gold-deep" aria-hidden />
                {c.email}
              </a>
            ) : null}
            {c.telefono ? (
              <a
                href={`tel:${c.telefono.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-foreground hover:text-gold-deep"
              >
                <Phone className="size-4 text-gold-deep" aria-hidden />
                {c.telefono}
              </a>
            ) : null}
          </div>

          {c.mensaje ? (
            <p className="rounded-sm bg-bone-alt px-3 py-2 text-sm text-foreground">
              {c.mensaje}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
