"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SingleImageField } from "@/components/admin/single-image-field";
import { AdminPanel } from "@/components/admin/admin-panel";
import { guardarHome, type HomeFormState } from "@/app/admin/home/actions";
import { useOverlayPending } from "@/components/site/loading-overlay";
import type { HomeRow } from "@/lib/content/admin";

type Cta = { texto: string; destino: string };
type Diferenciador = { icono: string; titulo: string; texto: string };
type Paso = { numero: string; titulo: string; texto: string };
type Stat = { valor: string; etiqueta: string };
type ProyectoMin = { id: string; titulo: string };

function parseCta(value: unknown): Cta {
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    return { texto: String(o.texto ?? ""), destino: String(o.destino ?? "") };
  }
  return { texto: "", destino: "" };
}

/** Campo con label sobre el control. */
function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-xs text-muted-foreground">{children}</Label>;
}

/** Ítem de un repetidor: rótulo + acción de quitar en el encabezado. */
function RepeaterItem({
  label,
  onRemove,
  children,
}: {
  label: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-bone-alt p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-eyebrow uppercase text-gold-deep">
          {label}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 text-xs font-semibold text-destructive hover:underline"
        >
          <Trash2 className="size-3.5" /> Quitar
        </button>
      </div>
      {children}
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <Plus className="size-4" /> Agregar
    </Button>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-input px-4 py-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function HomeForm({
  home,
  proyectos,
}: {
  home: HomeRow;
  proyectos: ProyectoMin[];
}) {
  const [heroTitulo, setHeroTitulo] = useState(home.hero_titulo);
  const [heroBajada, setHeroBajada] = useState(home.hero_bajada);
  const [heroMedia, setHeroMedia] = useState<string | null>(
    home.hero_media_path,
  );
  const [ctaP, setCtaP] = useState<Cta>(parseCta(home.hero_cta_primario));
  const [ctaS, setCtaS] = useState<Cta>(parseCta(home.hero_cta_secundario));
  const [difs, setDifs] = useState<Diferenciador[]>(
    Array.isArray(home.diferenciadores)
      ? (home.diferenciadores as Diferenciador[])
      : [],
  );
  const [pasos, setPasos] = useState<Paso[]>(
    Array.isArray(home.pasos_proceso) ? (home.pasos_proceso as Paso[]) : [],
  );
  const [stats, setStats] = useState<Stat[]>(
    Array.isArray(home.stats) ? (home.stats as Stat[]) : [],
  );
  const [destacados, setDestacados] = useState<string[]>(
    Array.isArray(home.proyectos_destacados) ? home.proyectos_destacados : [],
  );
  const [state, setState] = useState<HomeFormState>({});
  const [pending, start] = useTransition();
  useOverlayPending(pending);

  function updateStat(i: number, patch: Partial<Stat>) {
    setStats((prev) => prev.map((s, j) => (i === j ? { ...s, ...patch } : s)));
  }
  function toggleDestacado(id: string) {
    setDestacados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }
  function updateDif(i: number, patch: Partial<Diferenciador>) {
    setDifs((prev) => prev.map((d, j) => (i === j ? { ...d, ...patch } : d)));
  }
  function updatePaso(i: number, patch: Partial<Paso>) {
    setPasos((prev) => prev.map((p, j) => (i === j ? { ...p, ...patch } : p)));
  }

  function save() {
    setState({});
    start(async () => {
      const res = await guardarHome({
        hero_titulo: heroTitulo,
        hero_bajada: heroBajada,
        hero_media_path: heroMedia,
        hero_cta_primario: ctaP,
        hero_cta_secundario: ctaS,
        diferenciadores: difs,
        pasos_proceso: pasos,
        stats,
        proyectos_destacados: destacados,
      });
      setState(res);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {state.error ? (
        <p className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      ) : null}

      {/* Hero */}
      <AdminPanel
        eyebrow="Portada"
        title="Hero"
        description="Lo primero que se ve: titular, bajada, imagen de fondo y botones."
      >
        <Field label="Titular" htmlFor="hero_titulo">
          <Textarea
            id="hero_titulo"
            rows={2}
            value={heroTitulo}
            onChange={(e) => setHeroTitulo(e.target.value)}
          />
        </Field>
        <Field label="Bajada" htmlFor="hero_bajada">
          <Textarea
            id="hero_bajada"
            rows={2}
            value={heroBajada}
            onChange={(e) => setHeroBajada(e.target.value)}
          />
        </Field>
        <Field
          label="Imagen de fondo"
          hint="Se muestra detrás del hero con un degradado oscuro. Usa una foto apaisada y de buena resolución."
        >
          <SingleImageField
            folder="home"
            value={heroMedia}
            onChange={setHeroMedia}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-bone-alt p-4">
            <span className="font-mono text-eyebrow uppercase text-gold-deep">
              CTA primario
            </span>
            <SubLabel>Texto</SubLabel>
            <Input
              value={ctaP.texto}
              onChange={(e) => setCtaP({ ...ctaP, texto: e.target.value })}
            />
            <SubLabel>Destino</SubLabel>
            <Input
              value={ctaP.destino}
              onChange={(e) => setCtaP({ ...ctaP, destino: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-bone-alt p-4">
            <span className="font-mono text-eyebrow uppercase text-gold-deep">
              CTA secundario
            </span>
            <SubLabel>Texto</SubLabel>
            <Input
              value={ctaS.texto}
              onChange={(e) => setCtaS({ ...ctaS, texto: e.target.value })}
            />
            <SubLabel>Destino</SubLabel>
            <Input
              value={ctaS.destino}
              onChange={(e) => setCtaS({ ...ctaS, destino: e.target.value })}
            />
          </div>
        </div>
      </AdminPanel>

      {/* Diferenciadores */}
      <AdminPanel
        eyebrow="Sección · Por qué elegirnos"
        title="Diferenciadores"
        description="Los bloques del área oscura del home (puntualidad, seguridad, asesoría…)."
        action={
          <AddButton
            onClick={() =>
              setDifs((p) => [...p, { icono: "", titulo: "", texto: "" }])
            }
          />
        }
      >
        {difs.length === 0 ? (
          <EmptyHint>Sin diferenciadores. Agrega el primero.</EmptyHint>
        ) : (
          difs.map((d, i) => (
            <RepeaterItem
              key={i}
              label={`Diferenciador ${i + 1}`}
              onRemove={() => setDifs((p) => p.filter((_, j) => j !== i))}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <SubLabel>Ícono (clock, shield-check, map-pin…)</SubLabel>
                  <Input
                    value={d.icono}
                    onChange={(e) => updateDif(i, { icono: e.target.value })}
                  />
                </div>
                <div>
                  <SubLabel>Título</SubLabel>
                  <Input
                    value={d.titulo}
                    onChange={(e) => updateDif(i, { titulo: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <SubLabel>Texto</SubLabel>
                <Textarea
                  rows={2}
                  value={d.texto}
                  onChange={(e) => updateDif(i, { texto: e.target.value })}
                />
              </div>
            </RepeaterItem>
          ))
        )}
      </AdminPanel>

      {/* Proceso */}
      <AdminPanel
        eyebrow="Sección · Cómo trabajamos"
        title="Proceso"
        description="Los pasos del timeline: de la asesoría al desmontaje."
        action={
          <AddButton
            onClick={() =>
              setPasos((p) => [
                ...p,
                { numero: String(p.length + 1), titulo: "", texto: "" },
              ])
            }
          />
        }
      >
        {pasos.length === 0 ? (
          <EmptyHint>Sin pasos. Agrega el primero.</EmptyHint>
        ) : (
          pasos.map((p, i) => (
            <RepeaterItem
              key={i}
              label={`Paso ${i + 1}`}
              onRemove={() =>
                setPasos((prev) => prev.filter((_, j) => j !== i))
              }
            >
              <div className="grid gap-3 sm:grid-cols-[6rem_1fr]">
                <div>
                  <SubLabel>N.º</SubLabel>
                  <Input
                    value={p.numero}
                    onChange={(e) => updatePaso(i, { numero: e.target.value })}
                  />
                </div>
                <div>
                  <SubLabel>Título</SubLabel>
                  <Input
                    value={p.titulo}
                    onChange={(e) => updatePaso(i, { titulo: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <SubLabel>Texto</SubLabel>
                <Textarea
                  rows={2}
                  value={p.texto}
                  onChange={(e) => updatePaso(i, { texto: e.target.value })}
                />
              </div>
            </RepeaterItem>
          ))
        )}
      </AdminPanel>

      {/* Cifras */}
      <AdminPanel
        eyebrow="Barra de cifras"
        title="Cifras del hero"
        description="Los números destacados (+15 años, 200+ eventos…)."
        action={
          <AddButton
            onClick={() => setStats((p) => [...p, { valor: "", etiqueta: "" }])}
          />
        }
      >
        {stats.length === 0 ? (
          <EmptyHint>Sin cifras. Agrega la primera.</EmptyHint>
        ) : (
          stats.map((s, i) => (
            <div
              key={i}
              className="grid items-end gap-3 rounded-xl border border-border bg-bone-alt p-4 sm:grid-cols-[8rem_1fr_auto]"
            >
              <div>
                <SubLabel>Valor</SubLabel>
                <Input
                  value={s.valor}
                  onChange={(e) => updateStat(i, { valor: e.target.value })}
                />
              </div>
              <div>
                <SubLabel>Etiqueta</SubLabel>
                <Input
                  value={s.etiqueta}
                  onChange={(e) => updateStat(i, { etiqueta: e.target.value })}
                />
              </div>
              <button
                type="button"
                onClick={() => setStats((p) => p.filter((_, j) => j !== i))}
                className="flex items-center gap-1 px-1 pb-3 text-xs font-semibold text-destructive hover:underline"
              >
                <Trash2 className="size-3.5" /> Quitar
              </button>
            </div>
          ))
        )}
      </AdminPanel>

      {/* Destacados */}
      <AdminPanel
        eyebrow="Sección · Trabajos"
        title="Proyectos destacados"
        description="Los proyectos de la sección de trabajos del home. Si no seleccionas ninguno, se muestran los últimos publicados."
      >
        {proyectos.length === 0 ? (
          <EmptyHint>No hay proyectos publicados todavía.</EmptyHint>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {proyectos.map((p) => {
              const activo = destacados.includes(p.id);
              return (
                <li key={p.id}>
                  <label
                    className={
                      "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors " +
                      (activo
                        ? "border-gold bg-gold/10 font-medium text-foreground"
                        : "border-border hover:border-gold/50")
                    }
                  >
                    <input
                      type="checkbox"
                      checked={activo}
                      onChange={() => toggleDestacado(p.id)}
                      className="size-4 accent-gold"
                    />
                    {p.titulo}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </AdminPanel>

      {/* Barra de guardar (sticky) */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-full border border-border bg-card/95 px-5 py-3 shadow-elevated backdrop-blur">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {state.ok ? (
            <>
              <CheckCircle2 className="size-4 text-gold-deep" aria-hidden />
              Guardado. La portada del sitio ya refleja los cambios.
            </>
          ) : (
            "Cambios de la portada del sitio."
          )}
        </span>
        <Button type="button" onClick={save} disabled={pending}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
