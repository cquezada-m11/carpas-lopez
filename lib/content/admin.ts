import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type ProyectoRow = Database["public"]["Tables"]["proyectos"]["Row"];

/** Lista todos los proyectos (cualquier estado) para el panel; recientes primero. */
export async function listProyectosAdmin(): Promise<ProyectoRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("proyectos")
    .select("*")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

/** Un proyecto por id (cualquier estado). */
export async function getProyectoAdmin(
  id: string,
): Promise<ProyectoRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("proyectos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

/** Conteos para el dashboard del panel. */
export async function getResumenAdmin() {
  const supabase = await createClient();
  const [proyectos, publicados, servicios, cotizaciones] = await Promise.all([
    supabase.from("proyectos").select("*", { count: "exact", head: true }),
    supabase
      .from("proyectos")
      .select("*", { count: "exact", head: true })
      .eq("estado", "publicado"),
    supabase.from("servicios").select("*", { count: "exact", head: true }),
    supabase.from("cotizaciones").select("*", { count: "exact", head: true }),
  ]);
  return {
    proyectos: proyectos.count ?? 0,
    proyectosPublicados: publicados.count ?? 0,
    servicios: servicios.count ?? 0,
    cotizaciones: cotizaciones.count ?? 0,
  };
}
