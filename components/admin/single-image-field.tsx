"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { mediaUrl } from "@/lib/content/media";
import { UrlImageImport } from "@/components/admin/url-image-import";

/**
 * Campo de imagen única: sube a Storage y guarda el path.
 * - Modo formulario (por defecto): expone el path en un input oculto `name`.
 * - Modo controlado: pasa `value` + `onChange` y se omite el input oculto.
 */
export function SingleImageField({
  name,
  folder,
  initialPath,
  accept = "image/*",
  value,
  onChange,
}: {
  name?: string;
  folder: string;
  initialPath?: string | null;
  accept?: string;
  value?: string | null;
  onChange?: (path: string | null) => void;
}) {
  const controlled = typeof onChange === "function";
  const [internal, setInternal] = useState<string | null>(initialPath ?? null);
  const path = controlled ? (value ?? null) : internal;
  const setPath = (p: string | null) => {
    if (controlled) onChange!(p);
    else setInternal(p);
  };

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const url = mediaUrl(path);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const dest = `${folder}/${Date.now()}-${safe}`;
    const { error: upErr } = await supabase.storage
      .from("medios")
      .upload(dest, file, { upsert: false });
    if (upErr) {
      setError(upErr.message);
    } else {
      setPath(dest);
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {!controlled && name ? (
        <input type="hidden" name={name} value={path ?? ""} />
      ) : null}
      {url ? (
        <div className="relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-xl border border-border bg-bone-dark">
          <Image
            src={url}
            alt="Imagen"
            fill
            sizes="24rem"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => setPath(null)}
            aria-label="Quitar imagen"
            className="absolute right-2 top-2 rounded-full bg-ink/70 p-1 text-bone hover:bg-ink"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}
      <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-input px-3.5 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/5">
        <Upload className="size-4" aria-hidden />
        {uploading ? "Subiendo…" : url ? "Cambiar imagen" : "Subir imagen"}
        <input
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading}
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
      <UrlImageImport folder={folder} onImported={setPath} />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
