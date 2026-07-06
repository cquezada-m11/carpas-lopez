"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isEstadoLead } from "@/lib/content/lead-estado";

export type NotaState = { ok?: boolean; error?: string };

export async function setEstadoCotizacion(id: string, estado: string) {
  if (!isEstadoLead(estado)) return;
  const supabase = await createClient();
  await supabase.from("cotizaciones").update({ estado }).eq("id", id);
  revalidatePath("/admin/cotizaciones");
  revalidatePath(`/admin/cotizaciones/${id}`);
}

/** Agrega una nota a la bitácora, registrando al autor desde la sesión. */
export async function addNotaCotizacion(
  cotizacionId: string,
  contenido: string,
): Promise<NotaState> {
  const texto = contenido.trim();
  if (texto === "") return { error: "La nota está vacía." };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as { sub?: string; email?: string } | undefined;
  if (!claims?.sub) return { error: "No autorizado." };

  const { error } = await supabase.from("cotizacion_notas").insert({
    cotizacion_id: cotizacionId,
    autor_id: claims.sub,
    autor: claims.email ?? null,
    contenido: texto,
  });
  if (error) return { error: error.message };

  revalidatePath(`/admin/cotizaciones/${cotizacionId}`);
  revalidatePath("/admin/cotizaciones");
  return { ok: true };
}

export async function deleteNotaCotizacion(
  notaId: string,
  cotizacionId: string,
) {
  const supabase = await createClient();
  await supabase.from("cotizacion_notas").delete().eq("id", notaId);
  revalidatePath(`/admin/cotizaciones/${cotizacionId}`);
  revalidatePath("/admin/cotizaciones");
}

/** Soft delete: archiva la cotización (no borra la fila) y vuelve al listado. */
export async function softDeleteCotizacion(id: string) {
  const supabase = await createClient();
  await supabase
    .from("cotizaciones")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/cotizaciones");
  revalidatePath(`/admin/cotizaciones/${id}`);
  redirect("/admin/cotizaciones");
}

/** Restaura una cotización archivada. */
export async function restoreCotizacion(id: string) {
  const supabase = await createClient();
  await supabase.from("cotizaciones").update({ deleted_at: null }).eq("id", id);
  revalidatePath("/admin/cotizaciones");
  revalidatePath(`/admin/cotizaciones/${id}`);
}
