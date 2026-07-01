import type { Metadata, Viewport } from "next";
import { Libre_Caslon_Text, Manrope } from "next/font/google";
import { siteUrl } from "@/lib/site";
import { LoadingOverlayProvider } from "@/components/site/loading-overlay";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Carpas López — Arriendo, diseño y montaje de carpas para eventos",
    template: "%s · Carpas López",
  },
  description:
    "Estructuras que sostienen tus mejores eventos. Asesoría en terreno, montaje puntual y seguridad estructural para celebraciones y grandes producciones.",
};

// Bloquea el zoom en móvil (pinch / doble tap).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Títulos: serif clásica elegante (PRD §11.3, lado bodas/premium)
const serif = Libre_Caslon_Text({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

// Cuerpo: sans legible (lado corporativo)
const sans = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-bone-dark">
        <LoadingOverlayProvider>{children}</LoadingOverlayProvider>
      </body>
    </html>
  );
}
