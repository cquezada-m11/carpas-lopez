import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getServicioAdmin } from "@/lib/content/admin";
import { ServicioForm } from "@/components/admin/servicio-form";
import { DeleteServicioButton } from "@/components/admin/delete-servicio-button";
import { EstadoBadge } from "@/components/admin/estado-badge";

export default function EditarServicioPage({
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
  const servicio = await getServicioAdmin(id);
  if (!servicio) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/servicios"
          className="flex w-fit items-center gap-1.5 font-mono text-eyebrow uppercase text-gold-deep hover:text-gold"
        >
          <ArrowLeft className="size-3.5" /> Servicios
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-heading-lg font-bold">
            {servicio.titulo}
          </h1>
          <EstadoBadge estado={servicio.estado} />
        </div>
      </div>

      <ServicioForm servicio={servicio} />

      <section className="flex flex-col gap-3 border-t border-border pt-6">
        <h2 className="font-serif text-base font-bold">Zona de peligro</h2>
        <DeleteServicioButton id={servicio.id} />
      </section>
    </div>
  );
}
