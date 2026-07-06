"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Red de seguridad para los flujos que exigen definir/cambiar contraseña
 * (recovery e invite). Si el enlace aterriza fuera de /auth/update-password
 * (p. ej. en el home, cuando el `redirect_to` apunta a la raíz del Site URL),
 * redirigimos al formulario para que siempre aparezca.
 *
 * - recovery → Supabase emite el evento `PASSWORD_RECOVERY`.
 * - invite   → no hay evento propio (emite `SIGNED_IN`); leemos `type=invite`
 *              de la URL antes de que el cliente consuma el hash.
 * - magiclink / email_change / signup no necesitan formulario: se ignoran.
 */
export function AuthRecoveryHandler() {
  const router = useRouter();

  useEffect(() => {
    // Capturamos el `type` (hash o query) ANTES de que detectSessionInUrl
    // limpie el hash.
    const hashParams = new URLSearchParams(
      window.location.hash.replace(/^#/, ""),
    );
    const type =
      new URL(window.location.href).searchParams.get("type") ??
      hashParams.get("type");
    const isInvite = type === "invite";

    const goToSetPassword = () => {
      if (window.location.pathname !== "/auth/update-password") {
        router.replace("/auth/update-password");
      }
    };

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") goToSetPassword();
      else if (event === "SIGNED_IN" && isInvite) goToSetPassword();
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
