import { Suspense } from "react";
import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ds";
import { ProjectCard } from "@/components/site/project-card";
import { SegmentFilter } from "@/components/site/segment-filter";
import { getProyectosPublicados } from "@/lib/content/queries";
import { isSegmento } from "@/lib/content/segmento";

export const metadata: Metadata = {
  title: "Trabajos realizados",
  description:
    "Portafolio de eventos sociales, corporativos, públicos e industriales montados por Carpas López.",
};

export default function TrabajosPage({
  searchParams,
}: {
  searchParams: Promise<{ segmento?: string }>;
}) {
  return (
    <Section tone="bone">
      <SectionHeading eyebrow="Portafolio" as="h1">
        Trabajos realizados
      </SectionHeading>
      <p className="mt-4 max-w-prose text-muted-foreground">
        Cada montaje resuelve un contexto distinto. Filtra por segmento para ver
        los que se parecen a tu evento.
      </p>
      <Suspense
        fallback={<p className="mt-10 text-muted-foreground">Cargando…</p>}
      >
        <Listado searchParams={searchParams} />
      </Suspense>
    </Section>
  );
}

async function Listado({
  searchParams,
}: {
  searchParams: Promise<{ segmento?: string }>;
}) {
  const { segmento } = await searchParams;
  const activo = isSegmento(segmento) ? segmento : undefined;
  const proyectos = await getProyectosPublicados(activo);

  return (
    <div className="mt-8 flex flex-col gap-8">
      <SegmentFilter active={activo} />
      {proyectos.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((proyecto) => (
            <ProjectCard key={proyecto.id} proyecto={proyecto} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Aún no hay trabajos publicados en este segmento.
        </p>
      )}
    </div>
  );
}
