import type { Metadata } from "next";
import Link from "next/link";
import {
  Section,
  SectionHeading,
  Stat,
  StatRow,
  OrnamentDivider,
} from "@/components/ds";
import { Button } from "@/components/ui/button";
import { FeatureIcon } from "@/components/site/feature-icon";
import { getHome } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Equipo dedicado al arriendo, diseño y montaje de carpas. Puntualidad, seguridad estructural y asesoría en terreno.",
};

type Diferenciador = { icono?: string; titulo: string; texto: string };
type Paso = { numero?: string; titulo: string; texto: string };
type StatItem = { valor: string; etiqueta: string };

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default async function NosotrosPage() {
  const home = await getHome();
  const diferenciadores = asArray<Diferenciador>(home?.diferenciadores);
  const pasos = asArray<Paso>(home?.pasos_proceso);
  const stats = asArray<StatItem>(home?.stats);

  return (
    <>
      <Section tone="bone">
        <SectionHeading eyebrow="Nosotros" as="h1">
          La confianza se monta antes que la carpa.
        </SectionHeading>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted-foreground">
          Somos un equipo dedicado al arriendo, diseño y montaje de carpas para
          eventos. Más que estructuras, entregamos tranquilidad: llegamos a la
          hora, anclamos con cálculo según superficie y viento, y asesoramos en
          terreno antes de cotizar.
        </p>
        {stats.length > 0 ? (
          <StatRow className="mt-10 max-w-2xl">
            {stats.map((s) => (
              <Stat
                key={s.etiqueta || s.valor}
                value={s.valor}
                label={s.etiqueta}
              />
            ))}
          </StatRow>
        ) : null}
      </Section>

      {diferenciadores.length > 0 ? (
        <Section tone="dark">
          <SectionHeading eyebrow="Por qué elegirnos" tone="dark">
            Lo que nos diferencia.
          </SectionHeading>
          <div className="mt-10 grid gap-px overflow-hidden rounded border border-gold/20 bg-gold/20 md:grid-cols-3">
            {diferenciadores.map((d) => (
              <div key={d.titulo} className="flex flex-col gap-4 bg-ink p-6">
                <FeatureIcon name={d.icono} className="size-7 text-gold" />
                <h2 className="font-serif text-lg font-bold text-bone">
                  {d.titulo}
                </h2>
                <p className="text-sm text-muted-foreground">{d.texto}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {pasos.length > 0 ? (
        <Section tone="bone">
          <SectionHeading eyebrow="Cómo trabajamos">
            De la asesoría al desmontaje.
          </SectionHeading>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map((p, i) => (
              <li
                key={p.titulo}
                className="flex flex-col gap-3 border-t border-gold/40 pt-5"
              >
                <span className="font-serif text-3xl font-bold italic leading-none text-gold-deep">
                  {p.numero ?? String(i + 1)}
                </span>
                <h2 className="font-serif text-lg font-bold text-foreground">
                  {p.titulo}
                </h2>
                <p className="text-sm text-muted-foreground">{p.texto}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section tone="alt">
        <div className="flex flex-col items-center gap-6 text-center">
          <OrnamentDivider className="max-w-xs" />
          <SectionHeading eyebrow="Cotiza tu evento" className="items-center">
            Conversemos tu próximo evento.
          </SectionHeading>
          <Button asChild size="lg">
            <Link href="/cotizar">Solicitar cotización</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
