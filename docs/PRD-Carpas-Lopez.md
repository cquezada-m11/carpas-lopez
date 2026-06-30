# PRD — Sitio Web Carpas López

**Producto:** Sitio web corporativo y portafolio autoadministrable
**Cliente:** Carpas López (arriendo, diseño y montaje de infraestructura para eventos)
**Versión del documento:** 1.0
**Estado:** Borrador para implementación
**Naturaleza:** Agnóstico a tecnología. Este documento describe el QUÉ y el POR QUÉ. La capa de implementación (framework, CMS, hosting, lenguaje) se resuelve en el boilerplate destino. Cualquier mención a una tecnología concreta es referencial, no prescriptiva.

---

## 1. Resumen ejecutivo

Carpas López necesita un sitio web que cumpla dos funciones: (a) ser su carta de presentación profesional ante dos audiencias con lógicas de compra distintas (social y corporativa/pública), y (b) ser **autoadministrable**, de modo que el equipo del cliente pueda cargar trabajos realizados, fotos y detalles técnicos sin intervención de un desarrollador.

El diferenciador competitivo de la marca no es estético sino operativo: **confiabilidad** (puntualidad de montaje/desmontaje, seguridad estructural, formalidad comercial y asesoría en terreno). El sitio debe comunicar ese diferenciador, no solo mostrar carpas bonitas.

El núcleo del producto es un **portafolio de proyectos filtrable**, alimentado desde un gestor de contenidos, donde cada proyecto expone fotos y ficha técnica. El resto de las secciones combinan contenido editable (marketing) con estructura fija (layout/lógica).

---

## 2. Objetivos y métricas de éxito

| ID | Objetivo | Métrica de éxito |
|----|----------|------------------|
| OBJ-1 | Generar solicitudes de cotización calificadas | N.º de envíos de formulario / mes; tasa de conversión visita→cotización |
| OBJ-2 | Posicionar la marca como proveedor confiable y formal | Tiempo en página de "Por qué elegirnos" y "Cómo trabajamos"; rebote del home |
| OBJ-3 | Permitir gestión de contenido sin desarrollador | El cliente publica un proyecto nuevo de punta a punta sin asistencia técnica |
| OBJ-4 | Servir a las dos audiencias (social y corporativa/pública) | Navegación segmentada usada; cotizaciones por segmento |
| OBJ-5 | Ser encontrable en búsquedas del rubro | Indexación correcta; presencia para términos "arriendo de carpas + [comuna/región]" |

---

## 3. Audiencias / Personas

### 3.1 Persona A — Cliente social (B2C)
- **Quién:** Persona organizando una boda, cumpleaños, graduación o evento en parcela.
- **Lógica de compra:** Emocional, rápida. Busca por imagen. Quiere visualizar cómo se verá su evento.
- **Necesidad clave:** Inspiración visual + facilidad para cotizar.
- **Lo que la convence:** Galería atractiva de eventos similares al suyo.

### 3.2 Persona B — Cliente corporativo / institucional (B2B / B2G)
- **Quién:** Encargado en una productora de eventos, empresa privada, municipio o evento deportivo.
- **Lógica de compra:** Racional, aversa al riesgo. Necesita cotización formal, factura y cero fallas operativas.
- **Necesidad clave:** Pruebas de fiabilidad, formalidad y capacidad operativa.
- **Lo que la convence:** Diferenciadores operativos (puntualidad, seguridad, asesoría en terreno), escala demostrada en el portafolio y proceso claro.

### 3.3 Persona C — Administrador de contenido (usuario interno)
- **Quién:** Personal de Carpas López sin perfil técnico.
- **Necesidad clave:** Cargar y editar trabajos, fotos y datos del negocio desde un panel simple, sin tocar código y sin posibilidad de romper el layout.

---

## 4. Alcance

### 4.1 Dentro de alcance (MVP / v1)
- Sitio público responsive con las secciones definidas en §6 y §7.
- Portafolio de proyectos filtrable, administrable vía CMS.
- Panel de administración de contenido para Persona C.
- Formulario de cotización con captura estructurada y enrutamiento a un canal de contacto.
- Configuración global del sitio editable (datos de contacto, redes, cobertura, branding básico).
- Optimización SEO base y rendimiento.

### 4.2 Fuera de alcance (v1; candidatos a fases posteriores)
- Pasarela de pago / reservas online.
- Cuentas de cliente / login público.
- Cotización automática con precios en tiempo real.
- Multi-idioma (el sitio es solo en español en v1).
- Integración con CRM/automatización avanzada (ver §10.4 como evolución futura).

---

## 5. Arquitectura de información (Sitemap)

```
/                         Home (landing principal)
/trabajos                 Listado de proyectos (portafolio filtrable)
/trabajos/[slug]          Detalle de proyecto (galería + ficha técnica)
/servicios                Detalle de servicios/segmentos (opcional como página)
/nosotros                 Visión, misión, diferenciadores (opcional como página)
/cotizar                  Formulario de cotización (o sección anclada en home)
/contacto                 Datos de contacto + canal directo
```

Notas:
- En v1 las secciones de la landing (§7) viven en `/`. `/servicios` y `/nosotros` como páginas dedicadas son opcionales y pueden derivarse del mismo contenido.
- `/trabajos` y `/trabajos/[slug]` son obligatorias: son el núcleo del producto.

---

## 6. Modelo de contenido

El contenido se divide en dos categorías. Esta separación es un requisito de diseño, no un detalle de implementación: define la experiencia del administrador.

- **Singletons (Configuración):** documentos únicos que el administrador **edita** pero no **crea ni elimina**. Agrupan ajustes globales y el contenido editable de páginas.
- **Colecciones (Contenido):** documentos repetibles que el administrador **crea, edita y archiva** libremente.

> Requisito de implementación: el panel debe presentar visualmente estas dos categorías como grupos separados. Los singletons no exponen botón de "crear nuevo"; las colecciones sí.

### 6.1 Singleton: `ConfiguracionGlobal`
Ajustes que afectan a todo el sitio.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| nombreEmpresa | texto | sí | Razón comercial mostrada |
| logo | imagen | sí | Logotipo principal |
| logoAlternativo | imagen | no | Versión para fondos claros/oscuros |
| telefono | texto | sí | Teléfono de contacto |
| whatsapp | texto | sí | Número WhatsApp (formato internacional) |
| email | texto | sí | Correo de contacto |
| instagram | url | no | Perfil de Instagram |
| otrasRedes | lista de {plataforma, url} | no | Redes adicionales |
| comunasCobertura | lista de texto | no | Zonas/comunas/regiones donde operan |
| horarios | texto | no | Horarios de atención |
| destinoLeads | texto/email | sí | Dónde llegan las solicitudes de cotización |

### 6.2 Singleton: `Home`
Contenido editable de la landing principal. Cada bloque editable de §7 referencia aquí.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| heroTitulo | texto | sí | Titular principal |
| heroBajada | texto | sí | Subtítulo del hero |
| heroMedia | imagen o video | sí | Fondo del hero |
| heroCtaPrimario | {texto, destino} | sí | CTA principal (ej. cotizar) |
| heroCtaSecundario | {texto, destino} | no | CTA secundario (ej. segmento) |
| diferenciadores | lista de {icono, titulo, texto} | sí | Bloques de "Por qué elegirnos" (precargados) |
| pasosProceso | lista de {numero, titulo, texto} | sí | Pasos de "Cómo trabajamos" (precargados) |
| proyectosDestacados | referencias a `Proyecto` | no | Selección manual para el home; si vacío, usar últimos N |

### 6.3 Colección: `Proyecto` (núcleo del producto)
Cada trabajo realizado. Es lo que el administrador carga con mayor frecuencia.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| titulo | texto | sí | Nombre del proyecto/evento |
| slug | slug | sí | Derivado del título; URL única |
| galeria | lista de imágenes | sí | Fotos del trabajo (mín. 1) |
| imagenPortada | imagen | no | Si vacío, usar primera de galería |
| segmento | enum: social \| corporativo \| publico \| industrial | sí | Para filtrar el portafolio |
| tipoEvento | texto/enum | no | Boda, cumpleaños, corporativo, municipal, festival, etc. |
| ubicacion | texto | no | Comuna/región del evento |
| capacidadPersonas | número | no | Aforo del montaje |
| dimensionesM2 | número | no | Superficie cubierta en m² |
| tipoCarpa | texto/referencia a `TipoCarpa` | no | Modelo de carpa utilizado |
| tipoAnclaje | texto/enum | no | Superficie/anclaje (pasto, cemento, tierra…) |
| cliente | texto | no | Solo si el cliente autoriza mostrarlo |
| descripcion | texto enriquecido | no | Relato del proyecto |
| destacado | booleano | no | Marcar para aparecer en el home |
| fecha | fecha | no | Para ordenar cronológicamente |

### 6.4 Colección: `Servicio`
Segmentos/líneas de negocio mostrados en la landing.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| titulo | texto | sí | Nombre del servicio/segmento |
| descripcion | texto | sí | Descripción corta |
| imagen | imagen | sí | Foto representativa |
| segmentoAsociado | enum (igual que Proyecto) | no | Para enlazar a galería filtrada |
| orden | número | no | Orden de aparición |

### 6.5 Colección: `TipoCarpa` (opcional)
Catálogo de modelos con especificaciones técnicas. Incluir solo si el cliente se compromete a mantenerlo; un catálogo desactualizado resta credibilidad.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| nombre | texto | sí | Nombre del modelo |
| imagen | imagen | no | Foto del tipo de carpa |
| dimensionesDisponibles | texto | no | Medidas que ofrecen |
| capacidadReferencial | texto | no | Aforo orientativo (ej. 1 m²/persona de pie, 2 m²/persona sentada) |
| materialLona | texto | no | Especificación de la lona |
| usosRecomendados | lista de texto | no | Escenarios ideales |

### 6.6 Colección: `Testimonio` (opcional)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| autor | texto | sí | Nombre / cargo |
| empresa | texto | no | Organización (para B2B) |
| texto | texto | sí | Cita |
| segmento | enum | no | Para asociar a audiencia |

---

## 7. Especificación de secciones de la landing principal

Cada sección indica su fuente de datos y si es administrable. "Administrable" = el contenido proviene de un singleton/colección; "Estructura fija" = layout y lógica en código.

| # | Sección | Fuente | Administrable | Notas |
|---|---------|--------|---------------|-------|
| S1 | Header sticky | `ConfiguracionGlobal` (logo, whatsapp, cta) + nav en código | Parcial | Nav fijo en código; logo/CTA/WhatsApp editables |
| S2 | Hero | `Home` (titulo, bajada, media, CTAs) | Sí | Pieza de mayor impacto; soporta imagen o video |
| S3 | Segmentos / Servicios | Colección `Servicio` | Sí | Tarjetas con link a galería filtrada por segmento |
| S4 | Trabajos realizados (destacados) | Colección `Proyecto` (destacado=true o últimos N) | Sí | Núcleo. Botón "Ver todos los trabajos" → `/trabajos` |
| S5 | Por qué elegirnos | `Home.diferenciadores` | Sí (precargado) | Puntualidad, seguridad, asesoría en terreno |
| S6 | Cómo trabajamos | `Home.pasosProceso` | Sí (precargado) | Timeline: Asesoría → Cotización → Montaje → Evento/Desmontaje |
| S7 | Detalles técnicos / catálogo | Colección `TipoCarpa` | Sí (opcional) | Omitir si no se mantendrá |
| S8 | Cotización (CTA) | Estructura fija; destino en `ConfiguracionGlobal` | No (form); Sí (destino) | Captura estructurada de datos del evento |
| S9 | Footer | `ConfiguracionGlobal` | Sí | Contacto, redes, cobertura, horarios |

### 7.1 Página de listado `/trabajos`
- Muestra todos los `Proyecto`.
- Filtro por `segmento` (y opcionalmente por `tipoEvento`).
- Tarjeta de proyecto: imagen de portada, título, segmento, ubicación.
- Click → `/trabajos/[slug]`.

### 7.2 Página de detalle `/trabajos/[slug]`
- Galería completa del proyecto.
- Ficha técnica: capacidad, m², tipo de carpa, anclaje, ubicación.
- Descripción.
- CTA a cotización.
- Sugerencia: proyectos relacionados del mismo segmento.

---

## 8. Requisitos funcionales (formato EARS)

> Convención EARS: "Cuando/Mientras/Si [condición], el sistema deberá [respuesta]." Los requisitos ubicuos usan "El sistema deberá…".

### 8.1 Gestión de contenido (autoadministración)
- **RF-01:** El sistema deberá permitir que un administrador autenticado cree un `Proyecto` nuevo completando los campos de §6.3.
- **RF-02:** El sistema deberá permitir editar y archivar/despublicar cualquier `Proyecto` existente.
- **RF-03:** Cuando un `Proyecto` no tenga `imagenPortada`, el sistema deberá usar la primera imagen de su `galeria` como portada.
- **RF-04:** El sistema deberá permitir reordenar las imágenes dentro de la `galeria` de un `Proyecto`.
- **RF-05:** El sistema deberá impedir que el administrador modifique la estructura de navegación, el layout o la lógica de las secciones desde el panel de contenido.
- **RF-06:** El sistema deberá presentar el contenido administrable separado en dos grupos: "Configuración" (singletons, sin crear/eliminar) y "Contenido" (colecciones, con crear/editar/archivar).
- **RF-07:** Cuando el administrador marque un `Proyecto` como `destacado`, el sistema deberá hacerlo elegible para mostrarse en la sección S4 del home.
- **RF-08:** Mientras la lista `proyectosDestacados` del singleton `Home` esté vacía, el sistema deberá mostrar en S4 los últimos N proyectos publicados por fecha.
- **RF-09:** El sistema deberá permitir editar todos los campos del singleton `ConfiguracionGlobal` y reflejarlos en header, footer y destino de cotizaciones.

### 8.2 Portafolio y filtrado
- **RF-10:** El sistema deberá listar en `/trabajos` todos los `Proyecto` publicados.
- **RF-11:** Cuando un visitante seleccione un filtro de `segmento`, el sistema deberá mostrar únicamente los proyectos de ese segmento.
- **RF-12:** El sistema deberá generar una URL única y estable por proyecto a partir de su `slug`.
- **RF-13:** Cuando un visitante abra el detalle de un proyecto, el sistema deberá mostrar su galería completa y los campos de ficha técnica que estén poblados, omitiendo los vacíos.

### 8.3 Cotización
- **RF-14:** El sistema deberá ofrecer un formulario de cotización que capture, como mínimo: tipo de evento, fecha del evento, ubicación/comuna, número de personas, datos de contacto del solicitante.
- **RF-15:** Cuando el visitante envíe el formulario con datos válidos, el sistema deberá enrutar la solicitud al canal definido en `ConfiguracionGlobal.destinoLeads`.
- **RF-16:** Si el visitante envía el formulario con campos requeridos vacíos o inválidos, el sistema deberá impedir el envío e indicar qué corregir.
- **RF-17:** El sistema deberá ofrecer un canal de contacto directo por WhatsApp usando el número de `ConfiguracionGlobal`.
- **RF-18:** Cuando el visitante envíe una cotización correctamente, el sistema deberá mostrar una confirmación visible.

### 8.4 Navegación y CTAs
- **RF-19:** El sistema deberá mantener visible un CTA de contacto/cotización mientras el visitante hace scroll (header sticky).
- **RF-20:** Cuando un visitante haga click en una tarjeta de `Servicio` asociada a un segmento, el sistema deberá llevarlo al listado de trabajos filtrado por ese segmento.

---

## 9. Requisitos no funcionales

### 9.1 Rendimiento
- **RNF-01:** El sistema deberá optimizar y servir imágenes en formatos y tamaños adecuados al dispositivo (la galería es intensiva en imágenes).
- **RNF-02:** El sistema deberá priorizar la carga del contenido visible inicial (hero) y diferir lo no crítico.

### 9.2 SEO
- **RNF-03:** El sistema deberá permitir título y meta-descripción por página, con valores por defecto sensatos.
- **RNF-04:** El sistema deberá exponer metadatos de previsualización social (Open Graph) por página y por proyecto.
- **RNF-05:** El sistema deberá generar un sitemap y permitir indexación por buscadores.
- **RNF-06:** El sistema deberá usar URLs legibles basadas en `slug`.
- **RNF-07:** El sistema deberá incluir datos estructurados de organización local (negocio, contacto, zona de servicio) cuando sea posible.

### 9.3 Responsive y accesibilidad
- **RNF-08:** El sistema deberá renderizar correctamente en móvil, tablet y escritorio.
- **RNF-09:** El sistema deberá cumplir prácticas de accesibilidad razonables: texto alternativo en imágenes, contraste suficiente, navegación por teclado en elementos interactivos.

### 9.4 Idioma
- **RNF-10:** El contenido del sitio deberá estar en español (Chile). No se requiere multi-idioma en v1.

### 9.5 Seguridad y datos
- **RNF-11:** El acceso al panel de administración deberá requerir autenticación.
- **RNF-12:** El sistema deberá proteger el formulario de cotización contra envíos automatizados (anti-spam).
- **RNF-13:** El sistema deberá manejar los datos personales de los solicitantes conforme a buenas prácticas de privacidad.

### 9.6 Mantenibilidad
- **RNF-14:** La capa de contenido deberá estar desacoplada de la capa de presentación, de modo que cambios de contenido no requieran despliegue de código.

---

## 10. Integraciones

Descritas de forma abstracta; el boilerplate define el proveedor concreto.

- **10.1 Canal de cotización (saliente):** las solicitudes del formulario deben llegar a un destino configurable (correo y/o sistema de mensajería). Abstracción: "servicio de notificación de leads".
- **10.2 WhatsApp (directo):** enlace de contacto directo al número configurado.
- **10.3 Analítica:** capacidad de incorporar medición de tráfico y conversiones.
- **10.4 Evolución futura (fuera de v1):** el formulario de cotización está diseñado para, en una fase posterior, enviar leads estructurados a un CRM/automatización (atribución, seguimiento, clasificación). El modelo de datos del formulario debe ser lo bastante estructurado para soportar esa integración sin rediseño.

---

## 11. Branding y design tokens

Identidad definida (logo existente): carpa estilizada en paneles negro/dorado sobre fondo hueso. Posicionamiento: premium, formal, confiable.

### 11.1 Paleta (valores referenciales)
| Rol | Uso | Valor aprox. |
|-----|-----|--------------|
| Primario oscuro | Fondos oscuros, texto sobre claro | `#0E0E0E`–`#1A1A1A` |
| Acento dorado | Detalles, divisores, hover, íconos | `#C9A24B`–`#D4AF37` |
| Dorado claro | Highlights puntuales | `#E3C46A` |
| Fondo claro | Fondo base del sitio | `#F4F1EA`–`#F7F4EE` |
| Texto sobre claro | Cuerpo | `#1A1A1A` |
| Texto sobre oscuro | Cuerpo invertido | `#F4F1EA` |

### 11.2 Reglas de uso
- El dorado es **acento**, no color de relleno masivo. Reservarlo para detalles; el peso visual lo cargan el negro y el hueso.
- Mucho espacio en blanco (hueso). Las fotos de los eventos aportan el color real; la UI debe ser sobria para no competir con ellas.
- Evitar degradados metálicos del logo replicados en bloques grandes (se ve barato); usar dorado plano en superficies.

### 11.3 Tipografía (dirección)
- **Títulos:** serif clásica elegante (en sintonía con el logotipo), para reforzar el lado "bodas/premium".
- **Cuerpo:** sans legible, para el lado "empresas/corporativo".

> Los valores anteriores deben mapearse a las variables de tema del boilerplate destino (tokens de color, tipografía, espaciado).

---

## 12. Roles y permisos

| Rol | Capacidades |
|-----|-------------|
| Administrador (cliente) | Crear/editar/archivar colecciones; editar singletons; subir medios. No accede a layout, lógica ni navegación. |
| Desarrollador / Owner | Acceso total a estructura, esquema de contenido, despliegue. |
| Visitante público | Solo lectura del sitio; envío del formulario de cotización. |

---

## 13. Criterios de aceptación (Definition of Done)

El sitio se considera listo para v1 cuando:
1. El administrador puede publicar un `Proyecto` nuevo de punta a punta (campos + galería) y este aparece en `/trabajos` y, si se marca, en el home — sin asistencia técnica. (RF-01, RF-07, RF-10)
2. El portafolio filtra correctamente por segmento. (RF-11)
3. El formulario de cotización captura los campos mínimos, valida, enruta al destino configurado y confirma al usuario. (RF-14 a RF-18)
4. Header, footer y datos de contacto se actualizan editando únicamente `ConfiguracionGlobal`. (RF-09)
5. El sitio es responsive y pasa una revisión básica de accesibilidad y SEO. (RNF-03 a RNF-09)
6. El panel separa visualmente Configuración y Contenido, y el administrador no puede romper el layout. (RF-05, RF-06)
7. La identidad visual respeta la paleta y dirección tipográfica de §11.

---

## 14. Roadmap por fases

| Fase | Contenido | Objetivo |
|------|-----------|----------|
| **Fase 0 — Demo** | Home estática con branding aplicado, hero, segmentos y portafolio de muestra | Mostrar dirección visual al cliente; validar rumbo |
| **Fase 1 — MVP** | Modelo de contenido completo, portafolio administrable, formulario de cotización, configuración global, SEO base | Sitio funcional y autoadministrable en producción |
| **Fase 2 — Crecimiento** | Catálogo `TipoCarpa`, testimonios, página `/nosotros` y `/servicios` dedicadas, bloque de números cuando existan datos reales | Profundidad de contenido y prueba social |
| **Fase 3 — Captación** | Integración del formulario con CRM/automatización; atribución de leads; medición avanzada | Convertir el sitio en motor de captación |

---

## 15. Glosario

- **Singleton:** documento de contenido único (no repetible) que se edita pero no se crea ni elimina.
- **Colección:** tipo de documento repetible; el administrador crea tantos como necesite.
- **Segmento:** clasificación de audiencia/evento (social, corporativo, público, industrial) usada para filtrar el portafolio.
- **Ficha técnica:** conjunto de campos de un `Proyecto` que describe el montaje (capacidad, m², tipo de carpa, anclaje, ubicación).
- **EARS:** *Easy Approach to Requirements Syntax*; formato condición→respuesta para requisitos.
- **Administrable:** contenido editable desde el panel sin desplegar código.

---

*Fin del documento.*
