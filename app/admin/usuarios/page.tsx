import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { hasServiceRole } from "@/lib/supabase/admin";
import { listUsuariosAdmin } from "@/lib/content/admin";
import { InviteUserForm } from "@/components/admin/invite-user-form";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { formatFechaHora } from "@/lib/content/format";

export default function UsuariosAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-heading-lg font-bold">Usuarios</h1>
        <p className="mt-2 text-muted-foreground">
          El registro público está deshabilitado. Invita a tu equipo por correo;
          cada persona define su contraseña desde el enlace de invitación.
        </p>
      </div>

      <InviteUserForm />

      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Lista />
      </Suspense>
    </div>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded border border-dashed border-input px-4 py-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

async function Lista() {
  if (!hasServiceRole()) {
    return (
      <Aviso>
        Para listar e invitar usuarios, configura{" "}
        <code className="font-mono text-foreground">
          SUPABASE_SERVICE_ROLE_KEY
        </code>{" "}
        en las variables de entorno del servidor.
      </Aviso>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const currentId = String((data?.claims as { sub?: string })?.sub ?? "");

  let usuarios;
  try {
    usuarios = await listUsuariosAdmin();
  } catch {
    return <Aviso>No se pudieron cargar los usuarios.</Aviso>;
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded border border-border bg-card shadow-card">
      {usuarios.map((u) => (
        <li key={u.id} className="flex flex-wrap items-center gap-4 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-semibold text-foreground">
                {u.email ?? "—"}
              </span>
              {u.id === currentId ? (
                <span className="font-mono text-[10px] uppercase tracking-wide text-gold-deep">
                  tú
                </span>
              ) : null}
              {!u.confirmado ? (
                <span className="rounded-sm bg-bone-dark px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  invitación pendiente
                </span>
              ) : null}
            </div>
            <span className="text-xs text-muted-foreground">
              Alta {formatFechaHora(u.createdAt) ?? "—"}
              {u.lastSignIn
                ? ` · último acceso ${formatFechaHora(u.lastSignIn)}`
                : " · sin accesos aún"}
            </span>
          </div>
          {u.id !== currentId ? (
            <DeleteUserButton id={u.id} email={u.email} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
