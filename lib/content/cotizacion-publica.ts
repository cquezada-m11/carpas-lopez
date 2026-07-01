import "server-only";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

export type CotizacionPublica = {
  nombre: string;
  tipo_evento: string | null;
  fecha_evento: string | null;
  fecha_rango: string | null;
  ubicacion: string | null;
  numero_personas: number | null;
  segmento: string | null;
  mensaje: string | null;
  estado: string;
  created_at: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Detalle público de una cotización, buscado por su `token` no adivinable.
 * Usa service-role (omite RLS) porque el visitante anónimo no puede leer la
 * tabla; la consulta se acota al token y a campos seguros (sin email/teléfono).
 */
export async function getCotizacionPublica(
  token: string,
): Promise<CotizacionPublica | null> {
  if (!UUID_RE.test(token) || !hasServiceRole()) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("cotizaciones")
    .select(
      "nombre, tipo_evento, fecha_evento, fecha_rango, ubicacion, numero_personas, segmento, mensaje, estado, created_at",
    )
    .eq("token", token)
    .maybeSingle();
  return data;
}
