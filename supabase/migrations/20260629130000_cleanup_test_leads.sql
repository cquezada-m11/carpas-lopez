-- Limpia las filas de prueba de la verificación de RLS sobre cotizaciones.
delete from public.cotizaciones where origen = 'rls-smoke-test';
