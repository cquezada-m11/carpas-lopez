"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type CotizarState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** Rangos válidos para la fecha aproximada del evento. */
export const RANGOS_FECHA = [
  "Esta semana",
  "Este mes",
  "Próximo mes",
  "En 2-3 meses",
  "Aún no lo sé",
] as const;

// Rate-limit simple en memoria (por instancia). Suficiente para v1;
// para multi-instancia conviene un store compartido en una fase posterior.
const RECENT = new Map<string, number[]>();
const VENTANA_MS = 10 * 60 * 1000;
const MAX_ENVIOS = 4;

function rateLimited(ip: string): boolean {
  const ahora = Date.now();
  const previos = (RECENT.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (previos.length >= MAX_ENVIOS) {
    RECENT.set(ip, previos);
    return true;
  }
  previos.push(ahora);
  RECENT.set(ip, previos);
  return false;
}

const CotizacionSchema = z.object({
  tipo_evento: z.string().min(2, "Indica el tipo de evento"),
  ubicacion: z.string().min(2, "Indica la comuna o ubicación"),
  numero_personas: z.coerce
    .number()
    .int()
    .positive("Indica el número de personas"),
  nombre: z.string().min(2, "Indica tu nombre"),
  email: z.string().email("Revisa el correo"),
  telefono: z.string().nullable(),
  mensaje: z.string().nullable(),
  segmento: z
    .enum(["social", "corporativo", "publico", "industrial"])
    .nullable(),
});

type Lead = z.infer<typeof CotizacionSchema>;

/** Notificación de lead enchufable: envía email solo si hay RESEND_API_KEY. */
async function notificarLead(
  lead: Lead,
  fecha: string,
  destino: string | null,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !destino) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEADS_FROM ?? "Carpas López <onboarding@resend.dev>",
        to: [destino],
        subject: `Nueva cotización: ${lead.tipo_evento} (${lead.ubicacion})`,
        text: [
          `Tipo de evento: ${lead.tipo_evento}`,
          `Fecha: ${fecha}`,
          `Ubicación: ${lead.ubicacion}`,
          `Personas: ${lead.numero_personas}`,
          `Segmento: ${lead.segmento ?? "—"}`,
          "",
          `Nombre: ${lead.nombre}`,
          `Email: ${lead.email}`,
          `Teléfono: ${lead.telefono ?? "—"}`,
          "",
          `Mensaje: ${lead.mensaje ?? "—"}`,
        ].join("\n"),
      }),
    });
  } catch {
    // El lead ya quedó guardado; no rompemos el flujo si el email falla.
  }
}

export async function enviarCotizacion(
  _prev: CotizarState,
  formData: FormData,
): Promise<CotizarState> {
  // Honeypot: si el campo trampa viene lleno, fingimos éxito y descartamos.
  if (
    typeof formData.get("empresa_web") === "string" &&
    formData.get("empresa_web")
  ) {
    return { ok: true };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? "local").trim();
  if (rateLimited(ip)) {
    return { error: "Demasiados envíos. Inténtalo de nuevo en unos minutos." };
  }

  const str = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  const opt = (k: string) => {
    const v = str(k);
    return v === "" ? null : v;
  };

  // Fecha: exacta (YYYY-MM-DD) o rango aproximado.
  const fechaExacta = str("fecha_evento");
  const fechaRangoRaw = str("fecha_rango");
  let fecha_evento: string | null = null;
  let fecha_rango: string | null = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaExacta)) {
    fecha_evento = fechaExacta;
  } else if ((RANGOS_FECHA as readonly string[]).includes(fechaRangoRaw)) {
    fecha_rango = fechaRangoRaw;
  }

  const parsed = CotizacionSchema.safeParse({
    tipo_evento: str("tipo_evento"),
    ubicacion: str("ubicacion"),
    numero_personas: str("numero_personas"),
    nombre: str("nombre"),
    email: str("email"),
    telefono: opt("telefono"),
    mensaje: opt("mensaje"),
    segmento: opt("segmento"),
  });

  const fieldErrors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
  }
  if (!fecha_evento && !fecha_rango) {
    fieldErrors.fecha_evento = "Indica cuándo será el evento";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Revisa los campos marcados.", fieldErrors };
  }

  const lead = parsed.data!;
  const supabase = await createClient();

  // Insert sin .select(): el visitante anónimo puede insertar pero no leer (RLS).
  const { error } = await supabase.from("cotizaciones").insert({
    tipo_evento: lead.tipo_evento,
    fecha_evento,
    fecha_rango,
    ubicacion: lead.ubicacion,
    numero_personas: lead.numero_personas,
    nombre: lead.nombre,
    email: lead.email,
    telefono: lead.telefono,
    mensaje: lead.mensaje,
    segmento: lead.segmento,
    origen: "formulario-web",
  });

  if (error) {
    return {
      error: "No pudimos registrar tu solicitud. Inténtalo nuevamente.",
    };
  }

  const { data: config } = await supabase
    .from("configuracion_global")
    .select("destino_leads")
    .eq("id", 1)
    .maybeSingle();
  await notificarLead(
    lead,
    fecha_evento ?? fecha_rango ?? "—",
    config?.destino_leads ?? null,
  );

  return { ok: true };
}
