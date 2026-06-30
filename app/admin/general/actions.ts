"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_TAGS } from "@/lib/content/queries";

export type ConfigFormState = { ok?: boolean; error?: string };

function str(formData: FormData, k: string): string {
  const v = formData.get(k);
  return typeof v === "string" ? v.trim() : "";
}
function opt(formData: FormData, k: string): string | null {
  return str(formData, k) || null;
}

const ConfigSchema = z.object({
  nombre_empresa: z.string().min(1, "El nombre de la empresa es obligatorio"),
  telefono: z.string().nullable(),
  whatsapp: z.string().nullable(),
  email: z.string().email("Revisa el correo de contacto").nullable(),
  instagram: z.string().nullable(),
  horarios: z.string().nullable(),
  destino_leads: z
    .string()
    .email("El destino de leads debe ser un email")
    .nullable(),
  logo_path: z.string().nullable(),
  comunas_cobertura: z.array(z.string()),
});

export async function updateConfiguracion(
  _prev: ConfigFormState,
  formData: FormData,
): Promise<ConfigFormState> {
  const comunas = str(formData, "comunas_cobertura")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const parsed = ConfigSchema.safeParse({
    nombre_empresa: str(formData, "nombre_empresa"),
    telefono: opt(formData, "telefono"),
    whatsapp: opt(formData, "whatsapp"),
    email: opt(formData, "email"),
    instagram: opt(formData, "instagram"),
    horarios: opt(formData, "horarios"),
    destino_leads: opt(formData, "destino_leads"),
    logo_path: opt(formData, "logo_path"),
    comunas_cobertura: comunas,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("configuracion_global")
    .update(parsed.data)
    .eq("id", 1);
  if (error) return { error: error.message };

  // Invalida header, footer y JSON-LD (todos leen configuracion_global).
  updateTag(CONTENT_TAGS.configuracion);
  revalidatePath("/admin/general");
  return { ok: true };
}
