"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string };

export function HeaderShell({
  nombre,
  logo,
  logoAlt,
  whatsapp,
  items,
}: {
  nombre: string;
  logo: string | null;
  logoAlt: string | null;
  whatsapp: string | null;
  items: NavItem[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Transparente solo en el tope del home (sobre el hero oscuro).
  const transparent = isHome && !scrolled && !open;

  const wa = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : null;
  const linkColor = transparent
    ? "text-bone/85 hover:text-bone"
    : "text-foreground/80 hover:text-foreground";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-border bg-bone/90 backdrop-blur",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" aria-label={nombre} className="flex items-center gap-2">
          {transparent ? (
            logoAlt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoAlt} alt={nombre} className="h-12 w-auto md:h-14" />
            ) : (
              <span className="font-serif text-lg font-bold text-bone">
                {nombre}
              </span>
            )
          ) : logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={nombre} className="h-12 w-auto md:h-14" />
          ) : (
            <span className="font-serif text-lg font-bold text-foreground">
              {nombre}
            </span>
          )}
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("text-sm font-medium transition-colors", linkColor)}
            >
              {item.label}
            </Link>
          ))}
          {wa ? (
            <Link
              href={wa}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className={cn("transition-colors", linkColor)}
            >
              <MessageCircle className="size-5" />
            </Link>
          ) : null}
          <Button asChild variant="gold" size="sm">
            <Link href="/cotizar">Cotizar</Link>
          </Button>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <Button asChild variant="gold" size="sm">
            <Link href="/cotizar">Cotizar</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            aria-expanded={open}
            className={cn(
              "transition-colors",
              transparent ? "text-bone" : "text-foreground",
            )}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-b border-border bg-bone md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col px-5 py-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm font-medium text-foreground"
              >
                {item.label}
              </Link>
            ))}
            {wa ? (
              <Link
                href={wa}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-gold-deep"
              >
                WhatsApp directo
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
