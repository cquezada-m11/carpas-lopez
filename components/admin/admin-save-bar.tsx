import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Barra de guardar sticky y consistente para los formularios del admin. */
export function AdminSaveBar({
  ok,
  pending,
  label = "Cambios sin guardar.",
  type = "submit",
  onClick,
}: {
  ok?: boolean;
  pending?: boolean;
  label?: string;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-full border border-border bg-card/95 px-5 py-3 shadow-elevated backdrop-blur">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {ok ? (
          <>
            <CheckCircle2 className="size-4 text-gold-deep" aria-hidden />
            Cambios guardados.
          </>
        ) : (
          label
        )}
      </span>
      <Button type={type} onClick={onClick} disabled={pending}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </Button>
    </div>
  );
}
