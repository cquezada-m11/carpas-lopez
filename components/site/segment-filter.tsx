import Link from "next/link";
import {
  SEGMENTOS,
  segmentoLabel,
  type Segmento,
} from "@/lib/content/segmento";
import { cn } from "@/lib/utils";

const chipBase =
  "rounded-full border px-3.5 py-1.5 font-mono text-eyebrow uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function chipClass(isActive: boolean) {
  return cn(
    chipBase,
    isActive
      ? "border-gold bg-gold text-ink-deep"
      : "border-input text-muted-foreground hover:border-gold/60 hover:text-foreground",
  );
}

/** Filtro de segmento por URL (`?segmento=`); server-side, sin JS de cliente (RF-11). */
export function SegmentFilter({ active }: { active?: Segmento }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/trabajos" className={chipClass(!active)} scroll={false}>
        Todos
      </Link>
      {SEGMENTOS.map((s) => (
        <Link
          key={s}
          href={`/trabajos?segmento=${s}`}
          className={chipClass(active === s)}
          scroll={false}
        >
          {segmentoLabel[s]}
        </Link>
      ))}
    </div>
  );
}
