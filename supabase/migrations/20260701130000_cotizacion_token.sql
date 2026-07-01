-- Token público (no adivinable) para exponer el detalle de una cotización por
-- URL: /cotizacion/<token>. Un UUID v4 es suficiente (122 bits) para que el
-- enlace no sea enumerable; la lectura pública se hace por token, no por id.
alter table public.cotizaciones
  add column if not exists token uuid not null default gen_random_uuid();

create unique index if not exists cotizaciones_token_key
  on public.cotizaciones (token);
