/** Formatea una fecha ISO (`YYYY-MM-DD`) como "Marzo 2026". Null si es inválida. */
export function formatFechaLarga(fecha: string | null): string | null {
  if (!fecha) return null;
  const d = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const texto = new Intl.DateTimeFormat("es-CL", {
    month: "long",
    year: "numeric",
  }).format(d);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Fecha corta es-CL: "15-03-2026". */
export function formatFechaCorta(fecha: string | null): string | null {
  if (!fecha) return null;
  const d = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/** Fecha y hora desde un timestamp ISO: "15-03-2026 14:30". */
export function formatFechaHora(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
