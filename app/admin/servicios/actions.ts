"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_TAGS } from "@/lib/content/queries";

export type ServicioFormState = { ok?: boolean; error?: string };

function texto(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

const ServicioSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  segmento_asociado: z
    .enum(["social", "corporativo", "publico", "industrial"])
    .nullable(),
  orden: z.coerce.number().int().min(0),
  estado: z.enum(["borrador", "publicado", "archivado"]),
  imagen_path: z.string().nullable(),
});

export async function createDraftServicio() {
  const supabase = await createClient();
  const { data: ultimo } = await supabase
    .from("servicios")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from("servicios")
    .insert({
      titulo: "Nuevo servicio",
      descripcion: "",
      orden: (ultimo?.orden ?? 0) + 1,
      estado: "borrador",
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "No se pudo crear");
  updateTag(CONTENT_TAGS.servicios);
  revalidatePath("/admin/servicios");
  redirect(`/admin/servicios/${data.id}`);
}

export async function updateServicio(
  id: string,
  _prev: ServicioFormState,
  formData: FormData,
): Promise<ServicioFormState> {
  const parsed = ServicioSchema.safeParse({
    titulo: texto(formData.get("titulo")),
    descripcion: texto(formData.get("descripcion")),
    segmento_asociado: texto(formData.get("segmento_asociado")) || null,
    orden: texto(formData.get("orden")) || "0",
    estado: formData.get("estado"),
    imagen_path: texto(formData.get("imagen_path")) || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();

  // Imagen anterior, para limpiarla de Storage si fue reemplazada.
  const { data: previo } = await supabase
    .from("servicios")
    .select("imagen_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("servicios")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { error: error.message };

  if (previo?.imagen_path && previo.imagen_path !== parsed.data.imagen_path) {
    await supabase.storage.from("medios").remove([previo.imagen_path]);
  }

  updateTag(CONTENT_TAGS.servicios);
  revalidatePath("/admin/servicios");
  revalidatePath(`/admin/servicios/${id}`);
  return { ok: true };
}

export async function deleteServicio(id: string) {
  const supabase = await createClient();

  const { data: previo } = await supabase
    .from("servicios")
    .select("imagen_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("servicios").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (previo?.imagen_path) {
    await supabase.storage.from("medios").remove([previo.imagen_path]);
  }

  updateTag(CONTENT_TAGS.servicios);
  revalidatePath("/admin/servicios");
  redirect("/admin/servicios");
}
