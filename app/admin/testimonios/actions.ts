"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_TAGS } from "@/lib/content/queries";

export type TestimonioFormState = { ok?: boolean; error?: string };

function texto(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

const TestimonioSchema = z.object({
  autor: z.string().min(1, "El autor es obligatorio"),
  cargo: z.string().nullable(),
  empresa: z.string().nullable(),
  texto: z.string().min(1, "El testimonio es obligatorio"),
  segmento: z
    .enum(["social", "corporativo", "publico", "industrial"])
    .nullable(),
  orden: z.coerce.number().int().min(0),
  estado: z.enum(["borrador", "publicado", "archivado"]),
});

export async function createDraftTestimonio() {
  const supabase = await createClient();
  const { data: ultimo } = await supabase
    .from("testimonios")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from("testimonios")
    .insert({
      autor: "Nuevo testimonio",
      texto: "",
      orden: (ultimo?.orden ?? 0) + 1,
      estado: "borrador",
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "No se pudo crear");
  updateTag(CONTENT_TAGS.testimonios);
  revalidatePath("/admin/testimonios");
  redirect(`/admin/testimonios/${data.id}`);
}

export async function updateTestimonio(
  id: string,
  _prev: TestimonioFormState,
  formData: FormData,
): Promise<TestimonioFormState> {
  const parsed = TestimonioSchema.safeParse({
    autor: texto(formData.get("autor")),
    cargo: texto(formData.get("cargo")) || null,
    empresa: texto(formData.get("empresa")) || null,
    texto: texto(formData.get("texto")),
    segmento: texto(formData.get("segmento")) || null,
    orden: texto(formData.get("orden")) || "0",
    estado: formData.get("estado"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonios")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { error: error.message };

  updateTag(CONTENT_TAGS.testimonios);
  revalidatePath("/admin/testimonios");
  revalidatePath(`/admin/testimonios/${id}`);
  return { ok: true };
}

export async function deleteTestimonio(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonios").delete().eq("id", id);
  if (error) throw new Error(error.message);
  updateTag(CONTENT_TAGS.testimonios);
  revalidatePath("/admin/testimonios");
  redirect("/admin/testimonios");
}
