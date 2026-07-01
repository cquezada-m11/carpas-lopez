"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SingleImageField } from "@/components/admin/single-image-field";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { SEGMENTOS, segmentoLabel } from "@/lib/content/segmento";
import {
  updateServicio,
  type ServicioFormState,
} from "@/app/admin/servicios/actions";
import type { ServicioRow } from "@/lib/content/admin";

const ESTADOS = ["borrador", "publicado", "archivado"] as const;

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export function ServicioForm({ servicio }: { servicio: ServicioRow }) {
  const [state, formAction, pending] = useActionState<
    ServicioFormState,
    FormData
  >(updateServicio.bind(null, servicio.id), {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error ? (
        <p className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      ) : null}

      <AdminPanel
        eyebrow="Segmento"
        title="Servicio"
        description="Tarjeta que aparece en la sección de segmentos del home."
      >
        <Field label="Título" htmlFor="titulo">
          <Input
            id="titulo"
            name="titulo"
            defaultValue={servicio.titulo}
            required
          />
        </Field>

        <Field label="Descripción" htmlFor="descripcion">
          <Textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            defaultValue={servicio.descripcion}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Segmento asociado" htmlFor="segmento_asociado">
            <Select
              id="segmento_asociado"
              name="segmento_asociado"
              defaultValue={servicio.segmento_asociado ?? ""}
            >
              <option value="">Sin segmento</option>
              {SEGMENTOS.map((s) => (
                <option key={s} value={s}>
                  {segmentoLabel[s]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estado" htmlFor="estado">
            <Select id="estado" name="estado" defaultValue={servicio.estado}>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Orden" htmlFor="orden">
          <Input
            id="orden"
            name="orden"
            type="number"
            min={0}
            defaultValue={servicio.orden}
            className="max-w-32"
          />
        </Field>

        <Field label="Imagen">
          <SingleImageField
            name="imagen_path"
            folder="servicios"
            initialPath={servicio.imagen_path}
          />
        </Field>
      </AdminPanel>

      <AdminSaveBar
        ok={state.ok}
        pending={pending}
        label="Datos del servicio."
      />
    </form>
  );
}
