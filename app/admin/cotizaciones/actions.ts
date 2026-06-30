"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isEstadoLead } from "@/lib/content/lead-estado";

export async function setEstadoCotizacion(id: string, estado: string) {
  if (!isEstadoLead(estado)) return;
  const supabase = await createClient();
  await supabase.from("cotizaciones").update({ estado }).eq("id", id);
  revalidatePath("/admin/cotizaciones");
}
