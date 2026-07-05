"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" size="sm" disabled={pending}>
      {pending ? "Eliminando…" : "Sí, eliminar"}
    </Button>
  );
}

/**
 * Bloque de eliminación para las páginas de edición del admin. Confirmación
 * inline en dos pasos (sin `window.confirm`) y estilo destructivo sobrio.
 * Recibe el server action ya enlazado al id.
 */
export function AdminDeleteSection({
  action,
  entidad,
}: {
  action: () => void | Promise<void>;
  entidad: string;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-destructive/20 bg-destructive/[0.04] p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Trash2 className="size-4" aria-hidden />
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 className="font-serif text-base font-bold text-foreground">
            Eliminar {entidad}
          </h2>
          <p className="text-sm text-muted-foreground">
            Se quita de forma permanente. Esta acción no se puede deshacer.
          </p>
        </div>
      </div>

      {confirming ? (
        <form action={action} className="flex items-center gap-2">
          <ConfirmButton />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirming(false)}
          >
            Cancelar
          </Button>
        </form>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => setConfirming(true)}
        >
          <Trash2 className="size-4" /> Eliminar
        </Button>
      )}
    </section>
  );
}
