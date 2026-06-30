import type { MetadataRoute } from "next";
import { getSlugsPublicados } from "@/lib/content/queries";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await getSlugsPublicados();

  const estaticas: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/trabajos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/servicios`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/nosotros`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/cotizar`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const proyectos: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/trabajos/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...estaticas, ...proyectos];
}
