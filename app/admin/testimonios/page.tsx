import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listTestimoniosAdmin } from "@/lib/content/admin";
import { createDraftTestimonio } from "./actions";
import { EstadoBadge } from "@/components/admin/estado-badge";
import { Button } from "@/components/ui/button";
import { segmentoLabel, isSegmento } from "@/lib/content/segmento";

export default function TestimoniosAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-heading-lg font-bold">Testimonios</h1>
        <form action={createDraftTestimonio}>
          <Button type="submit">
            <Plus className="size-4" /> Nuevo testimonio
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
  const rows = await listTestimoniosAdmin();

  if (rows.length === 0) {
    return (
      <p className="rounded border border-dashed border-input px-4 py-12 text-center text-muted-foreground">
        Aún no hay testimonios. Crea el primero con “Nuevo testimonio”.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded border border-border bg-card shadow-card">
      {rows.map((t) => (
        <li key={t.id}>
          <Link
            href={`/admin/testimonios/${t.id}`}
            className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-foreground/5"
          >
            <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">
              {String(t.orden).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-foreground">
                {t.autor}
              </span>
              <span className="line-clamp-1 text-xs text-muted-foreground">
                {[
                  t.empresa,
                  isSegmento(t.segmento) ? segmentoLabel[t.segmento] : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || t.texto}
              </span>
            </div>
            <EstadoBadge estado={t.estado} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
