import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listTiposCarpaAdmin } from "@/lib/content/admin";
import { createDraftTipoCarpa } from "./actions";
import { EstadoBadge } from "@/components/admin/estado-badge";
import { Button } from "@/components/ui/button";

export default function TiposCarpaAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-heading-lg font-bold">Tipos de carpa</h1>
        <form action={createDraftTipoCarpa}>
          <Button type="submit">
            <Plus className="size-4" /> Nuevo tipo
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
  const rows = await listTiposCarpaAdmin();

  if (rows.length === 0) {
    return (
      <p className="rounded border border-dashed border-input px-4 py-12 text-center text-muted-foreground">
        Aún no hay tipos de carpa. Crea el primero con “Nuevo tipo”.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded border border-border bg-card shadow-card">
      {rows.map((t) => (
        <li key={t.id}>
          <Link
            href={`/admin/tipos-carpa/${t.id}`}
            className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-foreground/5"
          >
            <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">
              {String(t.orden).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-foreground">
                {t.nombre}
              </span>
              <span className="text-xs text-muted-foreground">
                {t.dimensiones_disponibles ?? "—"}
              </span>
            </div>
            <EstadoBadge estado={t.estado} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
