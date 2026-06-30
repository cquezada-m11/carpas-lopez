import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ds";
import { getConfiguracion } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo Carpas López trata los datos personales que recibe a través del formulario de cotización.",
  robots: { index: true },
};

export default async function PrivacidadPage() {
  const config = await getConfiguracion();
  const nombre = config?.nombre_empresa ?? "Carpas López";
  const email = config?.email ?? "contacto@carpaslopez.cl";

  return (
    <Section tone="bone" innerClassName="max-w-3xl py-16 md:py-20">
      <SectionHeading eyebrow="Privacidad" as="h1">
        Política de privacidad
      </SectionHeading>

      <div className="mt-8 flex flex-col gap-6 text-muted-foreground [&_h2]:font-serif [&_h2]:text-heading [&_h2]:font-bold [&_h2]:text-foreground [&_p]:leading-relaxed">
        <p>
          En {nombre} respetamos tu privacidad. Esta política explica qué datos
          personales recopilamos a través de este sitio, con qué fin y cómo los
          tratamos, conforme a la Ley N.º 19.628 sobre Protección de la Vida
          Privada.
        </p>

        <div className="flex flex-col gap-2">
          <h2>Qué datos recopilamos</h2>
          <p>
            Cuando completas el formulario de cotización recopilamos los datos
            que nos entregas voluntariamente: nombre, correo electrónico,
            teléfono (opcional) y la información del evento (tipo, fecha,
            ubicación, número de personas y comentarios).
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2>Para qué los usamos</h2>
          <p>
            Usamos esos datos únicamente para contactarte, preparar tu
            cotización y dar seguimiento a tu solicitud. No los usamos para
            fines distintos ni los vendemos o cedemos a terceros ajenos a la
            prestación del servicio.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2>Conservación</h2>
          <p>
            Conservamos tu solicitud por el tiempo necesario para gestionarla y
            mantener un registro comercial razonable. Puedes pedirnos que la
            eliminemos cuando quieras.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2>Tus derechos</h2>
          <p>
            Puedes solicitar el acceso, la rectificación o la eliminación de tus
            datos personales escribiéndonos a{" "}
            <a
              href={`mailto:${email}`}
              className="border-b border-gold pb-0.5 font-semibold text-gold-deep hover:text-gold"
            >
              {email}
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2>Contacto</h2>
          <p>
            Si tienes dudas sobre el tratamiento de tus datos, escríbenos a{" "}
            {email}. Esta política puede actualizarse; publicaremos cualquier
            cambio en esta misma página.
          </p>
        </div>
      </div>
    </Section>
  );
}
