import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eyebrow,
  Section,
  SectionHeading,
  Stat,
  StatRow,
} from "@/components/ds";
import { ServiceCard } from "@/components/site/service-card";
import { ProjectCard } from "@/components/site/project-card";
import { FeatureIcon } from "@/components/site/feature-icon";
import {
  getConfiguracion,
  getHome,
  getServiciosPublicados,
  getProyectosDestacados,
} from "@/lib/content/queries";

type Cta = { texto: string; destino: string };
type Diferenciador = { icono?: string; titulo: string; texto: string };
type Paso = { numero?: string; titulo: string; texto: string };

function asCta(value: unknown): Cta | null {
  if (value && typeof value === "object" && "texto" in value) {
    const o = value as Record<string, unknown>;
    return {
      texto: String(o.texto ?? ""),
      destino: String(o.destino ?? "#"),
    };
  }
  return null;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

const CATALOGO = ["Transparente", "Estructural", "Pagoda", "Galpón"];

export default async function HomePage() {
  const [config, home, servicios] = await Promise.all([
    getConfiguracion(),
    getHome(),
    getServiciosPublicados(),
  ]);
  const destacados = await getProyectosDestacados(
    home?.proyectos_destacados ?? [],
  );

  const ctaPrimario = asCta(home?.hero_cta_primario);
  const ctaSecundario = asCta(home?.hero_cta_secundario);
  const diferenciadores = asArray<Diferenciador>(home?.diferenciadores);
  const pasos = asArray<Paso>(home?.pasos_proceso);
  const wa = config?.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <>
      {/* S2 — Hero */}
      <section className="on-dark border-b border-gold/20 bg-ink text-bone">
        <div className="mx-auto w-full max-w-5xl px-5 py-24 md:px-8 md:py-32">
          <Eyebrow tone="light">Arriendo · diseño · montaje de carpas</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-balance font-serif text-display font-bold">
            {home?.hero_titulo ??
              "Estructuras que sostienen tus mejores eventos."}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-muted-foreground">
            {home?.hero_bajada}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ctaPrimario ? (
              <Button asChild size="lg" variant="inverted">
                <Link href={ctaPrimario.destino}>{ctaPrimario.texto}</Link>
              </Button>
            ) : null}
            {ctaSecundario ? (
              <Button asChild size="lg" variant="outline-dark">
                <Link href={ctaSecundario.destino}>{ctaSecundario.texto}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Barra de cifras */}
      <Section tone="alt" innerClassName="py-10 md:py-12">
        <StatRow className="mx-auto max-w-2xl">
          <Stat value="+15" label="años de experiencia" />
          <Stat value="200+" label="eventos al año" />
          <Stat value="RM·V" label="regiones de cobertura" />
        </StatRow>
      </Section>

      {/* S3 — Segmentos / Servicios */}
      <Section tone="bone" id="segmentos">
        <SectionHeading eyebrow="Para cada ocasión">
          Cuatro segmentos, un mismo estándar.
        </SectionHeading>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {servicios.map((servicio, i) => (
            <ServiceCard key={servicio.id} servicio={servicio} indice={i + 1} />
          ))}
        </div>
      </Section>

      {/* Catálogo de carpas (chips) */}
      <Section
        tone="alt"
        innerClassName="flex flex-col items-center gap-5 py-12 md:py-14"
      >
        <Eyebrow>Catálogo de carpas</Eyebrow>
        <div className="flex flex-wrap justify-center gap-3">
          {CATALOGO.map((c) => (
            <Badge key={c} variant="outline">
              {c}
            </Badge>
          ))}
        </div>
      </Section>

      {/* S4 — Trabajos destacados */}
      <Section tone="white" id="trabajos">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Trabajos realizados">
            Eventos que ya montamos.
          </SectionHeading>
          <Button asChild variant="link">
            <Link href="/trabajos">Ver todos los trabajos</Link>
          </Button>
        </div>
        {destacados.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((proyecto) => (
              <ProjectCard key={proyecto.id} proyecto={proyecto} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-muted-foreground">
            Pronto publicaremos nuestros trabajos.
          </p>
        )}
      </Section>

      {/* S5 — Por qué elegirnos */}
      <Section tone="dark" id="por-que">
        <SectionHeading eyebrow="Por qué elegirnos" tone="dark">
          La confianza se monta antes que la carpa.
        </SectionHeading>
        <div className="mt-10 grid gap-px overflow-hidden rounded border border-gold/20 bg-gold/20 md:grid-cols-3">
          {diferenciadores.map((d) => (
            <div key={d.titulo} className="flex flex-col gap-4 bg-ink p-6">
              <FeatureIcon name={d.icono} className="size-7 text-gold" />
              <h3 className="font-serif text-lg font-bold text-bone">
                {d.titulo}
              </h3>
              <p className="text-sm text-muted-foreground">{d.texto}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* S6 — Cómo trabajamos */}
      <Section tone="bone" id="proceso">
        <SectionHeading eyebrow="Cómo trabajamos">
          Un proceso claro, de la asesoría al desmontaje.
        </SectionHeading>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((paso, i) => (
            <li
              key={paso.titulo}
              className="flex flex-col gap-3 border-t border-gold/40 pt-5"
            >
              <span className="font-serif text-3xl font-bold italic leading-none text-gold-deep">
                {paso.numero ?? String(i + 1)}
              </span>
              <h3 className="font-serif text-lg font-bold text-foreground">
                {paso.titulo}
              </h3>
              <p className="text-sm text-muted-foreground">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* S8 — Cotización (CTA) */}
      <Section tone="dark" id="cotizar">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionHeading
            eyebrow="Cotiza tu evento"
            tone="dark"
            className="items-center"
          >
            Cuéntanos qué celebras y lo montamos.
          </SectionHeading>
          <p className="max-w-xl text-muted-foreground">
            Respondemos con una propuesta formal: factura, detalle de montaje y
            visita a terreno antes de confirmar.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="inverted">
              <Link href="/cotizar">Solicitar cotización</Link>
            </Button>
            {wa ? (
              <Button asChild size="lg" variant="outline-dark">
                <Link href={wa} target="_blank" rel="noreferrer">
                  Escríbenos por WhatsApp
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Section>
    </>
  );
}
