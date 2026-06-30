"use client";

import { Trash2 } from "lucide-react";
import { deleteProyecto } from "@/app/admin/proyectos/actions";
import { Button } from "@/components/ui/button";

export function DeleteProyectoButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProyecto.bind(null, id)}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "¿Eliminar este proyecto? Esta acción no se puede deshacer.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="border-destructive/40 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" /> Eliminar proyecto
      </Button>
    </form>
  );
}
