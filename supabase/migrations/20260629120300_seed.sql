-- ============================================================
-- Carpas López — Fase 1: contenido semilla (idempotente)
-- Extraído del prototipo. Imágenes se cargan luego desde el panel.
-- ============================================================

-- --- Singleton: configuración global ---
insert into public.configuracion_global (
  id, nombre_empresa, telefono, whatsapp, email, instagram,
  comunas_cobertura, horarios, destino_leads
) values (
  1,
  'Carpas López',
  '+56 9 6123 4567',
  '56961234567',
  'contacto@carpaslopez.cl',
  'https://instagram.com/carpaslopez',
  array['RM', 'V Región'],
  'L–V 9:00–18:00',
  'contacto@carpaslopez.cl'
)
on conflict (id) do nothing;

-- --- Singleton: home ---
insert into public.home (
  id, hero_titulo, hero_bajada,
  hero_cta_primario, hero_cta_secundario,
  diferenciadores, pasos_proceso
) values (
  1,
  'Estructuras que sostienen tus mejores eventos.',
  'Asesoría en terreno, montaje puntual y seguridad estructural — para celebraciones y grandes producciones.',
  '{"texto": "Cotiza tu evento", "destino": "/cotizar"}'::jsonb,
  '{"texto": "Ver trabajos realizados", "destino": "/trabajos"}'::jsonb,
  '[
    {"icono": "clock", "titulo": "Puntualidad de montaje", "texto": "Llegamos antes. El montaje y desmontaje se cumplen en la ventana acordada, sin excepciones."},
    {"icono": "shield-check", "titulo": "Seguridad estructural", "texto": "Anclajes calculados según superficie y carga de viento, con estructuras certificadas."},
    {"icono": "map-pin", "titulo": "Asesoría en terreno", "texto": "Visitamos el lugar antes de cotizar. Cero sorpresas el día del evento."}
  ]'::jsonb,
  '[
    {"numero": "1", "titulo": "Asesoría", "texto": "Visitamos el lugar y entendemos las necesidades de tu evento."},
    {"numero": "2", "titulo": "Cotización", "texto": "Propuesta formal con factura y detalle de montaje."},
    {"numero": "3", "titulo": "Montaje", "texto": "Equipo propio instala con anclajes calculados según el terreno."},
    {"numero": "4", "titulo": "Evento & desmontaje", "texto": "Cumplimos la ventana acordada, sin sorpresas."}
  ]'::jsonb
)
on conflict (id) do nothing;

-- --- Colección: servicios (4 segmentos) ---
insert into public.servicios (id, titulo, descripcion, segmento_asociado, orden, estado) values
  ('11111111-1111-1111-1111-111111111101', 'Eventos sociales', 'Bodas, cumpleaños, graduaciones y celebraciones en parcela.', 'social', 1, 'publicado'),
  ('11111111-1111-1111-1111-111111111102', 'Corporativo', 'Lanzamientos, ferias, activaciones de marca y cenas de gala.', 'corporativo', 2, 'publicado'),
  ('11111111-1111-1111-1111-111111111103', 'Público & municipal', 'Fiestas costumbristas, ferias libres y eventos deportivos.', 'publico', 3, 'publicado'),
  ('11111111-1111-1111-1111-111111111104', 'Industrial', 'Bodegaje temporal, faenas y cobertura de obra.', 'industrial', 4, 'publicado')
on conflict (id) do nothing;

-- --- Colección: proyectos de muestra ---
insert into public.proyectos (
  id, titulo, slug, segmento, ubicacion, dimensiones_m2, capacidad_personas, destacado, estado, fecha
) values
  ('22222222-2222-2222-2222-222222222201', 'Boda en Viña Santa Cruz', 'boda-vina-santa-cruz', 'social', 'Colchagua', 320, 180, true, 'publicado', '2026-03-15'),
  ('22222222-2222-2222-2222-222222222202', 'Expo Regional de Maquinaria', 'expo-regional-maquinaria', 'corporativo', 'Rancagua', 850, 600, true, 'publicado', '2026-04-20'),
  ('22222222-2222-2222-2222-222222222203', 'Fiesta de la Vendimia', 'fiesta-de-la-vendimia', 'publico', 'Curicó', 1200, 900, true, 'publicado', '2026-05-10')
on conflict (id) do nothing;
