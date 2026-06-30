"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryImage = { url: string; alt: string };

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const total = images.length;

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? i : (i + total - 1) % total)),
    [total],
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % total)),
    [total],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  if (total === 0) return null;
  const [cover, ...rest] = images;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen(0)}
        className="group relative block aspect-[16/9] w-full overflow-hidden rounded bg-bone-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        <Image
          src={cover.url}
          alt={cover.alt}
          fill
          priority
          sizes="(min-width: 1024px) 64rem, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </button>

      {rest.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {rest.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setOpen(i + 1)}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-bone-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      ) : null}

      {open !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galería del proyecto"
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full bg-bone/10 p-2 text-bone hover:bg-bone/20"
          >
            <X className="size-6" />
          </button>

          {total > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Anterior"
              className="absolute left-3 rounded-full bg-bone/10 p-2 text-bone hover:bg-bone/20 md:left-6"
            >
              <ChevronLeft className="size-7" />
            </button>
          ) : null}

          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[open].url}
              alt={images[open].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {total > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Siguiente"
              className="absolute right-3 rounded-full bg-bone/10 p-2 text-bone hover:bg-bone/20 md:right-6"
            >
              <ChevronRight className="size-7" />
            </button>
          ) : null}

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-bone/70">
            {open + 1} / {total}
          </span>
        </div>
      ) : null}
    </div>
  );
}
