"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { guardarHome, type HomeFormState } from "@/app/admin/home/actions";
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

function fieldLabel(text: string) {
  return <Label className="text-xs text-muted-foreground">{text}</Label>;
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
    <div className="flex flex-col gap-8">
      {state.error ? (
        <p className="flex items-center gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="flex items-center gap-2 rounded-sm border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold-deep">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          Home guardado.
        </p>
      ) : null}

      {/* Hero */}
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-heading font-bold">Hero</h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero_titulo">Titular</Label>
          <Textarea
            id="hero_titulo"
            rows={2}
            value={heroTitulo}
            onChange={(e) => setHeroTitulo(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero_bajada">Bajada</Label>
          <Textarea
            id="hero_bajada"
            rows={2}
            value={heroBajada}
            onChange={(e) => setHeroBajada(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-sm border border-border p-3">
            <span className="font-mono text-eyebrow uppercase text-gold-deep">
              CTA primario
            </span>
            {fieldLabel("Texto")}
            <Input
              value={ctaP.texto}
              onChange={(e) => setCtaP({ ...ctaP, texto: e.target.value })}
            />
            {fieldLabel("Destino")}
            <Input
              value={ctaP.destino}
              onChange={(e) => setCtaP({ ...ctaP, destino: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2 rounded-sm border border-border p-3">
            <span className="font-mono text-eyebrow uppercase text-gold-deep">
              CTA secundario
            </span>
            {fieldLabel("Texto")}
            <Input
              value={ctaS.texto}
              onChange={(e) => setCtaS({ ...ctaS, texto: e.target.value })}
            />
            {fieldLabel("Destino")}
            <Input
              value={ctaS.destino}
              onChange={(e) => setCtaS({ ...ctaS, destino: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Diferenciadores */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-heading font-bold">
            Por qué elegirnos
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setDifs((p) => [...p, { icono: "", titulo: "", texto: "" }])
            }
          >
            <Plus className="size-4" /> Agregar
          </Button>
        </div>
        {difs.map((d, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-sm border border-border p-3"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                {fieldLabel("Ícono (clock, shield-check, map-pin…)")}
                <Input
                  value={d.icono}
                  onChange={(e) => updateDif(i, { icono: e.target.value })}
                />
              </div>
              <div>
                {fieldLabel("Título")}
                <Input
                  value={d.titulo}
                  onChange={(e) => updateDif(i, { titulo: e.target.value })}
                />
              </div>
            </div>
            {fieldLabel("Texto")}
            <Textarea
              rows={2}
              value={d.texto}
              onChange={(e) => updateDif(i, { texto: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setDifs((p) => p.filter((_, j) => j !== i))}
              className="flex w-fit items-center gap-1 text-xs text-destructive hover:underline"
            >
              <Trash2 className="size-3.5" /> Quitar
            </button>
          </div>
        ))}
      </section>

      {/* Proceso */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-heading font-bold">Cómo trabajamos</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPasos((p) => [
                ...p,
                { numero: String(p.length + 1), titulo: "", texto: "" },
              ])
            }
          >
            <Plus className="size-4" /> Agregar
          </Button>
        </div>
        {pasos.map((p, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-sm border border-border p-3"
          >
            <div className="grid gap-2 sm:grid-cols-[6rem_1fr]">
              <div>
                {fieldLabel("N.º")}
                <Input
                  value={p.numero}
                  onChange={(e) => updatePaso(i, { numero: e.target.value })}
                />
              </div>
              <div>
                {fieldLabel("Título")}
                <Input
                  value={p.titulo}
                  onChange={(e) => updatePaso(i, { titulo: e.target.value })}
                />
              </div>
            </div>
            {fieldLabel("Texto")}
            <Textarea
              rows={2}
              value={p.texto}
              onChange={(e) => updatePaso(i, { texto: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setPasos((prev) => prev.filter((_, j) => j !== i))}
              className="flex w-fit items-center gap-1 text-xs text-destructive hover:underline"
            >
              <Trash2 className="size-3.5" /> Quitar
            </button>
          </div>
        ))}
      </section>

      {/* Cifras del hero */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-heading font-bold">Cifras del hero</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStats((p) => [...p, { valor: "", etiqueta: "" }])}
          >
            <Plus className="size-4" /> Agregar
          </Button>
        </div>
        {stats.map((s, i) => (
          <div
            key={i}
            className="grid items-end gap-2 rounded-2xl border border-border p-3 sm:grid-cols-[8rem_1fr_auto]"
          >
            <div>
              {fieldLabel("Valor")}
              <Input
                value={s.valor}
                onChange={(e) => updateStat(i, { valor: e.target.value })}
              />
            </div>
            <div>
              {fieldLabel("Etiqueta")}
              <Input
                value={s.etiqueta}
                onChange={(e) => updateStat(i, { etiqueta: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={() => setStats((p) => p.filter((_, j) => j !== i))}
              className="flex items-center gap-1 px-1 pb-3 text-xs text-destructive hover:underline"
            >
              <Trash2 className="size-3.5" /> Quitar
            </button>
          </div>
        ))}
      </section>

      {/* Proyectos destacados */}
      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-heading font-bold">
          Proyectos destacados
        </h2>
        <p className="text-sm text-muted-foreground">
          Elige los proyectos de la sección de trabajos del home. Si no
          seleccionas ninguno, se muestran los últimos publicados.
        </p>
        {proyectos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay proyectos publicados todavía.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {proyectos.map((p) => (
              <li key={p.id}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={destacados.includes(p.id)}
                    onChange={() => toggleDestacado(p.id)}
                    className="size-4 accent-gold"
                  />
                  {p.titulo}
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="button" onClick={save} disabled={pending}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
