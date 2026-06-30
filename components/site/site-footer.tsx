import Link from "next/link";
import { Instagram, MessageCircle, Mail, Phone } from "lucide-react";
import { getConfiguracion } from "@/lib/content/queries";

export async function SiteFooter() {
  const config = await getConfiguracion();
  const nombre = config?.nombre_empresa ?? "Carpas López";
  const wa = config?.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, "")}`
    : null;
  const cobertura = config?.comunas_cobertura ?? [];

  return (
    <footer id="contacto" className="on-dark bg-ink text-bone">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-16 md:grid-cols-3 md:px-8">
        <div className="flex flex-col gap-3">
          <span className="font-serif text-xl font-bold">{nombre}</span>
          <p className="max-w-xs text-sm text-muted-foreground">
            Estructuras que sostienen tus mejores eventos. Asesoría en terreno,
            montaje puntual y seguridad estructural.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-eyebrow uppercase text-gold">
            Contacto
          </span>
          {config?.telefono ? (
            <a
              href={`tel:${config.telefono.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-bone hover:text-gold"
            >
              <Phone className="size-4" aria-hidden /> {config.telefono}
            </a>
          ) : null}
          {config?.email ? (
            <a
              href={`mailto:${config.email}`}
              className="flex items-center gap-2 text-sm text-bone hover:text-gold"
            >
              <Mail className="size-4" aria-hidden /> {config.email}
            </a>
          ) : null}
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-bone hover:text-gold"
            >
              <MessageCircle className="size-4" aria-hidden /> WhatsApp
            </a>
          ) : null}
          {config?.instagram ? (
            <a
              href={config.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-bone hover:text-gold"
            >
              <Instagram className="size-4" aria-hidden /> Instagram
            </a>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-eyebrow uppercase text-gold">
            Cobertura
          </span>
          {cobertura.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              {cobertura.join(" · ")}
            </p>
          ) : null}
          {config?.horarios ? (
            <p className="text-sm text-muted-foreground">{config.horarios}</p>
          ) : null}
          <Link
            href="/cotizar"
            className="mt-2 w-fit border-b border-gold pb-0.5 text-sm font-semibold text-gold hover:text-gold-light"
          >
            Cotiza tu evento
          </Link>
        </div>
      </div>

      <div className="border-t border-gold/20">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-xs text-muted-foreground md:px-8">
          <span>© {nombre}. Todos los derechos reservados.</span>
          <Link href="/privacidad" className="hover:text-gold">
            Política de privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
