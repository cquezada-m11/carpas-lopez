import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cliente Supabase anónimo (sin cookies) para lecturas públicas del sitio.
 * No lee la sesión, así que las consultas son cacheables (`"use cache"`) y no
 * fuerzan render dinámico. RLS restringe el acceso a contenido `publicado`.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}
