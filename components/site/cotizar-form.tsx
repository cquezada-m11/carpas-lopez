"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SEGMENTOS, segmentoLabel } from "@/lib/content/segmento";
import {
  enviarCotizacion,
  type CotizarState,
} from "@/app/(site)/cotizar/actions";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function CotizarForm({ whatsapp }: { whatsapp: string | null }) {
  const [state, formAction, pending] = useActionState<CotizarState, FormData>(
    enviarCotizacion,
    {},
  );
  const fe = state.fieldErrors ?? {};
  const wa = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : null;

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-4 rounded border border-gold/40 bg-gold/10 p-6">
        <CheckCircle2 className="size-8 text-gold-deep" aria-hidden />
        <h2 className="font-serif text-heading font-bold">
          ¡Recibimos tu solicitud!
        </h2>
        <p className="text-muted-foreground">
          Te contactaremos a la brevedad con una propuesta formal. Si quieres
          adelantar detalles, escríbenos por WhatsApp.
        </p>
        {wa ? (
          <Button asChild variant="gold">
            <Link href={wa} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" /> Escríbenos por WhatsApp
            </Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error ? (
        <p className="flex items-center gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      ) : null}

      {/* Honeypot anti-spam: oculto para humanos */}
      <div aria-hidden className="pointer-events-none absolute left-[-9999px]">
        <label htmlFor="empresa_web">No completar</label>
        <input
          id="empresa_web"
          name="empresa_web"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        label="Tipo de evento"
        htmlFor="tipo_evento"
        error={fe.tipo_evento}
      >
        <Input
          id="tipo_evento"
          name="tipo_evento"
          placeholder="Boda, feria, festival, faena…"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Fecha del evento"
          htmlFor="fecha_evento"
          error={fe.fecha_evento}
        >
          <Input id="fecha_evento" name="fecha_evento" type="date" />
        </Field>
        <Field
          label="N.º de personas"
          htmlFor="numero_personas"
          error={fe.numero_personas}
        >
          <Input
            id="numero_personas"
            name="numero_personas"
            type="number"
            min={1}
            placeholder="120"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Comuna / ubicación"
          htmlFor="ubicacion"
          error={fe.ubicacion}
        >
          <Input id="ubicacion" name="ubicacion" placeholder="Comuna, región" />
        </Field>
        <Field label="Segmento (opcional)" htmlFor="segmento">
          <Select id="segmento" name="segmento" defaultValue="">
            <option value="">Selecciona…</option>
            {SEGMENTOS.map((s) => (
              <option key={s} value={s}>
                {segmentoLabel[s]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tu nombre" htmlFor="nombre" error={fe.nombre}>
          <Input id="nombre" name="nombre" autoComplete="name" />
        </Field>
        <Field label="Correo" htmlFor="email" error={fe.email}>
          <Input id="email" name="email" type="email" autoComplete="email" />
        </Field>
      </div>

      <Field label="Teléfono (opcional)" htmlFor="telefono">
        <Input id="telefono" name="telefono" type="tel" autoComplete="tel" />
      </Field>

      <Field label="Cuéntanos más (opcional)" htmlFor="mensaje">
        <Textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          placeholder="Detalles del montaje, horarios, requerimientos…"
        />
      </Field>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Enviando…" : "Solicitar cotización"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Al enviar aceptas que te contactemos para gestionar tu solicitud.
      </p>
    </form>
  );
}
