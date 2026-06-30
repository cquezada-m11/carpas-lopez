import Link from "next/link";
import { getConfiguracion } from "@/lib/content/queries";
import { mediaUrl } from "@/lib/content/media";
import { SiteNav, type NavItem } from "./site-nav";

/** Navegación fija en código (RF-05: el admin no la modifica). */
const NAV: NavItem[] = [
  { href: "/trabajos", label: "Trabajos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export async function SiteHeader() {
  const config = await getConfiguracion();
  const nombre = config?.nombre_empresa ?? "Carpas López";
  const logo = mediaUrl(config?.logo_path);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bone/90 backdrop-blur supports-[backdrop-filter]:bg-bone/75">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={nombre}>
          {logo ? (
            // Logo subido por el admin: proporción natural, sin forzar ratio.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={nombre} className="h-12 w-auto md:h-14" />
          ) : (
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              {nombre}
            </span>
          )}
        </Link>
        <SiteNav items={NAV} whatsapp={config?.whatsapp ?? null} />
      </div>
    </header>
  );
}
