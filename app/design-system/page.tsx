import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Eyebrow,
  OrnamentDivider,
  Section,
  SectionHeading,
  Stat,
  StatRow,
} from "@/components/ds";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false },
};

const palette = [
  { name: "Ink", className: "bg-ink", hex: "#1A1A1A", fg: "text-bone" },
  {
    name: "Ink deep",
    className: "bg-ink-deep",
    hex: "#141414",
    fg: "text-bone",
  },
  { name: "Bone", className: "bg-bone", hex: "#F5F2EA", fg: "text-ink" },
  {
    name: "Bone alt",
    className: "bg-bone-alt",
    hex: "#EFEBE0",
    fg: "text-ink",
  },
  {
    name: "Bone dark",
    className: "bg-bone-dark",
    hex: "#E7E3D8",
    fg: "text-ink",
  },
  { name: "Gold", className: "bg-gold", hex: "#C9A24B", fg: "text-ink-deep" },
  {
    name: "Gold deep",
    className: "bg-gold-deep",
    hex: "#9A7D33",
    fg: "text-bone",
  },
  {
    name: "Gold light",
    className: "bg-gold-light",
    hex: "#E3C46A",
    fg: "text-ink-deep",
  },
];

function Swatch({ name, className, hex, fg }: (typeof palette)[number]) {
  return (
    <div className="overflow-hidden rounded border border-border">
      <div className={`flex h-20 items-end p-2 ${className} ${fg}`}>
        <span className="font-mono text-[10px]">{hex}</span>
      </div>
      <div className="bg-white px-2 py-1.5 text-xs font-semibold">{name}</div>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Eyebrow>{title}</Eyebrow>
      {children}
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="bg-bone-dark">
      <Section tone="bone" className="border-b border-border">
        <SectionHeading eyebrow="Carpas López · Design System">
          Sistema de diseño
        </SectionHeading>
        <p className="mt-4 max-w-prose text-muted-foreground">
          Tokens, tipografías y componentes base derivados del prototipo. Negro
          + dorado sobre hueso; el dorado es acento, no relleno.
        </p>
      </Section>

      <Section tone="bone" className="flex flex-col gap-16">
        {/* Paleta */}
        <Block title="Paleta">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {palette.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </div>
        </Block>

        {/* Tipografía */}
        <Block title="Tipografía">
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 font-mono text-eyebrow uppercase text-muted-foreground">
                Display · Libre Caslon Text
              </p>
              <p className="font-serif text-display font-bold">
                Estructuras que sostienen tus mejores eventos.
              </p>
            </div>
            <div>
              <p className="mb-2 font-mono text-eyebrow uppercase text-muted-foreground">
                Heading · serif italic
              </p>
              <p className="font-serif text-heading">
                La confianza se monta{" "}
                <em className="text-gold-deep">antes que la carpa.</em>
              </p>
            </div>
            <div>
              <p className="mb-2 font-mono text-eyebrow uppercase text-muted-foreground">
                Cuerpo · Manrope
              </p>
              <p className="max-w-prose text-muted-foreground">
                Asesoría en terreno, montaje puntual y seguridad estructural —
                para celebraciones y grandes producciones.
              </p>
            </div>
          </div>
        </Block>

        {/* Botones */}
        <Block title="Botones">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Solicitar cotización</Button>
            <Button variant="outline">Ver trabajos realizados</Button>
            <Button variant="gold" size="sm">
              Cotizar
            </Button>
            <Button variant="link">Ver todos</Button>
          </div>
        </Block>

        {/* Badges */}
        <Block title="Etiquetas de segmento">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Social</Badge>
            <Badge>Corporativo</Badge>
            <Badge variant="outline">Transparente</Badge>
            <Badge variant="outline">Pagoda</Badge>
          </div>
        </Block>

        {/* Inputs */}
        <Block title="Formulario">
          <div className="grid max-w-md gap-3">
            <Input placeholder="Tipo de evento" />
            <div className="flex gap-3">
              <Input placeholder="Fecha" />
              <Input placeholder="N° personas" />
            </div>
            <Button size="block">Enviar solicitud</Button>
          </div>
        </Block>

        {/* Ornamento + Stats */}
        <Block title="Ornamento y cifras">
          <OrnamentDivider className="max-w-xs" />
          <StatRow className="max-w-md">
            <Stat value="+15" label="años de experiencia" />
            <Stat value="200+" label="eventos al año" />
            <Stat value="RM·V" label="regiones de cobertura" />
          </StatRow>
        </Block>
      </Section>

      {/* Sección oscura (contexto on-dark) */}
      <Section tone="dark">
        <SectionHeading eyebrow="Por qué elegirnos" tone="dark">
          La confianza se monta antes que la carpa.
        </SectionHeading>
        <div className="mt-8 flex flex-col">
          {[
            [
              "01",
              "Puntualidad de montaje",
              "Llegamos antes. Montaje y desmontaje en la ventana acordada.",
            ],
            [
              "02",
              "Seguridad estructural",
              "Anclajes calculados según superficie y carga de viento.",
            ],
            [
              "03",
              "Asesoría en terreno",
              "Visitamos el lugar antes de cotizar. Cero sorpresas.",
            ],
          ].map(([num, titulo, texto]) => (
            <div key={num} className="flex gap-4 border-t border-gold/30 py-5">
              <span className="shrink-0 font-serif text-2xl italic leading-none text-gold">
                {num}
              </span>
              <div>
                <p className="font-semibold">{titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline-dark" className="mt-8">
          Conoce nuestro proceso
        </Button>
      </Section>
    </main>
  );
}
