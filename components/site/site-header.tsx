import { getConfiguracion } from "@/lib/content/queries";
import { mediaUrl } from "@/lib/content/media";
import { HeaderShell, type NavItem } from "./header-shell";

/** Navegación fija en código (RF-05: el admin no la modifica). */
const NAV: NavItem[] = [
  { href: "/trabajos", label: "Trabajos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export async function SiteHeader() {
  const config = await getConfiguracion();
  return (
    <HeaderShell
      nombre={config?.nombre_empresa ?? "Carpas López"}
      logo={mediaUrl(config?.logo_path)}
      logoAlt={mediaUrl(config?.logo_alt_path)}
      whatsapp={config?.whatsapp ?? null}
      items={NAV}
    />
  );
}
