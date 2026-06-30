"use client";

import { Trash2 } from "lucide-react";
import { deleteTipoCarpa } from "@/app/admin/tipos-carpa/actions";
import { Button } from "@/components/ui/button";

export function DeleteTipoCarpaButton({ id }: { id: string }) {
  return (
    <form
      action={deleteTipoCarpa.bind(null, id)}
      onSubmit={(e) => {
        if (!window.confirm("¿Eliminar este tipo de carpa?"))
          e.preventDefault();
      }}
    >
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="border-destructive/40 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" /> Eliminar tipo
      </Button>
    </form>
  );
}
