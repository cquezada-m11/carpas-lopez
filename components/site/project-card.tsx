import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { coverUrl } from "@/lib/content/media";
import { segmentoLabel } from "@/lib/content/segmento";
import type { Proyecto } from "@/lib/content/queries";

function ficha(p: Proyecto): string {
  const partes = [
    p.ubicacion,
    p.dimensiones_m2 ? `${p.dimensiones_m2} m²` : null,
    p.capacidad_personas ? `${p.capacidad_personas} pers.` : null,
  ].filter(Boolean);
  return partes.join(" · ");
}

export function ProjectCard({ proyecto }: { proyecto: Proyecto }) {
  const cover = coverUrl(proyecto);
  const detalle = ficha(proyecto);

  return (
    <Link
      href={`/trabajos/${proyecto.slug}`}
      className="group block overflow-hidden rounded border border-border bg-card shadow-card transition-shadow hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bone-dark">
        {cover ? (
          <Image
            src={cover}
            alt={proyecto.titulo}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-gold-deep/60">
            <span className="size-2 rotate-45 bg-gold/70" />
            <span className="font-mono text-eyebrow uppercase">
              Carpas López
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge>{segmentoLabel[proyecto.segmento]}</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-bold leading-snug text-foreground">
          {proyecto.titulo}
        </h3>
        {detalle ? (
          <p className="mt-1 text-sm text-muted-foreground">{detalle}</p>
        ) : null}
      </div>
    </Link>
  );
}
