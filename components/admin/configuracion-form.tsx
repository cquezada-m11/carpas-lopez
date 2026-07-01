"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SingleImageField } from "@/components/admin/single-image-field";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import {
  updateConfiguracion,
  type ConfigFormState,
} from "@/app/admin/general/actions";
import type { ConfiguracionRow } from "@/lib/content/admin";

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

export function ConfiguracionForm({ config }: { config: ConfiguracionRow }) {
  const [state, formAction, pending] = useActionState<
    ConfigFormState,
    FormData
  >(updateConfiguracion, {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error ? (
        <p className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      ) : null}

      <AdminPanel
        eyebrow="Marca"
        title="Identidad"
        description="Nombre y logotipo que se muestran en el header y el footer."
      >
        <Field label="Nombre de la empresa" htmlFor="nombre_empresa">
          <Input
            id="nombre_empresa"
            name="nombre_empresa"
            defaultValue={config.nombre_empresa}
            required
          />
        </Field>
        <Field label="Logo">
          <SingleImageField
            name="logo_path"
            folder="config"
            initialPath={config.logo_path}
          />
        </Field>
      </AdminPanel>

      <AdminPanel
        eyebrow="Datos"
        title="Contacto"
        description="Se usan en el footer, el botón de WhatsApp y el JSON-LD."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Teléfono" htmlFor="telefono">
            <Input
              id="telefono"
              name="telefono"
              defaultValue={config.telefono ?? ""}
            />
          </Field>
          <Field
            label="WhatsApp"
            htmlFor="whatsapp"
            hint="Formato internacional, ej. 56961234567"
          >
            <Input
              id="whatsapp"
              name="whatsapp"
              defaultValue={config.whatsapp ?? ""}
            />
          </Field>
          <Field label="Correo de contacto" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={config.email ?? ""}
            />
          </Field>
          <Field label="Instagram (URL)" htmlFor="instagram">
            <Input
              id="instagram"
              name="instagram"
              defaultValue={config.instagram ?? ""}
            />
          </Field>
        </div>
      </AdminPanel>

      <AdminPanel
        eyebrow="Operación"
        title="Cobertura y leads"
        description="Zonas donde operas, horarios y a dónde llegan las cotizaciones."
      >
        <Field
          label="Comunas / regiones de cobertura"
          htmlFor="comunas_cobertura"
          hint="Separadas por coma o salto de línea."
        >
          <Textarea
            id="comunas_cobertura"
            name="comunas_cobertura"
            rows={2}
            defaultValue={(config.comunas_cobertura ?? []).join(", ")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Horarios" htmlFor="horarios">
            <Input
              id="horarios"
              name="horarios"
              defaultValue={config.horarios ?? ""}
            />
          </Field>
          <Field
            label="Destino de leads (email)"
            htmlFor="destino_leads"
            hint="A dónde llegan las cotizaciones."
          >
            <Input
              id="destino_leads"
              name="destino_leads"
              type="email"
              defaultValue={config.destino_leads ?? ""}
            />
          </Field>
        </div>
      </AdminPanel>

      <AdminSaveBar
        ok={state.ok}
        pending={pending}
        label="Se refleja en header, footer y destino de leads."
      />
    </form>
  );
}
