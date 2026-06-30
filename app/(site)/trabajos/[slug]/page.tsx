import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, OrnamentDivider } from "@/components/ds";
import { ProjectCard } from "@/components/site/project-card";
import {
  ProjectGallery,
  type GalleryImage,
} from "@/components/site/project-gallery";
import {
  getProyectoPorSlug,
  getProyectosRelacionados,
  getSlugsPublicados,
  type Proyecto,
} from "@/lib/content/queries";
import { coverUrl, galeriaItems, mediaUrl } from "@/lib/content/media";
import { segmentoLabel } from "@/lib/content/segmento";
import { formatFechaLarga } from "@/lib/content/format";

export async function generateStaticParams() {
  const slugs = await getSlugsPublicados();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = await getProyectoPorSlug(slug);
  if (!proyecto) return { title: "Trabajo no encontrado" };

  const cover = coverUrl(proyecto);
  const descripcion =
    proyecto.descripcion ??
    `${segmentoLabel[proyecto.segmento]} en Carpas López` +
      (proyecto.ubicacion ? ` · ${proyecto.ubicacion}` : "");

  return {
    title: proyecto.titulo,
    description: descripcion,
    openGraph: {
      title: proyecto.titulo,
      description: descripcion,
      images: cover ? [{ url: cover }] : undefined,
    },
  };
}

/** Ficha técnica: solo campos poblados (RF-13). */
function fichaTecnica(p: Proyecto): { label: string; value: string }[] {
  const filas: { label: string; value: string | null }[] = [
    { label: "Segmento", value: segmentoLabel[p.segmento] },
    { label: "Tipo de evento", value: p.tipo_evento },
    { label: "Ubicación", value: p.ubicacion },
    {
      label: "Capacidad",
      value: p.capacidad_personas ? `${p.capacidad_personas} personas` : null,
    },
    {
      label: "Superficie",
      value: p.dimensiones_m2 ? `${p.dimensiones_m2} m²` : null,
    },
    { label: "Tipo de carpa", value: p.tipo_carpa },
    { label: "Anclaje", value: p.tipo_anclaje },
    { label: "Cliente", value: p.cliente },
    { label: "Fecha", value: formatFechaLarga(p.fecha) },
  ];
  return filas.filter((f): f is { label: string; value: string } =>
    Boolean(f.value),
  );
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = await getProyectoPorSlug(slug);
  if (!proyecto) notFound();

  const portadaUrl = coverUrl(proyecto);
  const galleryImages: GalleryImage[] = galeriaItems(proyecto.galeria)
    .map((g) => ({
      url: mediaUrl(g.path) ?? "",
      alt: g.alt ?? proyecto.titulo,
    }))
    .filter((x) => x.url !== "");
  // La portada elegida va primero.
  if (portadaUrl) {
    const idx = galleryImages.findIndex((x) => x.url === portadaUrl);
    if (idx > 0) {
      const [p] = galleryImages.splice(idx, 1);
      galleryImages.unshift(p);
    }
  }
  const ficha = fichaTecnica(proyecto);
  const relacionados = await getProyectosRelacionados(
    proyecto.segmento,
    proyecto.id,
  );

  return (
    <>
      <Section tone="bone" innerClassName="py-12 md:py-16">
        <Link
          href="/trabajos"
          className="font-mono text-eyebrow uppercase text-gold-deep hover:text-gold"
        >
          ← Trabajos
        </Link>

        <div className="mt-5 flex flex-col gap-3">
          <Badge className="w-fit">{segmentoLabel[proyecto.segmento]}</Badge>
          <h1 className="text-balance font-serif text-heading-lg font-bold">
            {proyecto.titulo}
          </h1>
          {proyecto.ubicacion ? (
            <p className="text-muted-foreground">{proyecto.ubicacion}</p>
          ) : null}
        </div>

        {/* Galería con lightbox */}
        <div className="mt-8">
          {galleryImages.length > 0 ? (
            <ProjectGallery images={galleryImages} />
          ) : (
            <div className="relative aspect-[16/9] overflow-hidden rounded bg-bone-dark">
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-gold-deep/60">
                <span className="size-3 rotate-45 bg-gold/70" />
                <span className="font-mono text-eyebrow uppercase">
                  Galería en preparación
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Cuerpo: descripción + ficha técnica */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_18rem]">
          <div className="flex flex-col gap-6">
            {proyecto.descripcion ? (
              <p className="max-w-prose whitespace-pre-line text-lg leading-relaxed text-foreground/90">
                {proyecto.descripcion}
              </p>
            ) : (
              <p className="max-w-prose text-muted-foreground">
                Montaje de {segmentoLabel[proyecto.segmento].toLowerCase()}
                {proyecto.ubicacion ? ` en ${proyecto.ubicacion}` : ""}.
              </p>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded border border-border bg-card p-5 shadow-card">
              <span className="font-mono text-eyebrow uppercase text-gold-deep">
                Ficha técnica
              </span>
              <dl className="mt-4 flex flex-col divide-y divide-border">
                {ficha.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4 py-2.5"
                  >
                    <dt className="text-sm text-muted-foreground">{f.label}</dt>
                    <dd className="text-right text-sm font-semibold text-foreground">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <Button asChild size="block" className="mt-5">
                <Link href="/cotizar">Cotizar algo similar</Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {/* Relacionados */}
      {relacionados.length > 0 ? (
        <Section tone="alt">
          <OrnamentDivider className="mx-auto max-w-xs" />
          <SectionHeading eyebrow="También montamos" className="mt-8">
            Otros trabajos {segmentoLabel[proyecto.segmento].toLowerCase()}
          </SectionHeading>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((p) => (
              <ProjectCard key={p.id} proyecto={p} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
