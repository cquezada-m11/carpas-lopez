-- ============================================================
-- Carpas López — Fase 1: esquema base
-- Singletons (Configuración) + Colecciones (Contenido) + Leads.
-- Postgres 17. gen_random_uuid() es nativo (no requiere pgcrypto).
-- ============================================================

-- --- Enums compartidos ---
create type public.segmento as enum (
  'social',
  'corporativo',
  'publico',
  'industrial'
);

create type public.estado_contenido as enum (
  'borrador',
  'publicado',
  'archivado'
);

-- --- Trigger genérico de updated_at ---
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- Singletons (Configuración): una sola fila, se edita, no se crea/elimina.
-- ============================================================

create table public.configuracion_global (
  id smallint primary key default 1 check (id = 1),
  nombre_empresa text not null default 'Carpas López',
  logo_path text,
  logo_alt_path text,
  telefono text,
  whatsapp text,
  email text,
  instagram text,
  otras_redes jsonb not null default '[]'::jsonb, -- [{plataforma, url}]
  comunas_cobertura text[] not null default '{}',
  horarios text,
  destino_leads text,
  updated_at timestamptz not null default now()
);
comment on table public.configuracion_global is 'Singleton: ajustes globales del sitio (header/footer/destino de leads).';

create trigger configuracion_global_set_updated_at
  before update on public.configuracion_global
  for each row execute function public.set_updated_at();

create table public.home (
  id smallint primary key default 1 check (id = 1),
  hero_titulo text not null default '',
  hero_bajada text not null default '',
  hero_media_path text,
  hero_cta_primario jsonb not null default '{}'::jsonb,  -- {texto, destino}
  hero_cta_secundario jsonb,                             -- {texto, destino}
  diferenciadores jsonb not null default '[]'::jsonb,    -- [{icono, titulo, texto}]
  pasos_proceso jsonb not null default '[]'::jsonb,      -- [{numero, titulo, texto}]
  proyectos_destacados uuid[] not null default '{}',     -- selección manual para S4
  updated_at timestamptz not null default now()
);
comment on table public.home is 'Singleton: contenido editable de la landing (hero, bloques precargados).';

create trigger home_set_updated_at
  before update on public.home
  for each row execute function public.set_updated_at();

-- ============================================================
-- Colecciones (Contenido): CRUD con columna `estado`.
-- ============================================================

create table public.proyectos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text not null unique,
  segmento public.segmento not null,
  galeria jsonb not null default '[]'::jsonb, -- [{path, alt, orden}]
  imagen_portada_path text,                   -- vacío => primera de galería (RF-03)
  tipo_evento text,
  ubicacion text,
  capacidad_personas integer,
  dimensiones_m2 integer,
  tipo_carpa text,
  tipo_anclaje text,
  cliente text,
  descripcion text,
  destacado boolean not null default false,
  fecha date,
  estado public.estado_contenido not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.proyectos is 'Colección núcleo: portafolio de trabajos realizados.';

create index proyectos_estado_idx on public.proyectos (estado);
create index proyectos_segmento_idx on public.proyectos (segmento);
create index proyectos_destacado_idx on public.proyectos (destacado) where destacado;
create index proyectos_fecha_idx on public.proyectos (fecha desc nulls last);

create trigger proyectos_set_updated_at
  before update on public.proyectos
  for each row execute function public.set_updated_at();

create table public.servicios (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text not null,
  imagen_path text,
  segmento_asociado public.segmento,
  orden integer not null default 0,
  estado public.estado_contenido not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.servicios is 'Colección: segmentos/líneas de negocio mostrados en la landing.';

create index servicios_estado_orden_idx on public.servicios (estado, orden);

create trigger servicios_set_updated_at
  before update on public.servicios
  for each row execute function public.set_updated_at();

-- ============================================================
-- Leads: cotizaciones (modelo estructurado, listo para CRM en Fase 3).
-- ============================================================

create table public.cotizaciones (
  id uuid primary key default gen_random_uuid(),
  tipo_evento text,
  fecha_evento date,
  ubicacion text,
  numero_personas integer,
  nombre text not null,
  email text,
  telefono text,
  mensaje text,
  segmento public.segmento,
  origen text,                       -- atribución (UTM/página) para CRM futuro
  estado text not null default 'nuevo', -- ciclo de vida del lead
  created_at timestamptz not null default now()
);
comment on table public.cotizaciones is 'Leads del formulario de cotización. Honeypot + rate-limit viven en la Server Action.';

create index cotizaciones_created_idx on public.cotizaciones (created_at desc);
