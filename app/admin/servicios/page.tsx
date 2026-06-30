import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listServiciosAdmin } from "@/lib/content/admin";
import { createDraftServicio } from "./actions";
import { EstadoBadge } from "@/components/admin/estado-badge";
import { Button } from "@/components/ui/button";
import { segmentoLabel } from "@/lib/content/segmento";

export default function ServiciosAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-heading-lg font-bold">Servicios</h1>
        <form action={createDraftServicio}>
          <Button type="submit">
            <Plus className="size-4" /> Nuevo servicio
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
  const rows = await listServiciosAdmin();

  if (rows.length === 0) {
    return (
      <p className="rounded border border-dashed border-input px-4 py-12 text-center text-muted-foreground">
        Aún no hay servicios. Crea el primero con “Nuevo servicio”.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded border border-border bg-card shadow-card">
      {rows.map((s) => (
        <li key={s.id}>
          <Link
            href={`/admin/servicios/${s.id}`}
            className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-foreground/5"
          >
            <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">
              {String(s.orden).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-foreground">
                {s.titulo}
              </span>
              <span className="text-xs text-muted-foreground">
                {s.segmento_asociado
                  ? segmentoLabel[s.segmento_asociado]
                  : "Sin segmento"}
              </span>
            </div>
            <EstadoBadge estado={s.estado} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
