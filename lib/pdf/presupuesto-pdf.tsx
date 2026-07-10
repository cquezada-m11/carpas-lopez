import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import {
  calcularTotales,
  formatCLP,
  type PresupuestoContenido,
  type PresupuestoItem,
  type GrupoTotales,
} from "@/lib/content/presupuesto";

const C = {
  ink: "#1a1a1a",
  gold: "#c9a24b",
  goldDeep: "#9a7d33",
  bone: "#f5f2ea",
  boneAlt: "#efebe0",
  muted: "#6b6552",
  border: "#e3ddcf",
  white: "#ffffff",
};

const s = StyleSheet.create({
  page: {
    paddingTop: 96,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: C.ink,
    lineHeight: 1.5,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 26,
    paddingHorizontal: 40,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: C.gold,
  },
  logo: { height: 44, objectFit: "contain" },
  brandFallback: { fontFamily: "Times-Bold", fontSize: 15, color: C.ink },
  headerRight: { flexDirection: "column", alignItems: "flex-end" },
  headerTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.2,
    color: C.goldDeep,
    marginBottom: 4,
  },
  headerMeta: { fontSize: 8, color: C.muted },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: C.muted,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 6,
  },
  eyebrow: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    letterSpacing: 1.5,
    color: C.goldDeep,
    marginBottom: 3,
  },
  h2: { fontFamily: "Times-Bold", fontSize: 15, color: C.ink },
  section: { marginTop: 18 },
  para: { color: C.muted, marginTop: 4 },
  cliente: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    backgroundColor: C.boneAlt,
    borderRadius: 4,
    padding: 10,
  },
  clienteItem: { width: "50%", fontSize: 9 },
  clienteLabel: { color: C.muted },
  // Tabla
  tHead: {
    flexDirection: "row",
    backgroundColor: C.ink,
    color: C.bone,
    paddingVertical: 5,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  tHeadCell: { fontFamily: "Helvetica-Bold", fontSize: 7.5, color: C.bone },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  cNum: { width: 20, fontSize: 8, color: C.muted },
  cDesc: { flexGrow: 1, flexBasis: 0, paddingRight: 6 },
  cCant: { width: 92, fontSize: 8.5 },
  cNum2: { width: 66, fontSize: 8.5, textAlign: "right" },
  cIva: { width: 54, fontSize: 8.5, textAlign: "right", color: C.muted },
  cTot: {
    width: 70,
    fontSize: 8.5,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },
  itemDesc: { fontFamily: "Helvetica-Bold", fontSize: 9 },
  itemDetalle: { fontSize: 8, color: C.muted, marginTop: 1 },
  totalsBox: { marginTop: 8, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  totalLabel: { fontSize: 8.5, color: C.muted, textAlign: "right", width: 220 },
  totalVal: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    width: 90,
  },
  consol: {
    marginTop: 10,
    backgroundColor: C.ink,
    borderRadius: 6,
    padding: 14,
  },
  consolRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  consolLabel: { color: C.bone, opacity: 0.75, fontSize: 9 },
  consolVal: { color: C.bone, fontSize: 9, fontFamily: "Helvetica-Bold" },
  consolTotalLabel: {
    color: C.gold,
    fontFamily: "Times-Bold",
    fontSize: 12,
  },
  consolTotalVal: { color: C.gold, fontFamily: "Times-Bold", fontSize: 12 },
  bullet: { flexDirection: "row", marginTop: 6 },
  bulletDot: { color: C.gold, marginRight: 6 },
  bulletText: { flexGrow: 1, flexBasis: 0, color: C.ink },
  empty: { fontSize: 8.5, color: C.muted, fontStyle: "italic", marginTop: 6 },
});

function fechaLarga(iso: string): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  const t = new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  return t;
}

function Tabla({ items }: { items: PresupuestoItem[] }) {
  if (items.length === 0) {
    return <Text style={s.empty}>Sin ítems.</Text>;
  }
  return (
    <View>
      <View style={s.tHead}>
        <Text style={[s.tHeadCell, s.cNum]}>N°</Text>
        <Text style={[s.tHeadCell, s.cDesc]}>Descripción</Text>
        <Text style={[s.tHeadCell, s.cCant]}>Área / cantidad</Text>
        <Text style={[s.tHeadCell, s.cNum2]}>Neto</Text>
        <Text style={[s.tHeadCell, s.cIva]}>IVA 19%</Text>
        <Text style={[s.tHeadCell, s.cTot]}>Total</Text>
      </View>
      {items.map((it, i) => {
        const iva = Math.round((Number(it.valorNeto) || 0) * 0.19);
        return (
          <View key={i} style={s.row} wrap={false}>
            <Text style={s.cNum}>{i + 1}</Text>
            <View style={s.cDesc}>
              <Text style={s.itemDesc}>{it.descripcion || "—"}</Text>
              {it.detalle ? (
                <Text style={s.itemDetalle}>{it.detalle}</Text>
              ) : null}
            </View>
            <Text style={s.cCant}>{it.cantidad || "—"}</Text>
            <Text style={s.cNum2}>{formatCLP(it.valorNeto)}</Text>
            <Text style={s.cIva}>{formatCLP(iva)}</Text>
            <Text style={s.cTot}>{formatCLP((it.valorNeto || 0) + iva)}</Text>
          </View>
        );
      })}
    </View>
  );
}

function TotalesGrupo({ t, etiqueta }: { t: GrupoTotales; etiqueta: string }) {
  return (
    <View style={s.totalsBox}>
      <View style={s.totalRow}>
        <Text style={s.totalLabel}>Subtotal neto {etiqueta}</Text>
        <Text style={s.totalVal}>{formatCLP(t.neto)}</Text>
      </View>
      <View style={s.totalRow}>
        <Text style={s.totalLabel}>IVA (19%)</Text>
        <Text style={s.totalVal}>{formatCLP(t.iva)}</Text>
      </View>
      <View style={s.totalRow}>
        <Text style={s.totalLabel}>Total {etiqueta} (IVA incluido)</Text>
        <Text style={s.totalVal}>{formatCLP(t.total)}</Text>
      </View>
    </View>
  );
}

function Lista({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View>
      {items.map((txt, i) => (
        <View key={i} style={s.bullet} wrap={false}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}>{txt}</Text>
        </View>
      ))}
    </View>
  );
}

function Seccion({
  n,
  titulo,
  children,
}: {
  n: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.section}>
      <Text style={s.eyebrow}>{n}</Text>
      <Text style={s.h2}>{titulo}</Text>
      {children}
    </View>
  );
}

export function PresupuestoPDF({
  numero,
  contenido,
  logo,
}: {
  numero: string;
  contenido: PresupuestoContenido;
  logo?: string;
}) {
  const c = contenido;
  const t = calcularTotales(c);
  const cli = c.cliente;

  return (
    <Document title={numero} author="Carpas López">
      <Page size="A4" style={s.page}>
        <View style={s.header} fixed>
          {logo ? (
            <Image src={logo} style={s.logo} />
          ) : (
            <Text style={s.brandFallback}>Carpas López</Text>
          )}
          <View style={s.headerRight}>
            <Text style={s.headerTitle}>
              SERVICIO DE MONTAJE Y ARRIENDO DE CARPAS
            </Text>
            <Text style={s.headerMeta}>
              Emisión: {fechaLarga(c.emision)} · Evento: {fechaLarga(c.evento)}{" "}
              · Vigencia: {c.vigenciaDias} días
            </Text>
            <Text style={s.headerMeta}>Presupuesto {numero}</Text>
          </View>
        </View>

        <Text
          style={s.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `CARPAS LÓPEZ    ·    ${numero}    ·    ${pageNumber} / ${totalPages}`
          }
        />

        {/* Cliente */}
        {cli.nombre || cli.rut || cli.email || cli.telefono ? (
          <View style={s.cliente}>
            <Text style={s.clienteItem}>
              <Text style={s.clienteLabel}>Cliente: </Text>
              {cli.nombre || "—"}
            </Text>
            <Text style={s.clienteItem}>
              <Text style={s.clienteLabel}>RUT: </Text>
              {cli.rut || "—"}
            </Text>
            <Text style={s.clienteItem}>
              <Text style={s.clienteLabel}>Correo: </Text>
              {cli.email || "—"}
            </Text>
            <Text style={s.clienteItem}>
              <Text style={s.clienteLabel}>Teléfono: </Text>
              {cli.telefono || "—"}
            </Text>
          </View>
        ) : null}

        <Seccion n="I" titulo="Resumen ejecutivo del servicio">
          <Text style={s.para}>{c.resumen}</Text>
        </Seccion>

        <Seccion n="II" titulo="Propuesta económica: infraestructura base">
          <Tabla items={c.itemsBase} />
          {c.itemsBase.length > 0 ? (
            <TotalesGrupo t={t.base} etiqueta="infraestructura base" />
          ) : null}
        </Seccion>

        <Seccion n="III" titulo="Complementos opcionales">
          <Tabla items={c.itemsOpcionales} />
          {c.itemsOpcionales.length > 0 ? (
            <TotalesGrupo t={t.opcionales} etiqueta="complementos" />
          ) : null}
        </Seccion>

        <Seccion n="IV" titulo="Resumen consolidado del proyecto">
          <View style={s.consol}>
            <View style={s.consolRow}>
              <Text style={s.consolLabel}>Valor total neto consolidado</Text>
              <Text style={s.consolVal}>{formatCLP(t.consolidado.neto)}</Text>
            </View>
            <View style={s.consolRow}>
              <Text style={s.consolLabel}>I.V.A. total (19%)</Text>
              <Text style={s.consolVal}>{formatCLP(t.consolidado.iva)}</Text>
            </View>
            <View style={[s.consolRow, { marginBottom: 0, marginTop: 4 }]}>
              <Text style={s.consolTotalLabel}>
                Valor total del proyecto (IVA incluido)
              </Text>
              <Text style={s.consolTotalVal}>
                {formatCLP(t.consolidado.total)}
              </Text>
            </View>
          </View>
        </Seccion>

        <Seccion n="V" titulo="Condiciones comerciales y forma de pago">
          <Lista items={c.condiciones} />
        </Seccion>

        <Seccion n="VI" titulo="Planificación logística y cronograma">
          <Lista items={c.logistica} />
        </Seccion>

        <Seccion n="VII" titulo="Consideraciones técnicas relevantes">
          <Lista items={c.consideraciones} />
        </Seccion>
      </Page>
    </Document>
  );
}

/** Renderiza el presupuesto a un Buffer PDF. */
export function renderPresupuestoPDF(props: {
  numero: string;
  contenido: PresupuestoContenido;
  logo?: string;
}): Promise<Buffer> {
  return renderToBuffer(<PresupuestoPDF {...props} />);
}
