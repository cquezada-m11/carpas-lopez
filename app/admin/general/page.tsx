import { Suspense } from "react";
import { getConfiguracionAdmin } from "@/lib/content/admin";
import { ConfiguracionForm } from "@/components/admin/configuracion-form";

export default function GeneralAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-heading-lg font-bold">General</h1>
        <p className="mt-2 text-muted-foreground">
          Datos de contacto, cobertura y branding del sitio. Se reflejan en el
          header, el footer y el destino de las cotizaciones.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Editor />
      </Suspense>
    </div>
  );
}

async function Editor() {
  const config = await getConfiguracionAdmin();
  if (!config) {
    return (
      <p className="text-muted-foreground">
        No se encontró la configuración global.
      </p>
    );
  }
  return <ConfiguracionForm config={config} />;
}
