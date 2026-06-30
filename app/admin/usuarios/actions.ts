"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/site";

export type InviteState = { ok?: boolean; error?: string; email?: string };

/** Verifica que quien invoca la acción tenga sesión (la service-role omite RLS). */
async function requireAuth(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) throw new Error("No autorizado");
  return String((data.claims as { sub?: string }).sub ?? "");
}

export async function invitarUsuario(
  _prev: InviteState,
  formData: FormData,
): Promise<InviteState> {
  await requireAuth();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!z.string().email().safeParse(email).success) {
    return { error: "Ingresa un correo válido." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error:
        "Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor para enviar invitaciones.",
    };
  }

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl()}/auth/update-password`,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  return { ok: true, email };
}

export async function eliminarUsuario(id: string) {
  const actorId = await requireAuth();
  if (id === actorId) return; // no permitir auto-eliminación
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(id);
  revalidatePath("/admin/usuarios");
}
