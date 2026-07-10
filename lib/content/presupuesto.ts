/**
 * Modelo del contenido de un presupuesto (lo que se guarda como JSONB en cada
 * versión) + textos por defecto tomados del documento base de Carpas López.
 * El IVA (19%) y los totales NO se guardan: se calculan siempre desde el neto.
 */

export const IVA_RATE = 0.19;

export type PresupuestoItem = {
  descripcion: string;
  detalle: string;
  cantidad: string; // libre: "20x20 mts (400 m²)", "8 unidades", etc.
  valorNeto: number; // CLP, neto
};

export type PresupuestoContenido = {
  emision: string; // YYYY-MM-DD
  evento: string; // YYYY-MM-DD o ""
  vigenciaDias: number;
  cliente: {
    nombre: string;
    rut: string;
    email: string;
    telefono: string;
  };
  resumen: string; // I
  itemsBase: PresupuestoItem[]; // II
  itemsOpcionales: PresupuestoItem[]; // III
  condiciones: string[]; // V
  logistica: string[]; // VI
  consideraciones: string[]; // VII
};

export function itemVacio(): PresupuestoItem {
  return { descripcion: "", detalle: "", cantidad: "", valorNeto: 0 };
}

/** Textos por defecto (del documento base). Todos editables por presupuesto. */
export const RESUMEN_DEFAULT =
  "El presente documento detalla la propuesta económica y técnica para la provisión, montaje y desmontaje de infraestructura temporal para el evento. Nuestro servicio garantiza estructuras modulares de alta resistencia e impermeabilidad total para la seguridad y comodidad de los asistentes.";

export const CONDICIONES_DEFAULT: string[] = [
  "Reserva de fecha y equipos: para proceder con el bloqueo de inventario y asegurar la ejecución del servicio, se requiere el pago anticipado del 50% del valor total de los ítems finalmente contratados.",
  "Saldo restante: el 50% restante deberá ser cancelado de forma íntegra al momento de finalizar el montaje de las estructuras en el terreno, previo al inicio del evento.",
  "Facturación: el servicio cuenta con emisión de factura electrónica tras la confirmación de la reserva y recepción de los datos de facturación del cliente.",
];

export const LOGISTICA_DEFAULT: string[] = [
  "Fase de montaje: se requerirá acceso exclusivo al recinto durante 1 a 2 días previos al evento para el levantamiento seguro de estructuras y la fijación de los revestimientos opcionales contratados.",
  "Día del evento: operación normal de toda la infraestructura contratada.",
  "Fase de desmontaje: se estipula 1 día posterior al evento para el retiro total de los materiales, equipos y limpieza del área ocupada.",
];

export const CONSIDERACIONES_DEFAULT: string[] = [
  "Fijación de estructuras (anclaje): por motivos de estabilidad y resistencia al viento, los pilares de las carpas van estacados directamente al suelo. El cliente debe garantizar que el terreno permita esta perforación. En superficies no perforables (concreto, asfalto o porcelanato), deberá avisar para evaluar contrapesos técnicos, lo que podría generar costos logísticos adicionales.",
  "Operación de calefacción: el ítem de climatización contempla el arriendo y posicionamiento de las estufas de exterior. El suministro de combustible (gas) se rige bajo los términos comerciales acordados.",
  "Accesos y permisos: el cliente será responsable de gestionar las autorizaciones de acceso para los camiones de carga y el personal técnico durante el montaje y desmontaje.",
];

/** Contenido inicial de un presupuesto nuevo (con los defaults del documento). */
export function contenidoInicial(
  seed?: Partial<PresupuestoContenido>,
): PresupuestoContenido {
  return {
    emision: seed?.emision ?? "",
    evento: seed?.evento ?? "",
    vigenciaDias: seed?.vigenciaDias ?? 7,
    cliente: {
      nombre: seed?.cliente?.nombre ?? "",
      rut: seed?.cliente?.rut ?? "",
      email: seed?.cliente?.email ?? "",
      telefono: seed?.cliente?.telefono ?? "",
    },
    resumen: seed?.resumen ?? RESUMEN_DEFAULT,
    itemsBase: seed?.itemsBase ?? [],
    itemsOpcionales: seed?.itemsOpcionales ?? [],
    condiciones: seed?.condiciones ?? [...CONDICIONES_DEFAULT],
    logistica: seed?.logistica ?? [...LOGISTICA_DEFAULT],
    consideraciones: seed?.consideraciones ?? [...CONSIDERACIONES_DEFAULT],
  };
}

export type GrupoTotales = { neto: number; iva: number; total: number };

function totalesDe(items: PresupuestoItem[]): GrupoTotales {
  const neto = items.reduce((acc, it) => acc + (Number(it.valorNeto) || 0), 0);
  const iva = Math.round(neto * IVA_RATE);
  return { neto, iva, total: neto + iva };
}

/** Totales por grupo (base / opcionales) y consolidado. Todo derivado del neto. */
export function calcularTotales(c: PresupuestoContenido) {
  const base = totalesDe(c.itemsBase);
  const opcionales = totalesDe(c.itemsOpcionales);
  const neto = base.neto + opcionales.neto;
  const iva = Math.round(neto * IVA_RATE);
  return {
    base,
    opcionales,
    consolidado: { neto, iva, total: neto + iva } as GrupoTotales,
  };
}

/** Formatea CLP: 2400000 → "$2.400.000". */
export function formatCLP(monto: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(monto || 0));
}

export const ESTADOS_PRESUPUESTO = [
  "borrador",
  "emitido",
  "aceptado",
  "rechazado",
] as const;
export type EstadoPresupuesto = (typeof ESTADOS_PRESUPUESTO)[number];

export function isEstadoPresupuesto(v: string): v is EstadoPresupuesto {
  return (ESTADOS_PRESUPUESTO as readonly string[]).includes(v);
}
