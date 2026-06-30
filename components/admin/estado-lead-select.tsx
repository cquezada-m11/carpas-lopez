"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { setEstadoCotizacion } from "@/app/admin/cotizaciones/actions";
import { ESTADOS_LEAD } from "@/lib/content/lead-estado";

export function EstadoLeadSelect({
  id,
  estado,
}: {
  id: string;
  estado: string;
}) {
  const [pending, start] = useTransition();
  return (
    <Select
      defaultValue={ESTADOS_LEAD.includes(estado as never) ? estado : "nuevo"}
      disabled={pending}
      className="max-w-[11rem]"
      onChange={(e) => {
        const value = e.target.value;
        start(() => setEstadoCotizacion(id, value));
      }}
    >
      {ESTADOS_LEAD.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
