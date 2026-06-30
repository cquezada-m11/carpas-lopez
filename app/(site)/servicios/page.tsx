import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ds";
import { Button } from "@/components/ui/button";
import { getServiciosPublicados } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Arriendo, diseño y montaje de carpas para eventos sociales, corporativos, públicos e industriales.",
};

export default async function ServiciosPage() {
  const servicios = await getServiciosPublicados();

  return (
    <>
      <Section tone="bone">
        <SectionHeading eyebrow="Servicios" as="h1">
          Para cada tipo de evento.
        </SectionHeading>
        <p className="mt-4 max-w-prose text-muted-foreground">
          Cubrimos cuatro segmentos con el mismo estándar: asesoría en terreno,
          montaje puntual y seguridad estructural. Elige el tuyo para ver
          trabajos similares.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          {servicios.map((servicio, i) => (
            <Link
              key={servicio.id}
              href={
                servicio.segmento_asociado
                  ? `/trabajos?segmento=${servicio.segmento_asociado}`
                  : "/trabajos"
              }
              className="group grid items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated md:grid-cols-[auto_1fr_auto]"
            >
              <span className="font-serif text-2xl italic leading-none text-gold-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-serif text-heading font-bold text-foreground">
                  {servicio.titulo}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  {servicio.descripcion}
                </p>
              </div>
              <span className="font-mono text-eyebrow uppercase text-gold-deep transition-transform group-hover:translate-x-1">
                Ver trabajos →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionHeading
            eyebrow="Cotiza tu evento"
            tone="dark"
            className="items-center"
          >
            ¿Listo para montar el tuyo?
          </SectionHeading>
          <Button asChild size="lg" variant="inverted">
            <Link href="/cotizar">Solicitar cotización</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
