-- La fecha del evento puede ser un rango aproximado (cuando aún no está cerrada)
-- o una fecha exacta. `fecha_evento` (date) se usa para la exacta; `fecha_rango`
-- (texto) para el rango aproximado.
alter table public.cotizaciones
  add column if not exists fecha_rango text;
