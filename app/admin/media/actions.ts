"use server";

import { createClient } from "@/lib/supabase/server";

export type ImportResult = { path?: string; error?: string };

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

async function requireAuth() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) throw new Error("No autorizado");
}

/** Bloquea hosts locales/metadata para evitar SSRF básico. */
function hostBloqueado(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return (
    h === "localhost" ||
    h === "0.0.0.0" ||
    h === "::1" ||
    h.startsWith("127.") ||
    h.startsWith("10.") ||
    h.startsWith("192.168.") ||
    h.startsWith("169.254.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h)
  );
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#x2f;/gi, "/")
    .replace(/&#38;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** Extrae la imagen de una página (og:image / twitter:image). */
function extraerImagenDeHtml(html: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return decodeEntities(m[1]);
  }
  return null;
}

/** Resuelve la URL final de imagen: directa, o vía og:image si es una página. */
async function resolverUrlImagen(url: string): Promise<string | null> {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "text/html,image/*" },
    redirect: "follow",
  });
  if (!res.ok) return null;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.startsWith("image/")) return url;
  if (ct.includes("text/html")) {
    const html = await res.text();
    return extraerImagenDeHtml(html);
  }
  return null;
}

/**
 * Importa una imagen desde una URL (directa, o de un post/página vía og:image)
 * y la sube a Storage. Reutilizable en cualquier sección con imágenes.
 */
export async function importImageFromUrl(
  folder: string,
  url: string,
): Promise<ImportResult> {
  await requireAuth();

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { error: "La URL no es válida." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { error: "La URL debe empezar con http(s)." };
  }
  if (hostBloqueado(parsed.hostname)) {
    return { error: "Ese destino no está permitido." };
  }

  let imagenUrl: string | null;
  try {
    imagenUrl = await resolverUrlImagen(url);
  } catch {
    return { error: "No pudimos acceder a esa URL." };
  }
  if (!imagenUrl) {
    return {
      error:
        "No encontramos una imagen en esa URL. Instagram a veces bloquea la descarga; prueba con el enlace directo a la imagen (clic derecho → copiar dirección de la imagen).",
    };
  }

  let res: Response;
  try {
    res = await fetch(imagenUrl, {
      headers: { "user-agent": UA, accept: "image/*" },
      redirect: "follow",
    });
  } catch {
    return { error: "No pudimos descargar la imagen." };
  }
  const ct = (res.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!res.ok || !ct.startsWith("image/")) {
    return { error: "El contenido de la URL no es una imagen." };
  }

  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength === 0) return { error: "La imagen está vacía." };
  if (bytes.byteLength > MAX_BYTES) {
    return { error: "La imagen supera el límite de 15 MB." };
  }

  const ext = EXT_BY_TYPE[ct] ?? "jpg";
  const carpeta = folder.replace(/^\/+/, "").replace(/\.\.+/g, "");
  const dest = `${carpeta}/${Date.now()}-url.${ext}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from("medios")
    .upload(dest, bytes, { contentType: ct, upsert: false });
  if (error) return { error: error.message };

  return { path: dest };
}
