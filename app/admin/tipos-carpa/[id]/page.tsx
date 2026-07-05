import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTipoCarpaAdmin } from "@/lib/content/admin";
import { deleteTipoCarpa } from "@/app/admin/tipos-carpa/actions";
import { TipoCarpaForm } from "@/components/admin/tipo-carpa-form";
import { AdminDeleteSection } from "@/components/admin/admin-delete-section";
import { EstadoBadge } from "@/components/admin/estado-badge";

export default function EditarTipoCarpaPage({
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
  const tipo = await getTipoCarpaAdmin(id);
  if (!tipo) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/tipos-carpa"
          className="flex w-fit items-center gap-1.5 font-mono text-eyebrow uppercase text-gold-deep hover:text-gold"
        >
          <ArrowLeft className="size-3.5" /> Tipos de carpa
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-heading-lg font-bold">
            {tipo.nombre}
          </h1>
          <EstadoBadge estado={tipo.estado} />
        </div>
      </div>

      <TipoCarpaForm tipo={tipo} />

      <AdminDeleteSection
        action={deleteTipoCarpa.bind(null, tipo.id)}
        entidad="tipo de carpa"
      />
    </div>
  );
}
