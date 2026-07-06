import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

export type UsuarioAdmin = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignIn: string | null;
  confirmado: boolean;
};

/** Lista los usuarios del proyecto (requiere service-role). */
export async function listUsuariosAdmin(): Promise<UsuarioAdmin[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw error;
  return data.users.map((u) => ({
    id: u.id,
    email: u.email ?? null,
    createdAt: u.created_at,
    lastSignIn: u.last_sign_in_at ?? null,
    confirmado: Boolean(u.email_confirmed_at ?? u.confirmed_at),
  }));
}

export type ProyectoRow = Database["public"]["Tables"]["proyectos"]["Row"];
export type ServicioRow = Database["public"]["Tables"]["servicios"]["Row"];
export type TipoCarpaRow = Database["public"]["Tables"]["tipos_carpa"]["Row"];
export type TestimonioRow = Database["public"]["Tables"]["testimonios"]["Row"];
export type CotizacionRow = Database["public"]["Tables"]["cotizaciones"]["Row"];
export type NotaCotizacionRow =
  Database["public"]["Tables"]["cotizacion_notas"]["Row"];
export type CotizacionListItem = CotizacionRow & { tieneNotas: boolean };
export type ConfiguracionRow =
  Database["public"]["Tables"]["configuracion_global"]["Row"];
export type HomeRow = Database["public"]["Tables"]["home"]["Row"];

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

/** Lista todos los servicios (cualquier estado); por orden. */
export async function listServiciosAdmin(): Promise<ServicioRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("servicios")
    .select("*")
    .order("orden", { ascending: true });
  return data ?? [];
}

export async function getServicioAdmin(
  id: string,
): Promise<ServicioRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("servicios")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

/** Tipos de carpa (cualquier estado), por orden. */
export async function listTiposCarpaAdmin(): Promise<TipoCarpaRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tipos_carpa")
    .select("*")
    .order("orden", { ascending: true });
  return data ?? [];
}

export async function getTipoCarpaAdmin(
  id: string,
): Promise<TipoCarpaRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tipos_carpa")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

/** Testimonios (cualquier estado), por orden. */
export async function listTestimoniosAdmin(): Promise<TestimonioRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonios")
    .select("*")
    .order("orden", { ascending: true });
  return data ?? [];
}

export async function getTestimonioAdmin(
  id: string,
): Promise<TestimonioRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonios")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

/** Configuración global (singleton). */
export async function getConfiguracionAdmin(): Promise<ConfiguracionRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data;
}

/** Proyectos publicados (id + título) para el selector de destacados. */
export async function listProyectosPublicadosMin(): Promise<
  { id: string; titulo: string }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("proyectos")
    .select("id, titulo")
    .eq("estado", "publicado")
    .order("fecha", { ascending: false, nullsFirst: false });
  return data ?? [];
}

/** Contenido del home (singleton). */
export async function getHomeAdmin(): Promise<HomeRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("home")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data;
}

/** Cotizaciones recibidas (admin), recientes primero, con flag de notas.
 *  Por defecto excluye las archivadas (soft delete); `archivadas: true` las
 *  devuelve para la vista de restauración. */
export async function listCotizacionesAdmin(opts?: {
  archivadas?: boolean;
}): Promise<CotizacionListItem[]> {
  const supabase = await createClient();
  const base = supabase
    .from("cotizaciones")
    .select("*")
    .order("created_at", { ascending: false });
  const [rows, notas] = await Promise.all([
    opts?.archivadas
      ? base.not("deleted_at", "is", null)
      : base.is("deleted_at", null),
    supabase.from("cotizacion_notas").select("cotizacion_id"),
  ]);
  const conNotas = new Set((notas.data ?? []).map((n) => n.cotizacion_id));
  return (rows.data ?? []).map((r) => ({
    ...r,
    tieneNotas: conNotas.has(r.id),
  }));
}

/** Cuántas cotizaciones están archivadas (soft-deleted). */
export async function countCotizacionesArchivadas(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("cotizaciones")
    .select("*", { count: "exact", head: true })
    .not("deleted_at", "is", null);
  return count ?? 0;
}

/** Una cotización por id (admin). */
export async function getCotizacionAdmin(
  id: string,
): Promise<CotizacionRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cotizaciones")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

/** Bitácora de notas internas de una cotización, recientes primero. */
export async function getNotasCotizacion(
  cotizacionId: string,
): Promise<NotaCotizacionRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cotizacion_notas")
    .select("*")
    .eq("cotizacion_id", cotizacionId)
    .order("created_at", { ascending: false });
  return data ?? [];
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
    supabase
      .from("cotizaciones")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null),
  ]);
  return {
    proyectos: proyectos.count ?? 0,
    proyectosPublicados: publicados.count ?? 0,
    servicios: servicios.count ?? 0,
    cotizaciones: cotizaciones.count ?? 0,
  };
}
