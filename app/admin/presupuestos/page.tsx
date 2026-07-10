import { Suspense } from "react";
import Link from "next/link";
import { Plus, User } from "lucide-react";
import { listPresupuestos } from "@/lib/content/presupuestos";
import { crearPresupuestoEnBlanco } from "@/app/admin/presupuestos/actions";
import { formatCLP } from "@/lib/content/presupuesto";
import { formatFechaCorta } from "@/lib/content/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ESTADO_STYLES: Record<string, string> = {
  borrador: "bg-bone-dark text-muted-foreground",
  emitido: "bg-gold text-ink-deep",
  aceptado: "bg-gold/15 text-gold-deep",
  rechazado: "border border-input text-muted-foreground",
};

function EstadoPill({ estado }: { estado: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
        ESTADO_STYLES[estado] ?? "bg-bone-dark text-muted-foreground",
      )}
    >
      {estado}
    </span>
  );
}

export default function PresupuestosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-heading-lg font-bold">Presupuestos</h1>
          <p className="mt-2 text-muted-foreground">
            Documentos de precios. Cada guardado crea una versión nueva
            (historial).
          </p>
        </div>
        <form action={crearPresupuestoEnBlanco}>
          <Button type="submit">
            <Plus className="size-4" /> Nuevo presupuesto
          </Button>
        </form>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Lista />
      </Suspense>
    </div>
  );
}

async function Lista() {
  const rows = await listPresupuestos();

  if (rows.length === 0) {
    return (
      <p className="rounded border border-dashed border-input px-4 py-12 text-center text-muted-foreground">
        Aún no hay presupuestos. Crea el primero o emite uno desde una
        cotización.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {rows.map((p) => (
        <li key={p.id}>
          <Link
            href={`/admin/presupuestos/${p.id}`}
            className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-foreground/5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {p.numero}
                </span>
                {p.cotizacion_id ? (
                  <span className="rounded-full bg-bone-alt px-2 py-0.5 font-mono text-[10px] uppercase text-gold-deep">
                    desde cotización
                  </span>
                ) : null}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <User className="size-3" aria-hidden />
                  {p.clienteNombre}
                </span>
                <span>{formatFechaCorta(p.created_at.slice(0, 10))}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="font-serif text-sm font-bold text-foreground">
                {formatCLP(p.total)}
              </span>
              <EstadoPill estado={p.estado} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
