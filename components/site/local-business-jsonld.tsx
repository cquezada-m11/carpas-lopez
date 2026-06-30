import { getConfiguracion } from "@/lib/content/queries";
import { mediaUrl } from "@/lib/content/media";
import { siteUrl } from "@/lib/site";

/** Datos estructurados de negocio local (RNF-07). */
export async function LocalBusinessJsonLd() {
  const config = await getConfiguracion();
  const base = siteUrl();
  const logo = mediaUrl(config?.logo_path);

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config?.nombre_empresa ?? "Carpas López",
    description:
      "Arriendo, diseño y montaje de carpas para eventos sociales, corporativos, públicos e industriales.",
    url: base,
    ...(config?.telefono ? { telephone: config.telefono } : {}),
    ...(config?.email ? { email: config.email } : {}),
    ...(logo ? { image: logo, logo } : {}),
    ...(config?.instagram ? { sameAs: [config.instagram] } : {}),
    ...(config?.comunas_cobertura && config.comunas_cobertura.length > 0
      ? {
          areaServed: config.comunas_cobertura.map((name) => ({
            "@type": "AdministrativeArea",
            name,
          })),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
