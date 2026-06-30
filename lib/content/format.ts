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
