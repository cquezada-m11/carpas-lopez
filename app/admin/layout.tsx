import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LogoutButton } from "@/components/logout-button";

async function AuthGate() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login");
  const email = (data.claims as { email?: string }).email ?? "Administrador";
  return (
    <span className="hidden max-w-[16rem] truncate text-xs text-muted-foreground sm:inline">
      {email}
    </span>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bone-dark">
      <header className="border-b border-border bg-bone">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Link href="/admin" className="font-serif text-base font-bold">
            Carpas López · Panel
          </Link>
          <div className="flex items-center gap-4">
            <Suspense fallback={null}>
              <AuthGate />
            </Suspense>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Ver sitio ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 md:flex-row md:px-8">
        <aside className="w-full shrink-0 md:w-56">
          <Suspense fallback={<div className="h-64" />}>
            <AdminSidebar />
          </Suspense>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
