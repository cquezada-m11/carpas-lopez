"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { getCotizacionAdmin } from "@/lib/content/admin";
import {
  contenidoInicial,
  isEstadoPresupuesto,
  type PresupuestoContenido,
} from "@/lib/content/presupuesto";

export type GuardarState = { ok?: boolean; error?: string; version?: number };

async function actor() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as { sub?: string; email?: string } | undefined;
  return { sub: claims?.sub ?? null, email: claims?.email ?? null };
}

/** Crea el presupuesto (cabecera) + su versión 1, y navega a su detalle. */
async function crear(
  cotizacionId: string | null,
  contenido: PresupuestoContenido,
): Promise<never> {
  const supabase = await createClient();
  const { sub, email } = await actor();

  const { data: p, error } = await supabase
    .from("presupuestos")
    .insert({ cotizacion_id: cotizacionId, created_by: sub })
    .select("id")
    .single();
  if (error || !p) throw new Error(error?.message ?? "No se pudo crear");

  await supabase.from("presupuesto_versiones").insert({
    presupuesto_id: p.id,
    version: 1,
    contenido: contenido as unknown as Json,
    autor: email,
    created_by: sub,
  });

  revalidatePath("/admin/presupuestos");
  redirect(`/admin/presupuestos/${p.id}`);
}

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Emitir presupuesto a partir de una cotización (precarga cliente y evento). */
export async function crearDesdeCotizacion(cotizacionId: string) {
  const c = await getCotizacionAdmin(cotizacionId);
  await crear(
    cotizacionId,
    contenidoInicial({
      emision: hoy(),
      evento: c?.fecha_evento ?? "",
      cliente: {
        nombre: c?.nombre ?? "",
        rut: "",
        email: c?.email ?? "",
        telefono: c?.telefono ?? "",
      },
    }),
  );
}

/** Presupuesto en blanco (no ligado a cotización). */
export async function crearPresupuestoEnBlanco() {
  await crear(null, contenidoInicial({ emision: hoy() }));
}

/** Guarda una nueva versión (cada guardado = registro nuevo → historial). */
export async function guardarVersion(
  presupuestoId: string,
  contenido: PresupuestoContenido,
  nota: string,
): Promise<GuardarState> {
  const supabase = await createClient();
  const { sub, email } = await actor();

  const { data: last } = await supabase
    .from("presupuesto_versiones")
    .select("version")
    .eq("presupuesto_id", presupuestoId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const version = (last?.version ?? 0) + 1;

  const { error } = await supabase.from("presupuesto_versiones").insert({
    presupuesto_id: presupuestoId,
    version,
    contenido: contenido as unknown as Json,
    nota: nota.trim() || null,
    autor: email,
    created_by: sub,
  });
  if (error) return { error: error.message };

  revalidatePath(`/admin/presupuestos/${presupuestoId}`);
  revalidatePath("/admin/presupuestos");
  return { ok: true, version };
}

export async function setEstadoPresupuesto(id: string, estado: string) {
  if (!isEstadoPresupuesto(estado)) return;
  const supabase = await createClient();
  await supabase.from("presupuestos").update({ estado }).eq("id", id);
  revalidatePath(`/admin/presupuestos/${id}`);
  revalidatePath("/admin/presupuestos");
}

export async function softDeletePresupuesto(id: string) {
  const supabase = await createClient();
  await supabase
    .from("presupuestos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/presupuestos");
  redirect("/admin/presupuestos");
}
