"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_TAGS } from "@/lib/content/queries";

export type HomeFormState = { ok?: boolean; error?: string };

const Cta = z.object({ texto: z.string(), destino: z.string() });

const HomeSchema = z.object({
  hero_titulo: z.string().min(1, "El titular del hero es obligatorio"),
  hero_bajada: z.string(),
  hero_cta_primario: Cta,
  hero_cta_secundario: Cta,
  diferenciadores: z.array(
    z.object({
      icono: z.string(),
      titulo: z.string().min(1, "Cada diferenciador necesita título"),
      texto: z.string(),
    }),
  ),
  pasos_proceso: z.array(
    z.object({
      numero: z.string(),
      titulo: z.string().min(1, "Cada paso necesita título"),
      texto: z.string(),
    }),
  ),
});

export type HomePayload = z.infer<typeof HomeSchema>;

export async function guardarHome(payload: unknown): Promise<HomeFormState> {
  const parsed = HomeSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("home").update(parsed.data).eq("id", 1);
  if (error) return { error: error.message };

  updateTag(CONTENT_TAGS.home);
  revalidatePath("/admin/home");
  return { ok: true };
}
