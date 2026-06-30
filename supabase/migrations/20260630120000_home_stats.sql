-- Cifras del hero, editables desde el admin (antes hardcodeadas en la home).
alter table public.home
  add column if not exists stats jsonb not null default '[
    {"valor": "+15", "etiqueta": "años de experiencia"},
    {"valor": "200+", "etiqueta": "eventos al año"},
    {"valor": "RM·V", "etiqueta": "regiones de cobertura"}
  ]'::jsonb;
