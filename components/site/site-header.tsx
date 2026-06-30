import Link from "next/link";
import Image from "next/image";
import { getConfiguracion } from "@/lib/content/queries";
import { mediaUrl } from "@/lib/content/media";
import { SiteNav, type NavItem } from "./site-nav";

/** Navegación fija en código (RF-05: el admin no la modifica). */
const NAV: NavItem[] = [
  { href: "/trabajos", label: "Trabajos" },
  { href: "/#segmentos", label: "Segmentos" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/#contacto", label: "Contacto" },
];

export async function SiteHeader() {
  const config = await getConfiguracion();
  const nombre = config?.nombre_empresa ?? "Carpas López";
  const logo = mediaUrl(config?.logo_path);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bone/90 backdrop-blur supports-[backdrop-filter]:bg-bone/75">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={nombre}>
          {logo ? (
            <Image
              src={logo}
              alt={nombre}
              width={140}
              height={32}
              className="h-8 w-auto"
            />
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
