import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTestimonioAdmin } from "@/lib/content/admin";
import { deleteTestimonio } from "@/app/admin/testimonios/actions";
import { TestimonioForm } from "@/components/admin/testimonio-form";
import { AdminDeleteSection } from "@/components/admin/admin-delete-section";
import { EstadoBadge } from "@/components/admin/estado-badge";

export default function EditarTestimonioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonio = await getTestimonioAdmin(id);
  if (!testimonio) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/testimonios"
          className="flex w-fit items-center gap-1.5 font-mono text-eyebrow uppercase text-gold-deep hover:text-gold"
        >
          <ArrowLeft className="size-3.5" /> Testimonios
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-heading-lg font-bold">
            {testimonio.autor}
          </h1>
          <EstadoBadge estado={testimonio.estado} />
        </div>
      </div>

      <TestimonioForm testimonio={testimonio} />

      <AdminDeleteSection
        action={deleteTestimonio.bind(null, testimonio.id)}
        entidad="testimonio"
      />
    </div>
  );
}
