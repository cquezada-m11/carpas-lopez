import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import {
  getPresupuestoConVersion,
  getVersionesPresupuesto,
} from "@/lib/content/presupuestos";
import { softDeletePresupuesto } from "@/app/admin/presupuestos/actions";
import { PresupuestoForm } from "@/components/admin/presupuesto-form";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminDeleteSection } from "@/components/admin/admin-delete-section";
import { formatFechaHora } from "@/lib/content/format";

export default function PresupuestoDetallePage({
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
  const [data, versiones] = await Promise.all([
    getPresupuestoConVersion(id),
    getVersionesPresupuesto(id),
  ]);
  if (!data) notFound();

  const { presupuesto, version, contenido } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/presupuestos"
          className="flex w-fit items-center gap-1.5 font-mono text-eyebrow uppercase text-gold-deep hover:text-gold"
        >
          <ArrowLeft className="size-3.5" /> Presupuestos
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-heading font-bold">
            {presupuesto.numero}
          </h1>
          <span className="rounded-full bg-bone-alt px-2.5 py-0.5 font-mono text-eyebrow uppercase text-gold-deep">
            {presupuesto.estado}
          </span>
          {presupuesto.cotizacion_id ? (
            <Link
              href={`/admin/cotizaciones/${presupuesto.cotizacion_id}`}
              className="text-xs text-gold-deep underline hover:text-gold"
            >
              Ver cotización
            </Link>
          ) : null}
        </div>
      </div>

      <PresupuestoForm
        presupuestoId={presupuesto.id}
        contenido={contenido}
        versionActual={version}
      />

      <AdminPanel
        eyebrow="Historial"
        title="Versiones"
        description="Cada guardado queda registrado. La más reciente es la vigente."
      >
        {versiones.length > 0 ? (
          <ol className="flex flex-col divide-y divide-border">
            {versiones.map((v) => (
              <li
                key={v.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase text-gold-deep">
                  <History className="size-3.5" aria-hidden /> v{v.version}
                </span>
                <span className="text-muted-foreground">
                  {formatFechaHora(v.created_at)} · {v.autor ?? "—"}
                </span>
                {v.nota ? (
                  <span className="text-foreground/90">— {v.nota}</span>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">Sin versiones aún.</p>
        )}
      </AdminPanel>

      <AdminDeleteSection
        action={softDeletePresupuesto.bind(null, presupuesto.id)}
        entidad="presupuesto"
        titulo="Archivar presupuesto"
        descripcion="Lo quitamos del listado. El historial se conserva."
        accionLabel="Archivar"
        confirmLabel="Sí, archivar"
        pendingLabel="Archivando…"
      />
    </div>
  );
}
