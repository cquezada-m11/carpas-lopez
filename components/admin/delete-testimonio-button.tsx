"use client";

import { Trash2 } from "lucide-react";
import { deleteTestimonio } from "@/app/admin/testimonios/actions";
import { Button } from "@/components/ui/button";

export function DeleteTestimonioButton({ id }: { id: string }) {
  return (
    <form
      action={deleteTestimonio.bind(null, id)}
      onSubmit={(e) => {
        if (!window.confirm("¿Eliminar este testimonio?")) e.preventDefault();
      }}
    >
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="border-destructive/40 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" /> Eliminar testimonio
      </Button>
    </form>
  );
}
