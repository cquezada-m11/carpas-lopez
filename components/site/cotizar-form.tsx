"use client";

import { useActionState, useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

const TIPOS = [
  "Boda",
  "Cumpleaños",
  "Graduación",
  "Corporativo",
  "Feria / Expo",
  "Festival",
  "Municipal",
  "Industrial / Faena",
  "Otro",
];

const FECHAS = [
  "Esta semana",
  "Este mes",
  "Próximo mes",
  "En 2-3 meses",
  "Aún no lo sé",
  "Fecha exacta",
];

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
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

function validar(name: string, value: string): string {
  switch (name) {
    case "tipo_evento":
      return value.trim() ? "" : "Indica el tipo de evento";
    case "fecha_evento":
      return value ? "" : "Indica la fecha del evento";
    case "ubicacion":
      return value.trim().length >= 2 ? "" : "Indica la comuna o ubicación";
    case "numero_personas":
      return Number(value) > 0 ? "" : "Indica el número de personas";
    case "nombre":
      return value.trim().length >= 2 ? "" : "Indica tu nombre";
    case "email":
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? "" : "Revisa el correo";
    default:
      return "";
  }
}

export function CotizarForm({ whatsapp }: { whatsapp: string | null }) {
  const [state, formAction, pending] = useActionState<CotizarState, FormData>(
    enviarCotizacion,
    {},
  );
  const fe = state.fieldErrors ?? {};
  const wa = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : null;

  const [tipo, setTipo] = useState("");
  const [otro, setOtro] = useState("");
  const tipoEvento = tipo === "Otro" ? otro : tipo;

  const [fechaModo, setFechaModo] = useState("");
  const [fechaExacta, setFechaExacta] = useState("");

  // Fecha mínima = hoy (solo en cliente, evita usar Date en el render del servidor).
  const [minFecha, setMinFecha] = useState("");
  useEffect(() => {
    setMinFecha(new Date().toISOString().slice(0, 10));
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    setErrors((p) => ({
      ...p,
      [e.target.name]: validar(e.target.name, e.target.value),
    }));
  const err = (name: string) => errors[name] || fe[name];

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-gold/40 bg-gold/10 p-6">
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
        <p className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
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

      {/* Tipo de evento por chips */}
      <Field label="Tipo de evento" error={err("tipo_evento")}>
        <input type="hidden" name="tipo_evento" value={tipoEvento} />
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTipo(t);
                setErrors((p) => ({
                  ...p,
                  tipo_evento: validar("tipo_evento", t === "Otro" ? otro : t),
                }));
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                tipo === t
                  ? "border-gold bg-gold text-ink-deep"
                  : "border-input text-muted-foreground hover:border-gold/60 hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {tipo === "Otro" ? (
          <Input
            value={otro}
            onChange={(e) => setOtro(e.target.value)}
            placeholder="¿Qué tipo de evento?"
            className="mt-2"
          />
        ) : null}
      </Field>

      {/* Fecha por rango aproximado o exacta */}
      <Field label="Fecha del evento" error={err("fecha_evento")}>
        <input
          type="hidden"
          name="fecha_rango"
          value={fechaModo && fechaModo !== "Fecha exacta" ? fechaModo : ""}
        />
        <div className="flex flex-wrap gap-2">
          {FECHAS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFechaModo(f);
                setErrors((p) => ({
                  ...p,
                  fecha_evento:
                    f === "Fecha exacta" && !fechaExacta
                      ? "Indica la fecha"
                      : "",
                }));
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                fechaModo === f
                  ? "border-gold bg-gold text-ink-deep"
                  : "border-input text-muted-foreground hover:border-gold/60 hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        {fechaModo === "Fecha exacta" ? (
          <Input
            className="mt-2"
            name="fecha_evento"
            type="date"
            min={minFecha || undefined}
            value={fechaExacta}
            onChange={(e) => {
              setFechaExacta(e.target.value);
              setErrors((p) => ({
                ...p,
                fecha_evento: e.target.value ? "" : "Indica la fecha",
              }));
            }}
          />
        ) : null}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="N.º de personas"
          htmlFor="numero_personas"
          error={err("numero_personas")}
        >
          <Input
            id="numero_personas"
            name="numero_personas"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="120"
            onBlur={onBlur}
          />
        </Field>
        <Field
          label="Comuna / ubicación"
          htmlFor="ubicacion"
          error={err("ubicacion")}
        >
          <Input
            id="ubicacion"
            name="ubicacion"
            placeholder="Comuna, región"
            onBlur={onBlur}
          />
        </Field>
      </div>

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

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tu nombre" htmlFor="nombre" error={err("nombre")}>
          <Input
            id="nombre"
            name="nombre"
            autoComplete="name"
            onBlur={onBlur}
          />
        </Field>
        <Field label="Correo" htmlFor="email" error={err("email")}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            onBlur={onBlur}
          />
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
        Consulta nuestra{" "}
        <Link href="/privacidad" className="underline hover:text-gold-deep">
          política de privacidad
        </Link>
        .
      </p>
    </form>
  );
}
