import { Suspense } from "react";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { listProyectosAdmin } from "@/lib/content/admin";
import { createDraftProyecto } from "./actions";
import { EstadoBadge } from "@/components/admin/estado-badge";
import { Button } from "@/components/ui/button";
import { segmentoLabel } from "@/lib/content/segmento";

export default function ProyectosAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-heading-lg font-bold">Proyectos</h1>
        <form action={createDraftProyecto}>
          <Button type="submit">
            <Plus className="size-4" /> Nuevo proyecto
          </Button>
        </form>
      </div>

      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Tabla />
      </Suspense>
    </div>
  );
}

async function Tabla() {
  const rows = await listProyectosAdmin();

  if (rows.length === 0) {
    return (
      <p className="rounded border border-dashed border-input px-4 py-12 text-center text-muted-foreground">
        Aún no hay proyectos. Crea el primero con “Nuevo proyecto”.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded border border-border bg-card shadow-card">
      {rows.map((p) => (
        <li key={p.id}>
          <Link
            href={`/admin/proyectos/${p.id}`}
            className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-foreground/5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold text-foreground">
                  {p.titulo}
                </span>
                {p.destacado ? (
                  <Star
                    className="size-3.5 shrink-0 text-gold"
                    aria-label="Destacado"
                  />
                ) : null}
              </div>
              <div className="text-xs text-muted-foreground">
                {segmentoLabel[p.segmento]} · /{p.slug}
              </div>
            </div>
            <EstadoBadge estado={p.estado} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
