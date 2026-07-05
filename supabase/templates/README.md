# Plantillas de correo — Carpas López

Correos de autenticación con branding de la marca (hueso + negro + dorado de
acento, serif en títulos). HTML autocontenido, CSS inline y layout con tablas
para máxima compatibilidad entre clientes de correo.

## Cómo aplicarlas (proyecto remoto)

Las entradas en `supabase/config.toml` (`[auth.email.template.*]`) aplican en
Supabase **local**. Para el proyecto **remoto** hay que pegarlas a mano:

**Dashboard → Authentication → Emails → Templates.** Por cada plantilla, copia el
contenido del `.html` en el campo _Message body_ y usa el asunto indicado.

| Plantilla del Dashboard | Archivo                 | Asunto sugerido                          |
| ----------------------- | ----------------------- | ---------------------------------------- |
| Invite user             | `invite.html`           | Te invitamos a administrar Carpas López  |
| Confirm signup          | `confirmation.html`     | Confirma tu cuenta · Carpas López        |
| Reset Password          | `recovery.html`         | Restablece tu contraseña · Carpas López  |
| Magic Link              | `magic_link.html`       | Tu enlace de acceso · Carpas López       |
| Change Email Address    | `email_change.html`     | Confirma tu nuevo correo · Carpas López  |
| Reauthentication        | `reauthentication.html` | Tu código de verificación · Carpas López |

> El flujo actual es **solo por invitación** (signup deshabilitado), así que las
> que más importan son _Invite user_ y _Reset Password_. Las demás quedan listas
> por si se habilitan.

## Variables de Supabase usadas

- `{{ .ConfirmationURL }}` — enlace de acción (invite, confirm, recovery, magic
  link, email change).
- `{{ .Token }}` — código OTP de reautenticación.
- `{{ .Email }}` / `{{ .NewEmail }}` — correo actual y nuevo (email change).

## Notas de diseño

- El logo se sirve desde el bucket público de Storage
  (`medios/config/…-logo.png`). Si cambia el logo en Configuración, actualiza la
  URL en los `.html`.
- Las fuentes de marca (Libre Caslon Text / Manrope) no cargan en la mayoría de
  clientes de correo; hay _fallbacks_ a Georgia (serif) y system-sans.
- Remitente: mientras no haya SMTP propio, sale desde `…@mail.app.supabase.io`.
  Para enviar desde `@carpaslopez.cl` hay que configurar SMTP (p. ej. Resend) con
  dominio verificado.
