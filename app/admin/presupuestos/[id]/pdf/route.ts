import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPresupuestoConVersion } from "@/lib/content/presupuestos";
import { getConfiguracion } from "@/lib/content/queries";
import { mediaUrl } from "@/lib/content/media";
import { renderPresupuestoPDF } from "@/lib/pdf/presupuesto-pdf";

/** Logo del bucket como data URI (react-pdf lo embebe sin depender de fetch). */
async function logoDataUri(): Promise<string | undefined> {
  try {
    const config = await getConfiguracion();
    const url = mediaUrl(config?.logo_path);
    if (!url) return undefined;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") ?? "image/png";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return undefined;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) {
    return new Response("No autorizado", { status: 401 });
  }

  const data = await getPresupuestoConVersion(id);
  if (!data) {
    return new Response("Presupuesto no encontrado", { status: 404 });
  }

  const logo = await logoDataUri();
  const pdf = await renderPresupuestoPDF({
    numero: data.presupuesto.numero,
    contenido: data.contenido,
    logo,
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${data.presupuesto.numero}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
