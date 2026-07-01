"use client";

import { useState, useTransition } from "react";
import { Link2 } from "lucide-react";
import { importImageFromUrl } from "@/app/admin/media/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Importa una imagen desde una URL (directa o de un post con og:image, ej.
 * Instagram) y devuelve el path guardado en Storage. Reutilizable en cualquier
 * campo/galería de imágenes.
 */
export function UrlImageImport({
  folder,
  onImported,
}: {
  folder: string;
  onImported: (path: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function importar() {
    const value = url.trim();
    if (!value) return;
    setError(null);
    start(async () => {
      const res = await importImageFromUrl(folder, value);
      if (res.error) {
        setError(res.error);
      } else if (res.path) {
        onImported(res.path);
        setUrl("");
        setOpen(false);
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-gold-deep hover:text-gold"
      >
        <Link2 className="size-3.5" /> Importar desde URL
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              importar();
            }
          }}
          placeholder="Pega una URL de imagen o de un post…"
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={importar}
            disabled={pending || !url.trim()}
          >
            {pending ? "Importando…" : "Importar"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <p className="text-xs text-muted-foreground">
        Funciona con enlaces directos de imagen y con posts públicos (Instagram
        puede fallar; en ese caso usa el enlace directo a la foto).
      </p>
    </div>
  );
}
