import {
  Clock,
  ShieldCheck,
  MapPin,
  Sparkles,
  Ruler,
  Handshake,
  Truck,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";

/** Mapa de nombres (almacenados en la DB) a íconos lucide. */
const ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  "shield-check": ShieldCheck,
  "map-pin": MapPin,
  ruler: Ruler,
  handshake: Handshake,
  truck: Truck,
  "calendar-check": CalendarCheck,
};

export function FeatureIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && ICONS[name]) || Sparkles;
  return <Icon className={className} aria-hidden />;
}
