"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "@/components/admin/admin-panel";
import { guardarVersion } from "@/app/admin/presupuestos/actions";
import {
  calcularTotales,
  formatCLP,
  itemVacio,
  type PresupuestoContenido,
  type PresupuestoItem,
} from "@/lib/content/presupuesto";

function TotalesGrupo({
  t,
}: {
  t: { neto: number; iva: number; total: number };
}) {
  return (
    <div className="ml-auto flex flex-col items-end gap-0.5 text-sm">
      <span className="text-muted-foreground">
        Neto <b className="text-foreground">{formatCLP(t.neto)}</b>
      </span>
      <span className="text-muted-foreground">
        IVA 19% <b className="text-foreground">{formatCLP(t.iva)}</b>
      </span>
      <span className="font-serif text-base font-bold text-foreground">
        Total {formatCLP(t.total)}
      </span>
    </div>
  );
}

function ItemsEditor({
  items,
  onChange,
  totales,
}: {
  items: PresupuestoItem[];
  onChange: (items: PresupuestoItem[]) => void;
  totales: { neto: number; iva: number; total: number };
}) {
  const set = (i: number, patch: Partial<PresupuestoItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <div className="flex flex-col gap-4">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-xl border border-border bg-bone-alt/50 p-4"
        >
          <div className="flex items-start gap-3">
            <span className="mt-2 font-mono text-eyebrow text-gold-deep">
              {i + 1}
            </span>
            <div className="flex flex-1 flex-col gap-3">
              <Input
                value={it.descripcion}
                onChange={(e) => set(i, { descripcion: e.target.value })}
                placeholder="Descripción del servicio"
              />
              <Textarea
                value={it.detalle}
                onChange={(e) => set(i, { detalle: e.target.value })}
                rows={2}
                placeholder="Detalle (opcional)"
              />
              <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
                <Input
                  value={it.cantidad}
                  onChange={(e) => set(i, { cantidad: e.target.value })}
                  placeholder="Área / cantidad (ej. 20x20 mts, 8 unidades)"
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={it.valorNeto || ""}
                  onChange={(e) =>
                    set(i, { valorNeto: Number(e.target.value) || 0 })
                  }
                  placeholder="Valor neto CLP"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="mt-1 text-muted-foreground hover:text-destructive"
              aria-label="Eliminar ítem"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, itemVacio()])}
        >
          <Plus className="size-4" /> Agregar ítem
        </Button>
        {items.length > 0 ? <TotalesGrupo t={totales} /> : null}
      </div>
    </div>
  );
}

function ListaTextos({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((txt, i) => (
        <div key={i} className="flex items-start gap-2">
          <Textarea
            value={txt}
            onChange={(e) =>
              onChange(items.map((t, idx) => (idx === i ? e.target.value : t)))
            }
            rows={2}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="mt-2 text-muted-foreground hover:text-destructive"
            aria-label="Eliminar"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => onChange([...items, ""])}
      >
        <Plus className="size-4" /> Agregar
      </Button>
    </div>
  );
}

export function PresupuestoForm({
  presupuestoId,
  contenido,
  versionActual,
}: {
  presupuestoId: string;
  contenido: PresupuestoContenido;
  versionActual: number;
}) {
  const router = useRouter();
  const [c, setC] = useState<PresupuestoContenido>(contenido);
  const [nota, setNota] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const totales = calcularTotales(c);
  const patch = (p: Partial<PresupuestoContenido>) =>
    setC((v) => ({ ...v, ...p }));
  const setCliente = (p: Partial<PresupuestoContenido["cliente"]>) =>
    setC((v) => ({ ...v, cliente: { ...v.cliente, ...p } }));

  const guardar = () =>
    startTransition(async () => {
      setMsg(null);
      const res = await guardarVersion(presupuestoId, c, nota);
      if (res.error) {
        setMsg(res.error);
      } else {
        setNota("");
        setMsg(`Guardado como versión ${res.version}.`);
        router.refresh();
      }
    });

  return (
    <div className="flex flex-col gap-6 pb-28">
      <AdminPanel eyebrow="Encabezado" title="Datos generales">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="emision">Fecha de emisión</Label>
            <Input
              id="emision"
              type="date"
              value={c.emision}
              onChange={(e) => patch({ emision: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="evento">Fecha del evento</Label>
            <Input
              id="evento"
              type="date"
              value={c.evento}
              onChange={(e) => patch({ evento: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vig">Vigencia (días)</Label>
            <Input
              id="vig"
              type="number"
              min={1}
              value={c.vigenciaDias || ""}
              onChange={(e) =>
                patch({ vigenciaDias: Number(e.target.value) || 0 })
              }
            />
          </div>
        </div>
      </AdminPanel>

      <AdminPanel eyebrow="Cliente" title="Datos del cliente">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cli-nombre">Nombre</Label>
            <Input
              id="cli-nombre"
              value={c.cliente.nombre}
              onChange={(e) => setCliente({ nombre: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cli-rut">RUT</Label>
            <Input
              id="cli-rut"
              value={c.cliente.rut}
              onChange={(e) => setCliente({ rut: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cli-email">Correo</Label>
            <Input
              id="cli-email"
              type="email"
              value={c.cliente.email}
              onChange={(e) => setCliente({ email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cli-tel">Teléfono</Label>
            <Input
              id="cli-tel"
              value={c.cliente.telefono}
              onChange={(e) => setCliente({ telefono: e.target.value })}
            />
          </div>
        </div>
      </AdminPanel>

      <AdminPanel eyebrow="I" title="Resumen ejecutivo">
        <Textarea
          value={c.resumen}
          onChange={(e) => patch({ resumen: e.target.value })}
          rows={4}
        />
      </AdminPanel>

      <AdminPanel eyebrow="II" title="Infraestructura base">
        <ItemsEditor
          items={c.itemsBase}
          onChange={(itemsBase) => patch({ itemsBase })}
          totales={totales.base}
        />
      </AdminPanel>

      <AdminPanel eyebrow="III" title="Complementos opcionales">
        <ItemsEditor
          items={c.itemsOpcionales}
          onChange={(itemsOpcionales) => patch({ itemsOpcionales })}
          totales={totales.opcionales}
        />
      </AdminPanel>

      <AdminPanel eyebrow="IV" title="Resumen consolidado">
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor total neto</span>
            <b>{formatCLP(totales.consolidado.neto)}</b>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">IVA total (19%)</span>
            <b>{formatCLP(totales.consolidado.iva)}</b>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-2 font-serif text-base font-bold">
            <span>Valor total del proyecto</span>
            <span>{formatCLP(totales.consolidado.total)}</span>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel eyebrow="V" title="Condiciones comerciales y pago">
        <ListaTextos
          items={c.condiciones}
          onChange={(condiciones) => patch({ condiciones })}
          placeholder="Condición comercial"
        />
      </AdminPanel>

      <AdminPanel eyebrow="VI" title="Logística y cronograma">
        <ListaTextos
          items={c.logistica}
          onChange={(logistica) => patch({ logistica })}
          placeholder="Punto de logística"
        />
      </AdminPanel>

      <AdminPanel eyebrow="VII" title="Consideraciones técnicas">
        <ListaTextos
          items={c.consideraciones}
          onChange={(consideraciones) => patch({ consideraciones })}
          placeholder="Consideración técnica"
        />
      </AdminPanel>

      {/* Barra de guardado */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-bone/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-3 md:px-8">
          <div className="flex flex-col">
            <span className="font-serif text-base font-bold text-foreground">
              {formatCLP(totales.consolidado.total)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              versión actual: v{versionActual} · al guardar → v
              {versionActual + 1}
            </span>
          </div>
          <Input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Nota de cambio (opcional)"
            className="max-w-xs flex-1"
          />
          {msg ? (
            <span className="text-xs text-muted-foreground">{msg}</span>
          ) : null}
          <Button
            type="button"
            onClick={guardar}
            disabled={pending}
            className="ml-auto"
          >
            <Save className="size-4" />
            {pending ? "Guardando…" : "Guardar versión"}
          </Button>
        </div>
      </div>
    </div>
  );
}
