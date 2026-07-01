import Image from "next/image";
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
import { TentIcon } from "@/components/site/tent-icon";
import { mediaUrl } from "@/lib/content/media";
import {
  getConfiguracion,
  getHome,
  getServiciosPublicados,
  getProyectosDestacados,
  getTiposCarpaPublicados,
  getTestimoniosPublicados,
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

export default async function HomePage() {
  const [config, home, servicios, tipos, testimonios] = await Promise.all([
    getConfiguracion(),
    getHome(),
    getServiciosPublicados(),
    getTiposCarpaPublicados(),
    getTestimoniosPublicados(),
  ]);
  const destacados = await getProyectosDestacados(
    home?.proyectos_destacados ?? [],
  );

  const ctaPrimario = asCta(home?.hero_cta_primario);
  const ctaSecundario = asCta(home?.hero_cta_secundario);
  const diferenciadores = asArray<Diferenciador>(home?.diferenciadores);
  const pasos = asArray<Paso>(home?.pasos_proceso);
  const stats = asArray<{ valor: string; etiqueta: string }>(home?.stats);
  const heroMedia = mediaUrl(home?.hero_media_path);
  const wa = config?.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <>
      {/* S2 — Hero (pantalla completa, detrás del header transparente) */}
      <section className="on-dark relative -mt-16 flex min-h-[100svh] overflow-hidden border-b border-gold/20 bg-ink text-bone md:-mt-20">
        {heroMedia ? (
          <>
            <Image
              src={heroMedia}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25" />
          </>
        ) : null}
        <div className="relative mx-auto flex w-full max-w-5xl flex-col justify-center px-5 py-20 md:px-8">
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
      {stats.length > 0 ? (
        <Section tone="alt" innerClassName="py-10 md:py-12">
          <StatRow className="mx-auto max-w-2xl">
            {stats.map((s) => (
              <Stat
                key={s.etiqueta || s.valor}
                value={s.valor}
                label={s.etiqueta}
              />
            ))}
          </StatRow>
        </Section>
      ) : null}

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

      {/* Catálogo de carpas */}
      <Section tone="alt" id="catalogo">
        <div className="flex flex-col items-center text-center">
          <SectionHeading eyebrow="Catálogo de carpas" className="items-center">
            Una estructura para cada montaje.
          </SectionHeading>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Trabajamos distintos tipos de carpa según el evento, la superficie y
            la imagen que buscas. Te recomendamos la indicada en la visita.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tipos.map((tipo) => {
            const imagen = mediaUrl(tipo.imagen_path);
            const usos = tipo.usos_recomendados ?? [];
            return (
              <div
                key={tipo.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
              >
                {imagen ? (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-bone-dark">
                    <Image
                      src={imagen}
                      alt={tipo.nombre}
                      fill
                      sizes="(min-width: 1024px) 25vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-ink text-gold">
                    <TentIcon name={tipo.slug} className="size-8" />
                  </span>
                )}
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {tipo.nombre}
                </h3>
                {tipo.descripcion ? (
                  <p className="text-sm text-muted-foreground">
                    {tipo.descripcion}
                  </p>
                ) : null}
                {tipo.dimensiones_disponibles ? (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Medidas:
                    </span>{" "}
                    {tipo.dimensiones_disponibles}
                  </p>
                ) : null}
                {usos.length > 0 ? (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {usos.map((u) => (
                      <Badge key={u} variant="outline">
                        {u}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No sabes cuál necesitas? Te asesoramos en terreno antes de cotizar.
          </p>
          <Button asChild variant="outline">
            <Link href="/cotizar">Pide asesoría</Link>
          </Button>
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

      {/* Testimonios */}
      {testimonios.length > 0 ? (
        <Section tone="bone" id="testimonios">
          <SectionHeading eyebrow="Testimonios">
            Lo que dicen quienes ya montaron con nosotros.
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonios.map((t) => (
              <figure
                key={t.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <span
                  aria-hidden
                  className="font-serif text-5xl leading-[0.4] text-gold-deep"
                >
                  &ldquo;
                </span>
                <blockquote className="text-pretty text-foreground/90">
                  {t.texto}
                </blockquote>
                <figcaption className="mt-auto">
                  <div className="font-semibold text-foreground">{t.autor}</div>
                  <div className="text-xs text-muted-foreground">
                    {[t.cargo, t.empresa].filter(Boolean).join(" · ")}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

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
