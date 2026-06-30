import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Acción primaria — negro sobre hueso (CTA principal del diseño)
        default:
          "bg-primary tracking-[0.02em] text-primary-foreground hover:bg-ink-deep",
        // Acento dorado — CTAs compactos en versalitas (header "Cotizar")
        gold: "bg-gold uppercase tracking-[0.06em] text-ink-deep hover:bg-gold-deep hover:text-bone",
        // Secundario — contorno sobre hueso ("Ver trabajos realizados")
        outline:
          "border border-input bg-transparent text-foreground hover:bg-foreground/5",
        // Sobre fondo oscuro (sección "Por qué elegirnos")
        "outline-dark":
          "border border-gold/40 bg-transparent text-bone hover:bg-bone/5",
        ghost: "hover:bg-foreground/5",
        // Enlace con subrayado dorado (patrón "Ver todos")
        link: "rounded-none border-b border-gold pb-0.5 font-semibold text-gold-deep hover:text-gold",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "px-5 py-3 text-sm",
        sm: "px-3 py-2 text-xs",
        lg: "px-6 py-4 text-sm",
        block: "w-full px-5 py-4 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
