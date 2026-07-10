import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import {
  contenidoInicial,
  calcularTotales,
  type PresupuestoContenido,
} from "@/lib/content/presupuesto";

export type PresupuestoRow =
  Database["public"]["Tables"]["presupuestos"]["Row"];
export type PresupuestoVersionRow =
  Database["public"]["Tables"]["presupuesto_versiones"]["Row"];

export type PresupuestoListItem = PresupuestoRow & {
  clienteNombre: string;
  total: number;
};

/** Presupuestos (no archivados), recientes primero, con cliente y total de la
 *  última versión. */
export async function listPresupuestos(): Promise<PresupuestoListItem[]> {
  const supabase = await createClient();
  const { data: presus } = await supabase
    .from("presupuestos")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (!presus?.length) return [];

  const { data: versiones } = await supabase
    .from("presupuesto_versiones")
    .select("presupuesto_id, version, contenido")
    .in(
      "presupuesto_id",
      presus.map((p) => p.id),
    )
    .order("version", { ascending: false });

  const ultima = new Map<string, PresupuestoContenido>();
  for (const v of versiones ?? []) {
    if (!ultima.has(v.presupuesto_id)) {
      ultima.set(v.presupuesto_id, v.contenido as PresupuestoContenido);
    }
  }

  return presus.map((p) => {
    const cont = ultima.get(p.id);
    return {
      ...p,
      clienteNombre: cont?.cliente?.nombre || "—",
      total: cont ? calcularTotales(cont).consolidado.total : 0,
    };
  });
}

export type PresupuestoConVersion = {
  presupuesto: PresupuestoRow;
  version: number;
  contenido: PresupuestoContenido;
};

/** Un presupuesto con el contenido de su última versión. */
export async function getPresupuestoConVersion(
  id: string,
): Promise<PresupuestoConVersion | null> {
  const supabase = await createClient();
  const { data: presupuesto } = await supabase
    .from("presupuestos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!presupuesto) return null;

  const { data: v } = await supabase
    .from("presupuesto_versiones")
    .select("version, contenido")
    .eq("presupuesto_id", id)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    presupuesto,
    version: v?.version ?? 0,
    contenido: (v?.contenido as PresupuestoContenido) ?? contenidoInicial(),
  };
}

/** Historial de versiones (recientes primero). */
export async function getVersionesPresupuesto(
  id: string,
): Promise<PresupuestoVersionRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("presupuesto_versiones")
    .select("*")
    .eq("presupuesto_id", id)
    .order("version", { ascending: false });
  return data ?? [];
}
