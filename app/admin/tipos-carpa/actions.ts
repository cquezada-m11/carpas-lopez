"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_TAGS } from "@/lib/content/queries";
import { slugify } from "@/lib/content/slug";

export type TipoCarpaFormState = { ok?: boolean; error?: string };

function texto(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

const TipoCarpaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "El slug solo admite minúsculas, números y guiones"),
  imagen_path: z.string().nullable(),
  dimensiones_disponibles: z.string().nullable(),
  capacidad_referencial: z.string().nullable(),
  material_lona: z.string().nullable(),
  usos_recomendados: z.array(z.string()),
  descripcion: z.string().nullable(),
  orden: z.coerce.number().int().min(0),
  estado: z.enum(["borrador", "publicado", "archivado"]),
});

export async function createDraftTipoCarpa() {
  const supabase = await createClient();
  const { data: ultimo } = await supabase
    .from("tipos_carpa")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from("tipos_carpa")
    .insert({
      nombre: "Nuevo tipo",
      slug: `tipo-${Date.now().toString(36)}`,
      orden: (ultimo?.orden ?? 0) + 1,
      estado: "borrador",
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "No se pudo crear");
  updateTag(CONTENT_TAGS.tipos);
  revalidatePath("/admin/tipos-carpa");
  redirect(`/admin/tipos-carpa/${data.id}`);
}

export async function updateTipoCarpa(
  id: string,
  _prev: TipoCarpaFormState,
  formData: FormData,
): Promise<TipoCarpaFormState> {
  const nombre = texto(formData.get("nombre"));
  const usos = texto(formData.get("usos_recomendados"))
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const parsed = TipoCarpaSchema.safeParse({
    nombre,
    slug: texto(formData.get("slug")) || slugify(nombre),
    imagen_path: texto(formData.get("imagen_path")) || null,
    dimensiones_disponibles:
      texto(formData.get("dimensiones_disponibles")) || null,
    capacidad_referencial: texto(formData.get("capacidad_referencial")) || null,
    material_lona: texto(formData.get("material_lona")) || null,
    usos_recomendados: usos,
    descripcion: texto(formData.get("descripcion")) || null,
    orden: texto(formData.get("orden")) || "0",
    estado: formData.get("estado"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { data: previo } = await supabase
    .from("tipos_carpa")
    .select("imagen_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("tipos_carpa")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Ese slug ya está en uso por otro tipo."
          : error.message,
    };
  }

  if (previo?.imagen_path && previo.imagen_path !== parsed.data.imagen_path) {
    await supabase.storage.from("medios").remove([previo.imagen_path]);
  }

  updateTag(CONTENT_TAGS.tipos);
  revalidatePath("/admin/tipos-carpa");
  revalidatePath(`/admin/tipos-carpa/${id}`);
  return { ok: true };
}

export async function deleteTipoCarpa(id: string) {
  const supabase = await createClient();
  const { data: previo } = await supabase
    .from("tipos_carpa")
    .select("imagen_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("tipos_carpa").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (previo?.imagen_path) {
    await supabase.storage.from("medios").remove([previo.imagen_path]);
  }

  updateTag(CONTENT_TAGS.tipos);
  revalidatePath("/admin/tipos-carpa");
  redirect("/admin/tipos-carpa");
}
