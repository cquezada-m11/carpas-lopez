"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { SEGMENTOS, segmentoLabel } from "@/lib/content/segmento";
import {
  updateTestimonio,
  type TestimonioFormState,
} from "@/app/admin/testimonios/actions";
import type { TestimonioRow } from "@/lib/content/admin";

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

export function TestimonioForm({ testimonio }: { testimonio: TestimonioRow }) {
  const [state, formAction, pending] = useActionState<
    TestimonioFormState,
    FormData
  >(updateTestimonio.bind(null, testimonio.id), {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error ? (
        <p className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      ) : null}

      <AdminPanel
        eyebrow="Prueba social"
        title="Testimonio"
        description="Cita de un cliente para la sección de testimonios del home."
      >
        <Field label="Testimonio" htmlFor="texto">
          <Textarea
            id="texto"
            name="texto"
            rows={4}
            defaultValue={testimonio.texto}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Autor" htmlFor="autor">
            <Input
              id="autor"
              name="autor"
              defaultValue={testimonio.autor}
              required
            />
          </Field>
          <Field label="Cargo" htmlFor="cargo">
            <Input
              id="cargo"
              name="cargo"
              defaultValue={testimonio.cargo ?? ""}
              placeholder="Productora, novios, encargado…"
            />
          </Field>
          <Field label="Empresa / organización" htmlFor="empresa">
            <Input
              id="empresa"
              name="empresa"
              defaultValue={testimonio.empresa ?? ""}
            />
          </Field>
          <Field label="Segmento" htmlFor="segmento">
            <Select
              id="segmento"
              name="segmento"
              defaultValue={testimonio.segmento ?? ""}
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
            <Select id="estado" name="estado" defaultValue={testimonio.estado}>
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
              defaultValue={testimonio.orden}
            />
          </Field>
        </div>
      </AdminPanel>

      <AdminSaveBar
        ok={state.ok}
        pending={pending}
        label="Datos del testimonio."
      />
    </form>
  );
}
