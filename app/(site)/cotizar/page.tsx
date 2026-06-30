import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Section, SectionHeading } from "@/components/ds";
import { CotizarForm } from "@/components/site/cotizar-form";
import { getConfiguracion } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Cotiza tu evento",
  description:
    "Solicita una cotización formal para tu evento: asesoría en terreno, montaje puntual y seguridad estructural.",
};

export default async function CotizarPage() {
  const config = await getConfiguracion();
  const wa = config?.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <Section tone="bone">
      <SectionHeading eyebrow="Cotiza tu evento">
        Cuéntanos qué celebras y lo montamos.
      </SectionHeading>
      <p className="mt-4 max-w-prose text-muted-foreground">
        Completa los datos y te responderemos con una propuesta formal: factura,
        detalle de montaje y visita a terreno antes de confirmar.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem]">
        <CotizarForm whatsapp={config?.whatsapp ?? null} />

        <aside className="flex h-fit flex-col gap-4 rounded border border-border bg-card p-5 shadow-card">
          <span className="font-mono text-eyebrow uppercase text-gold-deep">
            ¿Prefieres hablar?
          </span>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-gold-deep"
            >
              <MessageCircle className="size-4 text-gold-deep" aria-hidden />
              WhatsApp directo
            </a>
          ) : null}
          {config?.telefono ? (
            <a
              href={`tel:${config.telefono.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-foreground hover:text-gold-deep"
            >
              <Phone className="size-4 text-gold-deep" aria-hidden />
              {config.telefono}
            </a>
          ) : null}
          {config?.email ? (
            <a
              href={`mailto:${config.email}`}
              className="flex items-center gap-2 text-sm text-foreground hover:text-gold-deep"
            >
              <Mail className="size-4 text-gold-deep" aria-hidden />
              {config.email}
            </a>
          ) : null}
          {config?.horarios ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-gold-deep" aria-hidden />
              {config.horarios}
            </p>
          ) : null}
        </aside>
      </div>
    </Section>
  );
}
