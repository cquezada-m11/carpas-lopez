"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Red de seguridad para el flujo de recuperación de contraseña. Cuando Supabase
 * detecta un enlace de recovery (evento `PASSWORD_RECOVERY`), la sesión queda
 * activa en cualquier página donde haya aterrizado el link (p. ej. el home si el
 * `redirectTo` no matcheó la allowlist). Aquí redirigimos a la pantalla de
 * cambio de contraseña para que siempre aparezca el formulario.
 */
export function AuthRecoveryHandler() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "PASSWORD_RECOVERY" &&
        window.location.pathname !== "/auth/update-password"
      ) {
        router.replace("/auth/update-password");
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
