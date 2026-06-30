export const ESTADOS_LEAD = [
  "nuevo",
  "contactado",
  "cotizado",
  "cerrado",
  "descartado",
] as const;

export type EstadoLead = (typeof ESTADOS_LEAD)[number];

export function isEstadoLead(value: string): value is EstadoLead {
  return (ESTADOS_LEAD as readonly string[]).includes(value);
}
