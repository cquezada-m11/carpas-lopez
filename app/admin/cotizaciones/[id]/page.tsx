import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Tag,
} from "lucide-react";
import { getCotizacionAdmin } from "@/lib/content/admin";
import { AdminPanel } from "@/components/admin/admin-panel";
import { EstadoLeadSelect } from "@/components/admin/estado-lead-select";
import { NotasCotizacion } from "@/components/admin/notas-cotizacion";
import { Button } from "@/components/ui/button";
import { segmentoLabel, isSegmento } from "@/lib/content/segmento";
import { formatFechaCorta, formatFechaHora } from "@/lib/content/format";

export default function CotizacionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
      <Detalle params={params} />
    </Suspense>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Calendar;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border py-2.5 last:border-0">
      <Icon className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden />
      <span className="w-32 shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{children}</span>
    </div>
  );
}

async function Detalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getCotizacionAdmin(id);
  if (!c) notFound();

  const wa = c.telefono
    ? `https://wa.me/${c.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hola ${c.nombre}, gracias por tu solicitud de cotización en Carpas López.`,
      )}`
    : null;
  const fecha = c.fecha_evento
    ? formatFechaCorta(c.fecha_evento)
    : (c.fecha_rango ?? "—");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/cotizaciones"
          className="flex w-fit items-center gap-1.5 font-mono text-eyebrow uppercase text-gold-deep hover:text-gold"
        >
          <ArrowLeft className="size-3.5" /> Cotizaciones
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-heading-lg font-bold">{c.nombre}</h1>
          <span className="rounded-full bg-bone-alt px-2.5 py-0.5 font-mono text-eyebrow uppercase text-gold-deep">
            {c.estado}
          </span>
          <span className="text-xs text-muted-foreground">
            Recibido {formatFechaHora(c.created_at)} · {c.origen ?? "—"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <AdminPanel eyebrow="Solicitud" title="El evento">
            <div className="flex flex-col">
              <InfoRow icon={Tag} label="Tipo de evento">
                {c.tipo_evento ?? "—"}
              </InfoRow>
              <InfoRow icon={Calendar} label="Fecha">
                {fecha}
                {c.fecha_rango && !c.fecha_evento ? (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (aproximada)
                  </span>
                ) : null}
              </InfoRow>
              <InfoRow icon={MapPin} label="Ubicación">
                {c.ubicacion ?? "—"}
              </InfoRow>
              <InfoRow icon={Users} label="Personas">
                {c.numero_personas ? `${c.numero_personas} personas` : "—"}
              </InfoRow>
              <InfoRow icon={Tag} label="Segmento">
                {isSegmento(c.segmento) ? segmentoLabel[c.segmento] : "—"}
              </InfoRow>
            </div>
          </AdminPanel>

          <AdminPanel eyebrow="Del cliente" title="Mensaje">
            {c.mensaje ? (
              <p className="whitespace-pre-line rounded-xl bg-bone-alt px-4 py-3 text-sm text-foreground">
                {c.mensaje}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sin mensaje adicional.
              </p>
            )}
          </AdminPanel>

          <AdminPanel
            eyebrow="Interno"
            title="Notas del equipo"
            description="No se muestran al cliente; sirven para seguimiento y traspaso."
          >
            <NotasCotizacion id={c.id} initial={c.notas} />
          </AdminPanel>
        </div>

        <aside className="flex flex-col gap-6">
          <AdminPanel eyebrow="Gestión" title="Estado">
            <EstadoLeadSelect id={c.id} estado={c.estado} />
            <p className="text-xs text-muted-foreground">
              Última actualización: {formatFechaHora(c.updated_at) ?? "—"}
            </p>
          </AdminPanel>

          <AdminPanel eyebrow="Responder" title="Contacto">
            <div className="flex flex-col gap-2.5 text-sm">
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
            <div className="mt-1 flex flex-col gap-2">
              {wa ? (
                <Button asChild variant="gold" size="sm">
                  <a href={wa} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                </Button>
              ) : null}
              {c.email ? (
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${c.email}`}>
                    <Mail className="size-4" /> Responder por correo
                  </a>
                </Button>
              ) : null}
            </div>
          </AdminPanel>

          <AdminPanel eyebrow="Registro" title="Fechas">
            <div className="flex flex-col">
              <InfoRow icon={Clock} label="Recibido">
                {formatFechaHora(c.created_at) ?? "—"}
              </InfoRow>
              <InfoRow icon={Clock} label="Actualizado">
                {formatFechaHora(c.updated_at) ?? "—"}
              </InfoRow>
            </div>
          </AdminPanel>
        </aside>
      </div>
    </div>
  );
}
