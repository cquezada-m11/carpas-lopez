import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, Clock, Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/ds";
import { Button } from "@/components/ui/button";
import { CotizarForm } from "@/components/site/cotizar-form";
import { getConfiguracion } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Cotiza tu evento",
  description:
    "Solicita una cotización formal para tu evento: asesoría en terreno, montaje puntual y seguridad estructural.",
};

const BENEFICIOS = [
  "Te respondemos a la brevedad",
  "Visita a terreno antes de confirmar",
  "Propuesta formal con factura",
  "Sin compromiso",
];

export default async function CotizarPage() {
  const config = await getConfiguracion();
  const wa = config?.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <Section tone="bone">
      <SectionHeading eyebrow="Cotiza tu evento" as="h1">
        Cuéntanos qué celebras y lo montamos.
      </SectionHeading>
      <p className="mt-4 max-w-prose text-muted-foreground">
        Completa el formulario y te respondemos con una propuesta formal —con
        factura y detalle de montaje— tras coordinar una visita a terreno. Toma
        menos de dos minutos.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <CotizarForm whatsapp={config?.whatsapp ?? null} />

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <span className="font-mono text-eyebrow uppercase text-gold-deep">
              Qué puedes esperar
            </span>
            <ul className="mt-4 flex flex-col gap-3">
              {BENEFICIOS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="on-dark flex flex-col gap-4 rounded-2xl border border-border bg-ink p-5 text-bone shadow-card">
            <span className="font-mono text-eyebrow uppercase text-gold">
              ¿Prefieres hablar?
            </span>
            <p className="text-sm text-muted-foreground">
              Escríbenos y coordinamos tu evento directo por WhatsApp.
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
