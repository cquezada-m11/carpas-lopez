"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/content/slug";
import { SEGMENTOS, segmentoLabel } from "@/lib/content/segmento";
import {
  updateProyecto,
  type ProyectoFormState,
} from "@/app/admin/proyectos/actions";
import type { ProyectoRow } from "@/lib/content/admin";

const ESTADOS = ["borrador", "publicado", "archivado"] as const;

function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function ProyectoForm({ proyecto }: { proyecto: ProyectoRow }) {
  const [state, formAction, pending] = useActionState<
    ProyectoFormState,
    FormData
  >(updateProyecto.bind(null, proyecto.id), {});
  const [titulo, setTitulo] = useState(proyecto.titulo);
  const [slug, setSlug] = useState(proyecto.slug);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error ? (
        <p className="flex items-center gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="flex items-center gap-2 rounded-sm border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold-deep">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          Cambios guardados.
        </p>
      ) : null}

      <Field label="Título" htmlFor="titulo">
        <Input
          id="titulo"
          name="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </Field>

      <Field
        label="Slug (URL)"
        htmlFor="slug"
        hint="Se usa en /trabajos/[slug]. Solo minúsculas, números y guiones."
      >
        <div className="flex gap-2">
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSlug(slugify(titulo))}
          >
            Generar
          </Button>
        </div>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Segmento" htmlFor="segmento">
          <Select
            id="segmento"
            name="segmento"
            defaultValue={proyecto.segmento}
          >
            {SEGMENTOS.map((s) => (
              <option key={s} value={s}>
                {segmentoLabel[s]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Estado" htmlFor="estado">
          <Select id="estado" name="estado" defaultValue={proyecto.estado}>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Tipo de evento" htmlFor="tipo_evento">
          <Input
            id="tipo_evento"
            name="tipo_evento"
            defaultValue={proyecto.tipo_evento ?? ""}
            placeholder="Boda, feria, festival…"
          />
        </Field>
        <Field label="Ubicación" htmlFor="ubicacion">
          <Input
            id="ubicacion"
            name="ubicacion"
            defaultValue={proyecto.ubicacion ?? ""}
            placeholder="Comuna / región"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Capacidad (personas)" htmlFor="capacidad_personas">
          <Input
            id="capacidad_personas"
            name="capacidad_personas"
            type="number"
            min={0}
            defaultValue={proyecto.capacidad_personas ?? ""}
          />
        </Field>
        <Field label="Superficie (m²)" htmlFor="dimensiones_m2">
          <Input
            id="dimensiones_m2"
            name="dimensiones_m2"
            type="number"
            min={0}
            defaultValue={proyecto.dimensiones_m2 ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Tipo de carpa" htmlFor="tipo_carpa">
          <Input
            id="tipo_carpa"
            name="tipo_carpa"
            defaultValue={proyecto.tipo_carpa ?? ""}
            placeholder="Transparente, pagoda…"
          />
        </Field>
        <Field label="Anclaje" htmlFor="tipo_anclaje">
          <Input
            id="tipo_anclaje"
            name="tipo_anclaje"
            defaultValue={proyecto.tipo_anclaje ?? ""}
            placeholder="Pasto, cemento, tierra…"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Cliente (opcional)" htmlFor="cliente">
          <Input
            id="cliente"
            name="cliente"
            defaultValue={proyecto.cliente ?? ""}
            placeholder="Solo si autoriza mostrarlo"
          />
        </Field>
        <Field label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            name="fecha"
            type="date"
            defaultValue={proyecto.fecha ?? ""}
          />
        </Field>
      </div>

      <Field label="Descripción" htmlFor="descripcion">
        <Textarea
          id="descripcion"
          name="descripcion"
          rows={5}
          defaultValue={proyecto.descripcion ?? ""}
        />
      </Field>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="destacado"
          defaultChecked={proyecto.destacado}
          className="size-4 accent-gold"
        />
        Destacar en el home (sección de trabajos)
      </label>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
