"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_TAGS } from "@/lib/content/queries";
import { slugify } from "@/lib/content/slug";
import type { GalleryItem } from "@/lib/content/media";

export type ProyectoFormState = { ok?: boolean; error?: string };

function texto(value: FormDataEntryValue | null): string | null {
  const s = typeof value === "string" ? value.trim() : "";
  return s === "" ? null : s;
}

function entero(value: FormDataEntryValue | null): number | null {
  const s = texto(value);
  if (s === null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

const ProyectoSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "El slug solo admite minúsculas, números y guiones"),
  segmento: z.enum(["social", "corporativo", "publico", "industrial"]),
  estado: z.enum(["borrador", "publicado", "archivado"]),
  tipo_evento: z.string().nullable(),
  ubicacion: z.string().nullable(),
  capacidad_personas: z
    .number()
    .int()
    .positive("La capacidad debe ser positiva")
    .nullable(),
  dimensiones_m2: z
    .number()
    .int()
    .positive("La superficie debe ser positiva")
    .nullable(),
  tipo_carpa: z.string().nullable(),
  tipo_anclaje: z.string().nullable(),
  cliente: z.string().nullable(),
  descripcion: z.string().nullable(),
  destacado: z.boolean(),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida")
    .nullable(),
});

/** Crea un borrador vacío y redirige a su edición. */
export async function createDraftProyecto() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("proyectos")
    .insert({
      titulo: "Proyecto sin título",
      slug: `proyecto-${Date.now().toString(36)}`,
      segmento: "social",
      estado: "borrador",
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "No se pudo crear");
  updateTag(CONTENT_TAGS.proyectos);
  revalidatePath("/admin/proyectos");
  redirect(`/admin/proyectos/${data.id}`);
}

/** Actualiza todos los campos de un proyecto (RF-01/02/07). */
export async function updateProyecto(
  id: string,
  _prev: ProyectoFormState,
  formData: FormData,
): Promise<ProyectoFormState> {
  const titulo = texto(formData.get("titulo")) ?? "";
  const raw = {
    titulo,
    slug: texto(formData.get("slug")) ?? slugify(titulo),
    segmento: formData.get("segmento"),
    estado: formData.get("estado"),
    tipo_evento: texto(formData.get("tipo_evento")),
    ubicacion: texto(formData.get("ubicacion")),
    capacidad_personas: entero(formData.get("capacidad_personas")),
    dimensiones_m2: entero(formData.get("dimensiones_m2")),
    tipo_carpa: texto(formData.get("tipo_carpa")),
    tipo_anclaje: texto(formData.get("tipo_anclaje")),
    cliente: texto(formData.get("cliente")),
    descripcion: texto(formData.get("descripcion")),
    destacado: formData.get("destacado") === "on",
    fecha: texto(formData.get("fecha")),
  };

  const parsed = ProyectoSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("proyectos")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Ese slug ya está en uso por otro proyecto."
          : error.message,
    };
  }

  updateTag(CONTENT_TAGS.proyectos);
  revalidatePath("/admin/proyectos");
  revalidatePath(`/admin/proyectos/${id}`);
  return { ok: true };
}

/** Elimina un proyecto, sus archivos de Storage y vuelve al listado. */
export async function deleteProyecto(id: string) {
  const supabase = await createClient();

  // Borra los archivos de la galería en Storage (evita huérfanos).
  const { data: archivos } = await supabase.storage
    .from("medios")
    .list(`proyectos/${id}`);
  if (archivos && archivos.length > 0) {
    await supabase.storage
      .from("medios")
      .remove(archivos.map((f) => `proyectos/${id}/${f.name}`));
  }

  const { error } = await supabase.from("proyectos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  updateTag(CONTENT_TAGS.proyectos);
  revalidatePath("/admin/proyectos");
  redirect("/admin/proyectos");
}

/** Persiste la galería reordenada y la portada elegida (RF-03/04). */
export async function saveGaleria(
  id: string,
  galeria: GalleryItem[],
  portada: string | null,
): Promise<ProyectoFormState> {
  const normalizada = galeria.map((g, i) => ({
    path: g.path,
    alt: g.alt ?? null,
    orden: i,
  }));
  const supabase = await createClient();

  // Elimina de Storage las imágenes que se quitaron de la galería.
  const { data: actual } = await supabase
    .from("proyectos")
    .select("galeria")
    .eq("id", id)
    .maybeSingle();
  const antiguos = Array.isArray(actual?.galeria)
    ? (actual.galeria as { path?: string }[])
        .map((g) => g.path)
        .filter((p): p is string => Boolean(p))
    : [];
  const conservados = new Set(normalizada.map((g) => g.path));
  const eliminados = antiguos.filter((p) => !conservados.has(p));
  if (eliminados.length > 0) {
    await supabase.storage.from("medios").remove(eliminados);
  }

  const { error } = await supabase
    .from("proyectos")
    .update({ galeria: normalizada, imagen_portada_path: portada })
    .eq("id", id);
  if (error) return { error: error.message };

  updateTag(CONTENT_TAGS.proyectos);
  revalidatePath(`/admin/proyectos/${id}`);
  return { ok: true };
}
