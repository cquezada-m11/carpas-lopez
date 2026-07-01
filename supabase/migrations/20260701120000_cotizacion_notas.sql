-- Notas internas como bitácora (N por lead), con autor y fecha.
create table public.cotizacion_notas (
  id uuid primary key default gen_random_uuid(),
  cotizacion_id uuid not null references public.cotizaciones (id) on delete cascade,
  autor_id uuid references auth.users (id) on delete set null,
  autor text, -- snapshot del email/nombre del admin (por si se elimina el usuario)
  contenido text not null,
  created_at timestamptz not null default now()
);
comment on table public.cotizacion_notas is 'Bitácora de notas internas por cotización (solo admin).';

create index cotizacion_notas_cotizacion_idx
  on public.cotizacion_notas (cotizacion_id, created_at);

-- RLS: solo admins autenticados. El público nunca ve ni escribe notas.
alter table public.cotizacion_notas enable row level security;
create policy "cotizacion_notas_auth_all" on public.cotizacion_notas
  for all to authenticated using (true) with check (true);

-- Migra la nota única existente a la bitácora y elimina la columna vieja.
insert into public.cotizacion_notas (cotizacion_id, contenido, autor, created_at)
select id, notas, 'Sistema', coalesce(updated_at, created_at)
from public.cotizaciones
where notas is not null and btrim(notas) <> '';

alter table public.cotizaciones drop column if exists notas;
