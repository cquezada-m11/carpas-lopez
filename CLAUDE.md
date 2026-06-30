# CLAUDE.md

Guía para trabajar en el repositorio de **Carpas López** — sitio web corporativo
y portafolio autoadministrable (arriendo, diseño y montaje de carpas para eventos).

## Regla de commit (obligatoria)

> **Antes de cada commit se debe ejecutar `npm run verify` y debe pasar sin
> errores.** No se commitea con `verify` en rojo.

`verify` corre, en orden (falla rápido en lo barato primero):

1. `format:check` — Prettier valida el formato.
2. `lint` — ESLint.
3. `typecheck` — `tsc --noEmit`.
4. `build` — `next build` (incluye chequeos de Next).

Si `format:check` falla, corre `npm run format` para arreglar el formato y vuelve
a verificar.

> **Mensajes de commit:** nunca incluir referencias a que el commit fue co-creado
> o generado con Claude u otra IA. Sin trailer `Co-Authored-By: Claude` (ni de
> ninguna IA), sin línea "Generated with Claude Code" ni similar.

## Comandos

| Comando                | Qué hace                                                 |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo (Turbopack)                       |
| `npm run build`        | Build de producción                                      |
| `npm run format`       | Formatea todo con Prettier (escribe)                     |
| `npm run format:check` | Valida formato sin escribir                              |
| `npm run lint`         | ESLint                                                   |
| `npm run typecheck`    | `tsc --noEmit`                                           |
| `npm run verify`       | format:check → lint → typecheck → build (**pre-commit**) |

## Stack

- **Next.js** (App Router, React 19) + TypeScript. Alias de imports: `@/*`.
- **Tailwind CSS v3** + **shadcn/ui** (Radix + CVA + `tailwind-merge`).
- **Supabase** (`@supabase/ssr`) — auth ya cableada; backend de contenido en Fase 1.
- **Prettier** con `prettier-plugin-tailwindcss` (ordena clases; `tailwindFunctions: ["cn", "cva"]`).

## Design system

Identidad: **negro + dorado sobre hueso**, premium/formal. El dorado es **acento, no
relleno** (ver PRD §11). Light-only por marca; las secciones oscuras usan `bg-ink`

- el contexto `.on-dark`, no un tema dark global.

* **Tokens:** `app/globals.css` (CSS vars HSL) mapeados a shadcn + tokens de marca.
  Colores de marca en Tailwind: `ink`/`ink-deep`, `bone`/`bone-alt`/`bone-dark`,
  `gold`/`gold-deep`/`gold-light`.
* **Tipografía:** `Libre Caslon Text` (serif, títulos) + `Manrope` (sans, cuerpo) +
  mono para _eyebrows_. Escalas: `text-display`, `text-heading-lg`, `text-heading`,
  `text-eyebrow`.
* **Radios (modernos):** botones y badges/chips son _pill_ (`rounded-full`);
  inputs/select/textarea `rounded-xl` (20px); cards `rounded` (16px) o
  `rounded-2xl` (24px) para las destacadas. Escala base en `tailwind.config.ts`
  (`--radius` = 16px).
* **Primitivos de marca:** `components/ds/` → `Eyebrow`, `Section` (tonos
  bone/alt/dark/white), `SectionHeading`, `OrnamentDivider`, `Stat`/`StatRow`.
  Importar desde `@/components/ds`.
* **Primitivos shadcn** reestilizados a la marca: `components/ui/{button,badge,input}`.
* **Showcase / documentación viva:** ruta `/design-system`.

### Convenciones

- Componer secciones con los primitivos de `components/ds`; no reinventar tokens
  inline. Reusar variantes de `Button`/`Badge` antes de crear clases sueltas.
- Estilos vía utilidades Tailwind + tokens; evitar hex crudos en JSX.

## Autenticación / rutas

- **Público por defecto.** Solo `/admin` y `/protected` requieren sesión
  (ver `lib/supabase/proxy.ts`). El sitio de marketing no exige login.

## Fuentes de verdad

- **`docs/PRD-Carpas-Lopez.md`** — requisitos (QUÉ y POR QUÉ). Modelo de contenido,
  EARS, sitemap, design tokens. Es la referencia para alcance y prioridades.
- **`docs/Carpas Lopez Home.html`** — prototipo de diseño (referencia visual + copy).

## Roadmap (resumen del PRD §14)

- **Fase 0** — Demo visual: home estática con branding aplicado. _(Design system listo.)_
- **Fase 1 (MVP)** — Modelo de contenido en Supabase, portafolio administrable
  (`/trabajos`, núcleo), formulario de cotización, configuración global, SEO base.
- **Fase 2** — Catálogo de carpas, testimonios, páginas dedicadas.
- **Fase 3** — Integración del formulario con CRM/automatización.
