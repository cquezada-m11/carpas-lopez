import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-bold uppercase tracking-[0.1em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Etiqueta de segmento sobre la foto del proyecto (badge dorado)
        default: "bg-gold px-2 py-1 text-[9px] text-ink-deep",
        // Variante sobria sobre claro
        outline:
          "border border-input px-2.5 py-1 text-[10px] text-muted-foreground",
        // Sobre fondo oscuro
        dark: "bg-ink/40 px-2 py-1 text-[9px] text-bone",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
