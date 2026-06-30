"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SingleImageField } from "@/components/admin/single-image-field";
import { slugify } from "@/lib/content/slug";
import {
  updateTipoCarpa,
  type TipoCarpaFormState,
} from "@/app/admin/tipos-carpa/actions";
import type { TipoCarpaRow } from "@/lib/content/admin";

const ESTADOS = ["borrador", "publicado", "archivado"] as const;

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function TipoCarpaForm({ tipo }: { tipo: TipoCarpaRow }) {
  const [state, formAction, pending] = useActionState<
    TipoCarpaFormState,
    FormData
  >(updateTipoCarpa.bind(null, tipo.id), {});
  const [nombre, setNombre] = useState(tipo.nombre);
  const [slug, setSlug] = useState(tipo.slug);

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

      <Field label="Nombre" htmlFor="nombre">
        <Input
          id="nombre"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </Field>

      <Field label="Slug" htmlFor="slug">
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
            onClick={() => setSlug(slugify(nombre))}
          >
            Generar
          </Button>
        </div>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Estado" htmlFor="estado">
          <Select id="estado" name="estado" defaultValue={tipo.estado}>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Orden" htmlFor="orden">
          <Input
            id="orden"
            name="orden"
            type="number"
            min={0}
            defaultValue={tipo.orden}
          />
        </Field>
      </div>

      <Field label="Imagen">
        <SingleImageField
          name="imagen_path"
          folder="tipos"
          initialPath={tipo.imagen_path}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Dimensiones disponibles"
          htmlFor="dimensiones_disponibles"
        >
          <Input
            id="dimensiones_disponibles"
            name="dimensiones_disponibles"
            defaultValue={tipo.dimensiones_disponibles ?? ""}
            placeholder="3×3 hasta 10×30 m"
          />
        </Field>
        <Field label="Capacidad referencial" htmlFor="capacidad_referencial">
          <Input
            id="capacidad_referencial"
            name="capacidad_referencial"
            defaultValue={tipo.capacidad_referencial ?? ""}
            placeholder="≈ 1 persona por m²"
          />
        </Field>
      </div>

      <Field label="Material de la lona" htmlFor="material_lona">
        <Input
          id="material_lona"
          name="material_lona"
          defaultValue={tipo.material_lona ?? ""}
          placeholder="PVC cristal, lona ignífuga…"
        />
      </Field>

      <Field
        label="Usos recomendados"
        htmlFor="usos_recomendados"
        hint="Separados por coma o salto de línea."
      >
        <Textarea
          id="usos_recomendados"
          name="usos_recomendados"
          rows={2}
          defaultValue={(tipo.usos_recomendados ?? []).join(", ")}
        />
      </Field>

      <Field label="Descripción" htmlFor="descripcion">
        <Textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          defaultValue={tipo.descripcion ?? ""}
        />
      </Field>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
