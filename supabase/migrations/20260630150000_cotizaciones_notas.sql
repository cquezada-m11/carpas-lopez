-- Notas internas y marca de última actualización para la gestión de leads.
alter table public.cotizaciones
  add column if not exists notas text,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists cotizaciones_set_updated_at on public.cotizaciones;
create trigger cotizaciones_set_updated_at
  before update on public.cotizaciones
  for each row execute function public.set_updated_at();
