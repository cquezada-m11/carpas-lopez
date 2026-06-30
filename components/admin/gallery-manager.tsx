"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { GripVertical, Star, Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { mediaUrl, type GalleryItem } from "@/lib/content/media";
import { saveGaleria } from "@/app/admin/proyectos/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GalleryManager({
  proyectoId,
  initial,
  initialPortada,
}: {
  proyectoId: string;
  initial: GalleryItem[];
  initialPortada: string | null;
}) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [portada, setPortada] = useState<string | null>(initialPortada);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const supabase = createClient();
  // Portada efectiva: la elegida o la primera de la galería (RF-03).
  const coverPath = portada ?? items[0]?.path ?? null;

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMsg(null);
    const nuevos: GalleryItem[] = [];
    for (const file of Array.from(files)) {
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const path = `proyectos/${proyectoId}/${Date.now()}-${safe}`;
      const { error } = await supabase.storage
        .from("medios")
        .upload(path, file, { upsert: false });
      if (error) {
        setMsg(`Error subiendo ${file.name}: ${error.message}`);
        continue;
      }
      nuevos.push({ path, alt: "" });
    }
    if (nuevos.length > 0) {
      setItems((prev) => [...prev, ...nuevos]);
      setDirty(true);
    }
    setUploading(false);
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    setItems((prev) => {
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDirty(true);
  }

  function remove(index: number) {
    setItems((prev) => {
      const removed = prev[index];
      if (removed?.path === portada) setPortada(null);
      return prev.filter((_, i) => i !== index);
    });
    setDirty(true);
  }

  function setAlt(index: number, alt: string) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, alt } : it)),
    );
    setDirty(true);
  }

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await saveGaleria(proyectoId, items, portada);
      if (res?.error) {
        setMsg(res.error);
      } else {
        setDirty(false);
        setMsg("Galería guardada.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-input px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/5">
          <Upload className="size-4" aria-hidden />
          {uploading ? "Subiendo…" : "Subir imágenes"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        <div className="flex items-center gap-3">
          {dirty ? (
            <span className="font-mono text-eyebrow uppercase text-gold-deep">
              Cambios sin guardar
            </span>
          ) : null}
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={save}
            disabled={pending || !dirty}
          >
            {pending ? "Guardando…" : "Guardar galería"}
          </Button>
        </div>
      </div>

      {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}

      {items.length === 0 ? (
        <p className="rounded-sm border border-dashed border-input px-4 py-10 text-center text-sm text-muted-foreground">
          Sin imágenes todavía. Sube al menos una; la primera será la portada si
          no eliges otra.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const url = mediaUrl(item.path);
            const esPortada = item.path === coverPath;
            return (
              <li
                key={item.path}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) reorder(dragIndex, index);
                  setDragIndex(null);
                }}
                className={cn(
                  "flex flex-col gap-2 rounded border border-border bg-card p-2 shadow-card",
                  dragIndex === index && "opacity-50",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-bone-dark">
                  {url ? (
                    <Image
                      src={url}
                      alt={item.alt || "Imagen del proyecto"}
                      fill
                      sizes="(min-width: 1024px) 20rem, 50vw"
                      className="object-cover"
                    />
                  ) : null}
                  {esPortada ? (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm bg-gold px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-deep">
                      <Star className="size-3" aria-hidden /> Portada
                    </span>
                  ) : null}
                  <span className="absolute right-2 top-2 cursor-grab rounded-sm bg-ink/60 p-1 text-bone">
                    <GripVertical className="size-4" aria-hidden />
                  </span>
                </div>
                <input
                  value={item.alt ?? ""}
                  onChange={(e) => setAlt(index, e.target.value)}
                  placeholder="Texto alternativo"
                  className="w-full rounded-sm border border-input bg-bone px-2 py-1.5 text-xs text-foreground focus-visible:border-gold focus-visible:outline-none"
                />
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPortada(item.path)}
                    disabled={esPortada}
                  >
                    <Star className="size-3.5" aria-hidden /> Portada
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" aria-hidden /> Quitar
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
