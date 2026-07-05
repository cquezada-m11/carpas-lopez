import Link from "next/link";
import { getConfiguracion } from "@/lib/content/queries";
import { mediaUrl } from "@/lib/content/media";

/** Logo de la marca para las páginas de autenticación, fuera del card. */
export async function AuthLogo() {
  const config = await getConfiguracion();
  const logo = mediaUrl(config?.logo_path);
  const nombre = config?.nombre_empresa ?? "Carpas López";

  return (
    <Link
      href="/"
      aria-label={nombre}
      className="flex items-center justify-center"
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={nombre} className="h-20 w-auto md:h-24" />
      ) : (
        <span className="font-serif text-2xl font-bold text-foreground">
          {nombre}
        </span>
      )}
    </Link>
  );
}
