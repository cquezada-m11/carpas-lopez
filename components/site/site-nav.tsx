"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type NavItem = { href: string; label: string };

export function SiteNav({
  items,
  whatsapp,
}: {
  items: NavItem[];
  whatsapp: string | null;
}) {
  const [open, setOpen] = useState(false);
  const wa = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : null;

  return (
    <>
      {/* Desktop */}
      <nav className="hidden items-center gap-7 md:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
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
            className="text-foreground/70 transition-colors hover:text-gold-deep"
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
          className="text-foreground"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-bone shadow-card md:hidden">
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
    </>
  );
}
