import "server-only";
import { cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/supabase/database.types";
import type { Segmento } from "@/lib/content/segmento";

export type Proyecto = Database["public"]["Tables"]["proyectos"]["Row"];
export type Servicio = Database["public"]["Tables"]["servicios"]["Row"];
export type ConfiguracionGlobal =
  Database["public"]["Tables"]["configuracion_global"]["Row"];
export type Home = Database["public"]["Tables"]["home"]["Row"];

/** Tags de caché por entidad; las mutaciones del admin los revalidan. */
export const CONTENT_TAGS = {
  configuracion: "configuracion_global",
  home: "home",
  proyectos: "proyectos",
  servicios: "servicios",
} as const;

export async function getConfiguracion(): Promise<ConfiguracionGlobal | null> {
  "use cache";
  cacheTag(CONTENT_TAGS.configuracion);
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data;
}

export async function getHome(): Promise<Home | null> {
  "use cache";
  cacheTag(CONTENT_TAGS.home);
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("home")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data;
}

export async function getServiciosPublicados(): Promise<Servicio[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.servicios);
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("servicios")
    .select("*")
    .eq("estado", "publicado")
    .order("orden", { ascending: true });
  return data ?? [];
}

/**
 * Proyectos para la sección destacados del home (S4).
 * Precedencia (RF-07/RF-08): selección manual de `Home.proyectos_destacados` →
 * proyectos con `destacado=true` → últimos N publicados por fecha.
 */
export async function getProyectosDestacados(
  destacadosIds: string[] = [],
  limite = 3,
): Promise<Proyecto[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.proyectos);
  const supabase = createPublicClient();

  if (destacadosIds.length > 0) {
    const { data } = await supabase
      .from("proyectos")
      .select("*")
      .eq("estado", "publicado")
      .in("id", destacadosIds);
    const byId = new Map((data ?? []).map((p) => [p.id, p]));
    return destacadosIds
      .map((id) => byId.get(id))
      .filter((p): p is Proyecto => Boolean(p));
  }

  const { data: destacados } = await supabase
    .from("proyectos")
    .select("*")
    .eq("estado", "publicado")
    .eq("destacado", true)
    .order("fecha", { ascending: false, nullsFirst: false })
    .limit(limite);
  if (destacados && destacados.length > 0) return destacados;

  const { data: ultimos } = await supabase
    .from("proyectos")
    .select("*")
    .eq("estado", "publicado")
    .order("fecha", { ascending: false, nullsFirst: false })
    .limit(limite);
  return ultimos ?? [];
}

/** Todos los proyectos publicados; opcionalmente filtrados por segmento (RF-10/11). */
export async function getProyectosPublicados(
  segmento?: Segmento,
): Promise<Proyecto[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.proyectos);
  const supabase = createPublicClient();
  let query = supabase.from("proyectos").select("*").eq("estado", "publicado");
  if (segmento) query = query.eq("segmento", segmento);
  const { data } = await query.order("fecha", {
    ascending: false,
    nullsFirst: false,
  });
  return data ?? [];
}

/** Proyecto publicado por slug; null si no existe o no está publicado. */
export async function getProyectoPorSlug(
  slug: string,
): Promise<Proyecto | null> {
  "use cache";
  cacheTag(CONTENT_TAGS.proyectos);
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("proyectos")
    .select("*")
    .eq("estado", "publicado")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

/** Slugs publicados para `generateStaticParams`. */
export async function getSlugsPublicados(): Promise<string[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.proyectos);
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("proyectos")
    .select("slug")
    .eq("estado", "publicado");
  return (data ?? []).map((row) => row.slug);
}

/** Proyectos del mismo segmento, excluyendo el actual (sugerencias del detalle). */
export async function getProyectosRelacionados(
  segmento: Segmento,
  excluirId: string,
  limite = 3,
): Promise<Proyecto[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.proyectos);
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("proyectos")
    .select("*")
    .eq("estado", "publicado")
    .eq("segmento", segmento)
    .neq("id", excluirId)
    .order("fecha", { ascending: false, nullsFirst: false })
    .limit(limite);
  return data ?? [];
}
