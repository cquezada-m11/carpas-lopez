-- Soft delete de cotizaciones: en vez de borrar la fila se marca `deleted_at`.
-- El listado del admin, los conteos y el detalle público filtran las archivadas;
-- se pueden restaurar poniendo deleted_at = null.
alter table public.cotizaciones
  add column if not exists deleted_at timestamptz;

create index if not exists cotizaciones_deleted_at_idx
  on public.cotizaciones (deleted_at);
