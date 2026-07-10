import { ImageResponse } from "next/og";

export const alt = "Carpas López — Arriendo, diseño y montaje de carpas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOGO =
  "https://fqkozbriqaypcjarmsnx.supabase.co/storage/v1/object/public/medios/config/1782793409762-logo.png";

/** Imagen de previsualización (Open Graph / WhatsApp / X) con la marca. */
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        background: "#141414",
        color: "#f5f2ea",
        fontFamily: "sans-serif",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO}
        width={240}
        height={190}
        alt=""
        style={{ objectFit: "contain" }}
      />
      <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: -1 }}>
        Carpas López
      </div>
      <div style={{ width: 96, height: 4, background: "#c9a24b" }} />
      <div
        style={{
          fontSize: 28,
          color: "#c9a24b",
          letterSpacing: 8,
          textTransform: "uppercase",
        }}
      >
        Arriendo · Diseño · Montaje de carpas
      </div>
    </div>,
    { ...size },
  );
}
