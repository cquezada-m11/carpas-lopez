"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveNotasCotizacion } from "@/app/admin/cotizaciones/actions";
import { useOverlayPending } from "@/components/site/loading-overlay";

export function NotasCotizacion({
  id,
  initial,
}: {
  id: string;
  initial: string | null;
}) {
  const [notas, setNotas] = useState(initial ?? "");
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();
  useOverlayPending(pending);

  function save() {
    setOk(false);
    start(async () => {
      const res = await saveNotasCotizacion(id, notas);
      if (res.ok) setOk(true);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        rows={5}
        value={notas}
        onChange={(e) => {
          setNotas(e.target.value);
          setOk(false);
        }}
        placeholder="Notas internas: seguimiento, presupuesto enviado, próximos pasos…"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          {ok ? (
            <>
              <CheckCircle2 className="size-3.5 text-gold-deep" aria-hidden />
              Notas guardadas.
            </>
          ) : (
            "Solo visibles para el equipo."
          )}
        </span>
        <Button type="button" size="sm" onClick={save} disabled={pending}>
          {pending ? "Guardando…" : "Guardar notas"}
        </Button>
      </div>
    </div>
  );
}
