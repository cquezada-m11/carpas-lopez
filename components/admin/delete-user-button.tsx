"use client";

import { Trash2 } from "lucide-react";
import { eliminarUsuario } from "@/app/admin/usuarios/actions";
import { Button } from "@/components/ui/button";

export function DeleteUserButton({
  id,
  email,
}: {
  id: string;
  email: string | null;
}) {
  return (
    <form
      action={eliminarUsuario.bind(null, id)}
      onSubmit={(e) => {
        if (
          !window.confirm(`¿Quitar el acceso de ${email ?? "este usuario"}?`)
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" /> Quitar
      </Button>
    </form>
  );
}
