import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/content/media";
import { segmentoLabel } from "@/lib/content/segmento";
import type { Servicio } from "@/lib/content/queries";

/**
 * Tarjeta de segmento/servicio. Si tiene segmento asociado, enlaza al portafolio
 * filtrado (RF-20). El índice numerado refuerza el patrón del diseño (01, 02…).
 */
export function ServiceCard({
  servicio,
  indice,
}: {
  servicio: Servicio;
  indice: number;
}) {
  const imagen = mediaUrl(servicio.imagen_path);
  const href = servicio.segmento_asociado
    ? `/trabajos?segmento=${servicio.segmento_asociado}`
    : "/trabajos";

  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {imagen ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-bone-dark">
          <Image
            src={imagen}
            alt={servicio.titulo}
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-sm italic text-gold-deep">
          {String(indice).padStart(2, "0")}
        </span>
        <h3 className="font-serif text-lg font-bold leading-snug text-foreground">
          {servicio.titulo}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>
      <span className="mt-auto font-mono text-eyebrow uppercase text-gold-deep">
        {servicio.segmento_asociado
          ? `Ver trabajos · ${segmentoLabel[servicio.segmento_asociado]}`
          : "Ver trabajos"}
      </span>
    </Link>
  );
}
