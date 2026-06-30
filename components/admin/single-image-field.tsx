"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { mediaUrl } from "@/lib/content/media";

/** Campo de imagen única: sube a Storage y expone el path en un input oculto. */
export function SingleImageField({
  name,
  folder,
  initialPath,
}: {
  name: string;
  folder: string;
  initialPath: string | null;
}) {
  const [path, setPath] = useState<string | null>(initialPath);
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
      <input type="hidden" name={name} value={path ?? ""} />
      {url ? (
        <div className="relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-sm border border-border bg-bone-dark">
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
            className="absolute right-2 top-2 rounded-sm bg-ink/70 p-1 text-bone hover:bg-ink"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}
      <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-sm border border-input px-3.5 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/5">
        <Upload className="size-4" aria-hidden />
        {uploading ? "Subiendo…" : url ? "Cambiar imagen" : "Subir imagen"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
