"use client";

import { Trash2 } from "lucide-react";
import { deleteServicio } from "@/app/admin/servicios/actions";
import { Button } from "@/components/ui/button";

export function DeleteServicioButton({ id }: { id: string }) {
  return (
    <form
      action={deleteServicio.bind(null, id)}
      onSubmit={(e) => {
        if (!window.confirm("¿Eliminar este servicio?")) e.preventDefault();
      }}
    >
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="border-destructive/40 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" /> Eliminar servicio
      </Button>
    </form>
  );
}
