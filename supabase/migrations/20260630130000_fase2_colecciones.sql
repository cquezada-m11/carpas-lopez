-- ============================================================
-- Carpas López — Fase 2: colecciones TipoCarpa y Testimonio
-- Mismo patrón que proyectos/servicios: columna estado + RLS.
-- ============================================================

create table public.tipos_carpa (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  imagen_path text,
  dimensiones_disponibles text,
  capacidad_referencial text,
  material_lona text,
  usos_recomendados text[] not null default '{}',
  descripcion text,
  orden integer not null default 0,
  estado public.estado_contenido not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.tipos_carpa is 'Colección: catálogo de modelos de carpa con especificaciones.';

create index tipos_carpa_estado_orden_idx on public.tipos_carpa (estado, orden);

create trigger tipos_carpa_set_updated_at
  before update on public.tipos_carpa
  for each row execute function public.set_updated_at();

create table public.testimonios (
  id uuid primary key default gen_random_uuid(),
  autor text not null,
  cargo text,
  empresa text,
  texto text not null,
  segmento public.segmento,
  orden integer not null default 0,
  estado public.estado_contenido not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.testimonios is 'Colección: testimonios de clientes (prueba social).';

create index testimonios_estado_orden_idx on public.testimonios (estado, orden);

create trigger testimonios_set_updated_at
  before update on public.testimonios
  for each row execute function public.set_updated_at();

-- --- RLS ---
alter table public.tipos_carpa enable row level security;
alter table public.testimonios enable row level security;

create policy "tipos_carpa_public_read" on public.tipos_carpa
  for select to anon using (estado = 'publicado');
create policy "tipos_carpa_auth_read" on public.tipos_carpa
  for select to authenticated using (true);
create policy "tipos_carpa_auth_write" on public.tipos_carpa
  for all to authenticated using (true) with check (true);

create policy "testimonios_public_read" on public.testimonios
  for select to anon using (estado = 'publicado');
create policy "testimonios_auth_read" on public.testimonios
  for select to authenticated using (true);
create policy "testimonios_auth_write" on public.testimonios
  for all to authenticated using (true) with check (true);

-- --- Seed ---
insert into public.tipos_carpa (id, nombre, slug, dimensiones_disponibles, capacidad_referencial, material_lona, usos_recomendados, descripcion, orden, estado) values
  ('33333333-3333-3333-3333-333333333301', 'Transparente', 'transparente', '3×3 hasta 10×30 m', '≈ 1 persona por m²', 'PVC cristal de alta transparencia', array['Bodas', 'Cenas de gala', 'Cócteles'], 'Cristal para celebraciones premium; deja el cielo a la vista y luce impecable de noche.', 1, 'publicado'),
  ('33333333-3333-3333-3333-333333333302', 'Estructural', 'estructural', 'Hasta 25 m de luz libre', '≈ 1,5 m² por persona sentada', 'PVC opaco ignífugo', array['Ferias', 'Expos', 'Producciones'], 'Aluminio modular de gran luz, sin postes interiores, para montajes de escala.', 2, 'publicado'),
  ('33333333-3333-3333-3333-333333333303', 'Pagoda', 'pagoda', '3×3, 4×4 y 5×5 m', '≈ 1 persona por m²', 'PVC opaco o cristal', array['Accesos', 'Stands', 'Zonas VIP'], 'Módulos de cubierta piramidal, ideales para puntos de acceso y activaciones.', 3, 'publicado'),
  ('33333333-3333-3333-3333-333333333304', 'Galpón', 'galpon', 'Desde 10×20 m en adelante', 'Según carga y uso', 'Lona industrial reforzada', array['Bodegaje', 'Faenas', 'Cobertura de obra'], 'Cobertura industrial temporal para almacenamiento, faenas y resguardo de obra.', 4, 'publicado')
on conflict (id) do nothing;

insert into public.testimonios (id, autor, cargo, empresa, texto, segmento, orden, estado) values
  ('44444444-4444-4444-4444-444444444401', 'María Fernanda Soto', 'Productora de eventos', 'Eventos del Valle', 'Montaron 850 m² en tiempo récord para nuestra expo regional. Cero improvisación: llegaron antes y todo quedó listo a la hora acordada.', 'corporativo', 1, 'publicado'),
  ('44444444-4444-4444-4444-444444444402', 'Rodrigo Pérez', 'Encargado de eventos', 'Municipalidad de Curicó', 'Cumplieron con la fiesta costumbrista a la perfección, incluso con viento. El anclaje y la seguridad estructural nos dieron total tranquilidad.', 'publico', 2, 'publicado'),
  ('44444444-4444-4444-4444-444444444403', 'Camila y Joaquín', 'Novios', null, 'Nuestra boda en la parcela quedó de revista. La carpa transparente fue el alma de la noche y la asesoría en terreno hizo toda la diferencia.', 'social', 3, 'publicado')
on conflict (id) do nothing;
