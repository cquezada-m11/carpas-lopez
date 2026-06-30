/** Ítem de la galería de un proyecto (jsonb ordenado en la DB). */
export type GalleryItem = { path: string; alt?: string | null; orden?: number };

/** URL pública de un objeto del bucket `medios`. */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/medios/${path}`;
}

/** Normaliza el jsonb `galeria` a un arreglo ordenado de ítems. */
export function galeriaItems(galeria: unknown): GalleryItem[] {
  if (!Array.isArray(galeria)) return [];
  return (galeria as GalleryItem[])
    .filter((g) => g && typeof g.path === "string")
    .slice()
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
}

/** Path de portada: `imagen_portada_path` o, si falta, la primera de galería (RF-03). */
export function coverPath(p: {
  imagen_portada_path: string | null;
  galeria: unknown;
}): string | null {
  if (p.imagen_portada_path) return p.imagen_portada_path;
  return galeriaItems(p.galeria)[0]?.path ?? null;
}

/** URL pública de la portada de un proyecto. */
export function coverUrl(p: {
  imagen_portada_path: string | null;
  galeria: unknown;
}): string | null {
  return mediaUrl(coverPath(p));
}
