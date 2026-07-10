-- Presupuestos (documento formal con precios, opcionalmente ligado a una
-- cotización). Versionado: cada guardado inserta una fila en
-- presupuesto_versiones con el snapshot JSONB completo; el "actual" es la
-- versión mayor. El PDF se genera al vuelo desde el contenido (no se almacena).

create sequence if not exists public.presupuesto_numero_seq;

create table if not exists public.presupuestos (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique default (
    'P-'
    || to_char(now(), 'YYYY')
    || '-'
    || lpad(nextval('public.presupuesto_numero_seq')::text, 4, '0')
  ),
  cotizacion_id uuid references public.cotizaciones (id) on delete set null,
  estado text not null default 'borrador', -- borrador | emitido | aceptado | rechazado
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  deleted_at timestamptz
);

create table if not exists public.presupuesto_versiones (
  id uuid primary key default gen_random_uuid(),
  presupuesto_id uuid not null references public.presupuestos (id) on delete cascade,
  version int not null,
  contenido jsonb not null,
  nota text,
  autor text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (presupuesto_id, version)
);

create index if not exists presupuesto_versiones_pid_idx
  on public.presupuesto_versiones (presupuesto_id, version desc);

create index if not exists presupuestos_cotizacion_idx
  on public.presupuestos (cotizacion_id);

-- RLS: solo usuarios autenticados (admin) gestionan presupuestos.
alter table public.presupuestos enable row level security;
alter table public.presupuesto_versiones enable row level security;

create policy "presupuestos auth all" on public.presupuestos
  for all to authenticated using (true) with check (true);

create policy "presupuesto_versiones auth all" on public.presupuesto_versiones
  for all to authenticated using (true) with check (true);
