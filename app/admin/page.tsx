import { Suspense } from "react";
import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";
import { getResumenAdmin } from "@/lib/content/admin";
import { createDraftProyecto } from "./proyectos/actions";
import { Button } from "@/components/ui/button";

export default function AdminHome() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-heading-lg font-bold">
          Panel de contenido
        </h1>
        <p className="mt-2 text-muted-foreground">
          Administra el portafolio y la configuración del sitio.
        </p>
      </div>

      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Resumen />
      </Suspense>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/proyectos">
            <FolderOpen className="size-4" /> Gestionar proyectos
          </Link>
        </Button>
        <form action={createDraftProyecto}>
          <Button type="submit" variant="outline">
            <Plus className="size-4" /> Nuevo proyecto
          </Button>
        </form>
      </div>
    </div>
  );
}

async function Resumen() {
  const r = await getResumenAdmin();
  const cards = [
    {
      label: "Proyectos",
      value: r.proyectos,
      sub: `${r.proyectosPublicados} publicados`,
    },
    { label: "Servicios", value: r.servicios, sub: "Colección" },
    { label: "Cotizaciones", value: r.cotizaciones, sub: "Leads recibidos" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded border border-border bg-card p-5 shadow-card"
        >
          <div className="font-serif text-3xl font-bold text-foreground">
            {c.value}
          </div>
          <div className="mt-1 text-sm font-semibold">{c.label}</div>
          <div className="text-xs text-muted-foreground">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
