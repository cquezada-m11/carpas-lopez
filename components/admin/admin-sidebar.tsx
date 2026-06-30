"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  LayoutGrid,
  Settings,
  House,
  Inbox,
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

/** Separación visual Configuración vs Contenido (RF-06). */
const GROUPS: Group[] = [
  {
    label: "Contenido",
    items: [
      { href: "/admin/proyectos", label: "Proyectos", icon: FolderOpen },
      { href: "/admin/servicios", label: "Servicios", icon: LayoutGrid },
    ],
  },
  {
    label: "Configuración",
    items: [
      { href: "/admin/general", label: "General", icon: Settings },
      { href: "/admin/home", label: "Home", icon: House },
      {
        href: "/admin/cotizaciones",
        label: "Cotizaciones",
        icon: Inbox,
        soon: true,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
      active
        ? "bg-gold/15 font-semibold text-foreground"
        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
    );

  return (
    <nav className="flex flex-col gap-6">
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
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(active)}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
