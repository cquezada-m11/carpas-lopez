import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ds";
import { Button } from "@/components/ui/button";
import { getCotizacionPublica } from "@/lib/content/cotizacion-publica";
import { getConfiguracion } from "@/lib/content/queries";
import { formatFechaCorta, formatFechaHora } from "@/lib/content/format";
import { segmentoLabel, isSegmento } from "@/lib/content/segmento";

export const metadata: Metadata = {
  title: "Tu solicitud de cotización",
  description: "Resumen de la solicitud de cotización enviada a Carpas López.",
  robots: { index: false, follow: false },
};

// Estados internos → texto orientado al cliente.
const ESTADO_PUBLICO: Record<string, string> = {
  nuevo: "Solicitud recibida",
  contactado: "En contacto contigo",
  cotizado: "Cotización enviada",
  cerrado: "Cerrada",
  descartado: "Cerrada",
};

export default function CotizacionPublicaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense
      fallback={
        <Section tone="bone">
          <p className="text-muted-foreground">Cargando…</p>
        </Section>
      }
    >
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
    <div className="flex items-start gap-3 border-b border-border py-3 last:border-0">
      <Icon className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden />
      <span className="w-32 shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{children}</span>
    </div>
  );
}

async function Detalle({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [c, config] = await Promise.all([
    getCotizacionPublica(token),
    getConfiguracion(),
  ]);
  if (!c) notFound();

  const fecha = c.fecha_evento
    ? formatFechaCorta(c.fecha_evento)
    : (c.fecha_rango ?? "Por definir");
  const estado = ESTADO_PUBLICO[c.estado] ?? "Solicitud recibida";
  const wa = config?.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <Section tone="bone">
      <Link
        href="/cotizar"
        className="flex w-fit items-center gap-1.5 font-mono text-eyebrow uppercase text-gold-deep hover:text-gold"
      >
        <ArrowLeft className="size-3.5" /> Nueva cotización
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold text-ink-deep">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <div>
          <span className="font-mono text-eyebrow uppercase text-gold-deep">
            {estado}
          </span>
          <h1 className="font-serif text-heading-lg font-bold leading-tight">
            Hola, {c.nombre}
          </h1>
        </div>
      </div>
      <p className="mt-4 max-w-prose text-muted-foreground">
        Esta es tu solicitud enviada el {formatFechaHora(c.created_at)}. La
        estamos revisando y te contactaremos con una propuesta formal. Guarda
        este enlace para hacer seguimiento.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <span className="font-mono text-eyebrow uppercase text-gold-deep">
              El evento
            </span>
            <div className="mt-4 flex flex-col">
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
              {isSegmento(c.segmento) ? (
                <InfoRow icon={Tag} label="Segmento">
                  {segmentoLabel[c.segmento]}
                </InfoRow>
              ) : null}
            </div>
          </div>

          {c.mensaje ? (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
              <span className="font-mono text-eyebrow uppercase text-gold-deep">
                Tu mensaje
              </span>
              <p className="mt-4 whitespace-pre-line rounded-xl bg-bone-alt px-4 py-3 text-sm text-foreground">
                {c.mensaje}
              </p>
            </div>
          ) : null}
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div className="on-dark flex flex-col gap-4 rounded-2xl border border-border bg-ink p-5 text-bone shadow-card">
            <span className="font-mono text-eyebrow uppercase text-gold">
              ¿Quieres adelantar detalles?
            </span>
            <p className="text-sm text-muted-foreground">
              Escríbenos por WhatsApp y coordinamos tu evento directo.
            </p>
            {wa ? (
              <Button asChild variant="gold" size="block">
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" /> WhatsApp directo
                </a>
              </Button>
            ) : null}
            <div className="flex flex-col gap-2 border-t border-gold/20 pt-4 text-sm">
              {config?.telefono ? (
                <a
                  href={`tel:${config.telefono.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-bone hover:text-gold"
                >
                  <Phone className="size-4 text-gold" aria-hidden />
                  {config.telefono}
                </a>
              ) : null}
              {config?.email ? (
                <a
                  href={`mailto:${config.email}`}
                  className="flex items-center gap-2 text-bone hover:text-gold"
                >
                  <Mail className="size-4 text-gold" aria-hidden />
                  {config.email}
                </a>
              ) : null}
              {config?.horarios ? (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 text-gold" aria-hidden />
                  {config.horarios}
                </p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
