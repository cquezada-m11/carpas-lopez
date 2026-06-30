import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/** ¿Está configurada la service-role key en el servidor? */
export function hasServiceRole(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Cliente con service-role (omite RLS). SOLO en el servidor y SOLO para
 * operaciones de administración (gestión de usuarios). Nunca exponer la clave.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SERVICE_ROLE_MISSING");
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
