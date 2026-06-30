import { Suspense } from "react";
import { getHomeAdmin, listProyectosPublicadosMin } from "@/lib/content/admin";
import { HomeForm } from "@/components/admin/home-form";

export default function HomeAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-heading-lg font-bold">Home</h1>
        <p className="mt-2 text-muted-foreground">
          Contenido editable de la portada: hero, diferenciadores y proceso.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Editor />
      </Suspense>
    </div>
  );
}

async function Editor() {
  const [home, proyectos] = await Promise.all([
    getHomeAdmin(),
    listProyectosPublicadosMin(),
  ]);
  if (!home) {
    return (
      <p className="text-muted-foreground">
        No se encontró el contenido del home.
      </p>
    );
  }
  return <HomeForm home={home} proyectos={proyectos} />;
}
