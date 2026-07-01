import { Suspense } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { LocalBusinessJsonLd } from "@/components/site/local-business-jsonld";
import { WhatsappFab } from "@/components/site/whatsapp-fab";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bone">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bone"
      >
        Saltar al contenido
      </a>
      <LocalBusinessJsonLd />
      <Suspense
        fallback={
          <div className="fixed top-0 z-50 h-16 w-full border-b border-border bg-bone/90 backdrop-blur md:h-20" />
        }
      >
        <SiteHeader />
      </Suspense>
      <main id="contenido" className="flex-1 pt-16 md:pt-20">
        {children}
      </main>
      <SiteFooter />
      <Suspense fallback={null}>
        <WhatsappFab />
      </Suspense>
    </div>
  );
}
