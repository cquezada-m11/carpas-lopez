type Props = { name: string; className?: string };

/** Íconos de línea por tipo de carpa (heredan el color vía currentColor). */
export function TentIcon({ name, className }: Props) {
  const svg = {
    className,
    viewBox: "0 0 48 48",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "transparente":
      return (
        <svg {...svg}>
          <path d="M6 28 Q6 11 24 11 Q42 11 42 28" />
          <path d="M24 11 V5" />
          <path d="M11 28 V40 M37 28 V40" />
          <path d="M6 28 H42" />
        </svg>
      );
    case "estructural":
      return (
        <svg {...svg}>
          <path d="M6 24 L24 15 L42 24" />
          <path d="M6 24 H42" />
          <path d="M24 15 V24 M15 19.5 V24 M33 19.5 V24" />
          <path d="M9 24 V40 M39 24 V40" />
        </svg>
      );
    case "pagoda":
      return (
        <svg {...svg}>
          <path d="M7 27 L24 6 L41 27" />
          <path d="M24 6 V2" />
          <path d="M7 27 Q15 23 24 23 Q33 23 41 27" />
          <path d="M13 27 V40 M35 27 V40" />
        </svg>
      );
    case "galpon":
      return (
        <svg {...svg}>
          <path d="M6 21 L24 11 L42 21" />
          <path d="M7 21 V41 M41 21 V41" />
          <path d="M7 41 H41" />
          <path d="M20 41 V31 H28 V41" />
        </svg>
      );
    default:
      return (
        <svg {...svg}>
          <path d="M6 28 L24 10 L42 28" />
          <path d="M10 28 V40 M38 28 V40" />
          <path d="M6 28 H42" />
        </svg>
      );
  }
}
