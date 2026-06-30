import type { Database } from "@/lib/supabase/database.types";

export type Segmento = Database["public"]["Enums"]["segmento"];

/** Orden canónico de los segmentos (filtros del portafolio, tarjetas de servicio). */
export const SEGMENTOS: Segmento[] = [
  "social",
  "corporativo",
  "publico",
  "industrial",
];

/** Etiqueta legible por segmento. */
export const segmentoLabel: Record<Segmento, string> = {
  social: "Social",
  corporativo: "Corporativo",
  publico: "Público",
  industrial: "Industrial",
};

export function isSegmento(
  value: string | null | undefined,
): value is Segmento {
  return !!value && (SEGMENTOS as string[]).includes(value);
}
