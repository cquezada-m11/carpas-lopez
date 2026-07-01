"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isEstadoLead } from "@/lib/content/lead-estado";

export type NotasState = { ok?: boolean; error?: string };

export async function setEstadoCotizacion(id: string, estado: string) {
  if (!isEstadoLead(estado)) return;
  const supabase = await createClient();
  await supabase.from("cotizaciones").update({ estado }).eq("id", id);
  revalidatePath("/admin/cotizaciones");
  revalidatePath(`/admin/cotizaciones/${id}`);
}

export async function saveNotasCotizacion(
  id: string,
  notas: string,
): Promise<NotasState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cotizaciones")
    .update({ notas: notas.trim() === "" ? null : notas })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/cotizaciones/${id}`);
  return { ok: true };
}
