"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { invitarUsuario, type InviteState } from "@/app/admin/usuarios/actions";

export function InviteUserForm() {
  const [state, action, pending] = useActionState<InviteState, FormData>(
    invitarUsuario,
    {},
  );

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded border border-border bg-card p-5 shadow-card"
    >
      <span className="font-mono text-eyebrow uppercase text-gold-deep">
        Invitar usuario
      </span>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          name="email"
          type="email"
          placeholder="correo@equipo.cl"
          required
          className="flex-1"
        />
        <Button type="submit" disabled={pending}>
          <Send className="size-4" />{" "}
          {pending ? "Enviando…" : "Enviar invitación"}
        </Button>
      </div>
      {state.error ? (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="flex items-center gap-2 text-sm text-gold-deep">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          Invitación enviada a {state.email}.
        </p>
      ) : null}
    </form>
  );
}
