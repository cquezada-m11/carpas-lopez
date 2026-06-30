-- ============================================================
-- Carpas López — Fase 1: Row Level Security
-- Público (anon) lee solo contenido publicado y los singletons.
-- Admin (authenticated) tiene CRUD completo.
-- ============================================================

alter table public.configuracion_global enable row level security;
alter table public.home enable row level security;
alter table public.proyectos enable row level security;
alter table public.servicios enable row level security;
alter table public.cotizaciones enable row level security;

-- --- configuracion_global (singleton) ---
create policy "config_public_read" on public.configuracion_global
  for select to anon using (true);
create policy "config_auth_read" on public.configuracion_global
  for select to authenticated using (true);
create policy "config_auth_update" on public.configuracion_global
  for update to authenticated using (true) with check (true);

-- --- home (singleton) ---
create policy "home_public_read" on public.home
  for select to anon using (true);
create policy "home_auth_read" on public.home
  for select to authenticated using (true);
create policy "home_auth_update" on public.home
  for update to authenticated using (true) with check (true);

-- --- proyectos (colección) ---
create policy "proyectos_public_read" on public.proyectos
  for select to anon using (estado = 'publicado');
create policy "proyectos_auth_read" on public.proyectos
  for select to authenticated using (true);
create policy "proyectos_auth_write" on public.proyectos
  for all to authenticated using (true) with check (true);

-- --- servicios (colección) ---
create policy "servicios_public_read" on public.servicios
  for select to anon using (estado = 'publicado');
create policy "servicios_auth_read" on public.servicios
  for select to authenticated using (true);
create policy "servicios_auth_write" on public.servicios
  for all to authenticated using (true) with check (true);

-- --- cotizaciones (leads) ---
-- El público solo puede INSERTAR; nunca leer leads ajenos.
create policy "cotizaciones_anon_insert" on public.cotizaciones
  for insert to anon with check (true);
create policy "cotizaciones_auth_insert" on public.cotizaciones
  for insert to authenticated with check (true);
create policy "cotizaciones_auth_read" on public.cotizaciones
  for select to authenticated using (true);
create policy "cotizaciones_auth_update" on public.cotizaciones
  for update to authenticated using (true) with check (true);
