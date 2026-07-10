"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  LayoutGrid,
  Tent,
  MessageSquareQuote,
  Settings,
  House,
  Inbox,
  FileText,
  Users,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
};

type Group = { label: string; items: Item[] };

const INICIO: Item = { href: "/admin", label: "Inicio", icon: LayoutDashboard };

/** Separación visual Configuración vs Contenido (RF-06). */
const GROUPS: Group[] = [
  {
    label: "Contenido",
    items: [
      { href: "/admin/proyectos", label: "Proyectos", icon: FolderOpen },
      { href: "/admin/servicios", label: "Servicios", icon: LayoutGrid },
      { href: "/admin/tipos-carpa", label: "Tipos de carpa", icon: Tent },
      {
        href: "/admin/testimonios",
        label: "Testimonios",
        icon: MessageSquareQuote,
      },
    ],
  },
  {
    label: "Configuración",
    items: [
      { href: "/admin/general", label: "General", icon: Settings },
      { href: "/admin/home", label: "Home", icon: House },
      { href: "/admin/cotizaciones", label: "Cotizaciones", icon: Inbox },
      { href: "/admin/presupuestos", label: "Presupuestos", icon: FileText },
      { href: "/admin/usuarios", label: "Usuarios", icon: Users },
    ],
  },
];

const ALL_ITEMS = [INICIO, ...GROUPS.flatMap((g) => g.items)];

function isActive(href: string, pathname: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cierra el menú móvil al navegar.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const current = ALL_ITEMS.find((it) => isActive(it.href, pathname)) ?? INICIO;

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
      active
        ? "bg-gold/15 font-semibold text-foreground"
        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
    );

  return (
    <div>
      {/* Toggle solo en móvil: muestra la sección actual */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Menú del panel"
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-card md:hidden"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
          <current.icon className="size-4 text-gold-deep" aria-hidden />
          {current.label}
        </span>
        {open ? (
          <X className="size-5 text-muted-foreground" aria-hidden />
        ) : (
          <Menu className="size-5 text-muted-foreground" aria-hidden />
        )}
      </button>

      {/* Navegación: oculta en móvil salvo abierta; siempre visible en desktop */}
      <nav
        className={cn("flex-col gap-6 md:flex", open ? "mt-3 flex" : "hidden")}
      >
        <Link href="/admin" className={linkClass(pathname === "/admin")}>
          <LayoutDashboard className="size-4" aria-hidden />
          Inicio
        </Link>

        {GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="px-3 pb-1 font-mono text-eyebrow uppercase text-gold-deep">
              {group.label}
            </span>
            {group.items.map((item) => {
              const Icon = item.icon;
              if (item.soon) {
                return (
                  <span
                    key={item.href}
                    className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm text-muted-foreground/50"
                  >
                    <Icon className="size-4" aria-hidden />
                    {item.label}
                    <span className="ml-auto rounded-sm bg-bone-dark px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
                      pronto
                    </span>
                  </span>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClass(isActive(item.href, pathname))}
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}
