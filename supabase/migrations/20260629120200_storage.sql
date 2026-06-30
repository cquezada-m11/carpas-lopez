-- ============================================================
-- Carpas López — Fase 1: Storage
-- Bucket `medios` con lectura pública y escritura solo para admin.
-- Convención de paths: proyectos/{id}/..., config/..., home/...
-- ============================================================

insert into storage.buckets (id, name, public)
values ('medios', 'medios', true)
on conflict (id) do nothing;

-- Lectura pública (el bucket es público; la policy permite listar vía API).
create policy "medios_public_read" on storage.objects
  for select to anon using (bucket_id = 'medios');
create policy "medios_auth_read" on storage.objects
  for select to authenticated using (bucket_id = 'medios');

-- Escritura/borrado solo para administradores autenticados.
create policy "medios_auth_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'medios');
create policy "medios_auth_update" on storage.objects
  for update to authenticated using (bucket_id = 'medios') with check (bucket_id = 'medios');
create policy "medios_auth_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'medios');
