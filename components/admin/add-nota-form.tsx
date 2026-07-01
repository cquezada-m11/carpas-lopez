"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addNotaCotizacion } from "@/app/admin/cotizaciones/actions";
import { useOverlayPending } from "@/components/site/loading-overlay";

export function AddNotaForm({ cotizacionId }: { cotizacionId: string }) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  useOverlayPending(pending);

  function submit() {
    if (!texto.trim()) return;
    setError(null);
    start(async () => {
      const res = await addNotaCotizacion(cotizacionId, texto);
      if (res.error) setError(res.error);
      else setTexto("");
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        rows={3}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe una nota… (seguimiento, presupuesto, próximos pasos)"
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          Queda registrada con tu nombre y la hora.
        </span>
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={pending || !texto.trim()}
        >
          {pending ? "Agregando…" : "Agregar nota"}
        </Button>
      </div>
    </div>
  );
}
