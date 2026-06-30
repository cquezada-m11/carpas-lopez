import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProyectoAdmin } from "@/lib/content/admin";
import { galeriaItems } from "@/lib/content/media";
import { ProyectoForm } from "@/components/admin/proyecto-form";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { DeleteProyectoButton } from "@/components/admin/delete-proyecto-button";
import { EstadoBadge } from "@/components/admin/estado-badge";

export default function EditarProyectoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proyecto = await getProyectoAdmin(id);
  if (!proyecto) notFound();

  const galeria = galeriaItems(proyecto.galeria);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/proyectos"
          className="flex w-fit items-center gap-1.5 font-mono text-eyebrow uppercase text-gold-deep hover:text-gold"
        >
          <ArrowLeft className="size-3.5" /> Proyectos
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-heading-lg font-bold">
            {proyecto.titulo}
          </h1>
          <EstadoBadge estado={proyecto.estado} />
          {proyecto.estado === "publicado" ? (
            <Link
              href={`/trabajos/${proyecto.slug}`}
              target="_blank"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Ver en el sitio ↗
            </Link>
          ) : null}
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-serif text-heading font-bold">Galería</h2>
          <p className="text-sm text-muted-foreground">
            Arrastra para reordenar. La portada se usa en las tarjetas; si no
            eliges una, se usa la primera.
          </p>
        </div>
        <GalleryManager
          proyectoId={proyecto.id}
          initial={galeria}
          initialPortada={proyecto.imagen_portada_path}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-heading font-bold">
          Datos del proyecto
        </h2>
        <ProyectoForm proyecto={proyecto} />
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-6">
        <h2 className="font-serif text-base font-bold">Zona de peligro</h2>
        <DeleteProyectoButton id={proyecto.id} />
      </section>
    </div>
  );
}
