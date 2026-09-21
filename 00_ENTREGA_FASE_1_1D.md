# Entrega Fase 1.1D

## Resumen

Se implementó la Fase 1.1D sobre el fuente actual de `Output/sitio-web`, sin reconstruir desde `dist` ni modificar `Antecedentes`.

Cambios principales:

- Portada reemplazada por `Foto_portada.jpeg`, con `<picture>`, AVIF/WebP/JPEG, `srcset`, `sizes`, dimensiones explícitas y `fetchpriority="high"`.
- H1 reorganizado visualmente en tres líneas: "Bienvenidos a", "Sala Cuna y Jardín Infantil", "Semillita".
- Tarjeta de frase oficial compactada, conservando una sola aparición de la frase.
- Galería "Nuestro jardín" reemplazada por las salas disponibles `sala1` a `sala4`.
- Texto de "Nuestro jardín" reemplazado por el texto confirmado.
- "Nuestras familias" reemplazada por `Nuestra_familia.jpeg`.
- Las 14 actividades conservan título y descripción, y ahora incluyen foto o SVG dentro del contenido abierto de cada `<details>`.
- Certificaciones recortadas a sello ovalado con transparencia, con versiones de visualización livianas y enlace a versión completa.
- Jornadas convertidas a tabla HTML semántica.
- Navegación desktop y móvil corregida para cierres de menús.
- 404 corregido para usar navegación hacia `/#inicio`, `/#nosotros`, etc.
- Footer ajustado para enlazar a todas las jornadas.
- CSS normalizado parcialmente según `Parametros_UI`: escala tipográfica, sombras suaves, radios, espacios, `scroll-padding-top`, `scroll-margin-top`, `text-wrap: balance` y eliminación de `overflow-wrap:anywhere`.

## Archivos modificados

- `src/components/ResponsiveImage.astro`
- `src/components/Hero.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/data/site.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/404.astro`
- `src/pages/index.astro`
- `src/styles/global.css`
- `public/images/phase-1-1d/**`

## Fotografías utilizadas

- Portada: `Foto_portada.jpeg`
- Nuestro jardín: `sala1.jpeg`, `sala2.jpeg`, `sala3.jpeg`, `sala4.jpeg`
- Nuestras familias: `Nuestra_familia.jpeg`
- Actividades con fotografía:
  - `Bienvenida.jpeg`
  - `pascua.jpeg`
  - `dia de la tierra.jpeg`
  - `WhatsApp Image 2026-08-16 at 17.17.34 (2).jpeg`
  - `talleres de invierno.jpeg`
  - `talleres de verano.jpeg`

No se usaron `bano*`, `pasillo*`, `patio*` ni `juguetes1` como sustituto de `sala5` o `sala6`.

## Mapeo de actividades

| Actividad | Recurso usado |
| --- | --- |
| Semana Bienvenida | Foto optimizada desde `Bienvenida.jpeg` |
| Conejito de Pascua | Foto optimizada desde `pascua.jpeg` |
| Disertación "La Familia" | SVG original de reemplazo |
| Día del Libro | SVG original de reemplazo |
| Día de la Tierra | Foto optimizada desde `dia de la tierra.jpeg` |
| Día de la Mamá | Foto optimizada desde `WhatsApp Image 2026-08-16 at 17.17.34 (2).jpeg` |
| Día del Papá | SVG original de reemplazo |
| Talleres de Invierno | Foto optimizada desde `talleres de invierno.jpeg` |
| Día del niño y la niña | SVG original de reemplazo |
| Fiestas Patrias | SVG original de reemplazo |
| Disertación "Mis animales preferidos" | SVG original de reemplazo |
| Graduación | SVG original de reemplazo |
| Navidad en Familia | SVG original de reemplazo |
| Talleres de Verano | Foto optimizada desde `talleres de verano.jpeg` |

## Gráficos de reemplazo creados

- `disertacion-familia.svg`
- `dia-libro.svg`
- `dia-papa.svg`
- `dia-nino-nina.svg`
- `fiestas-patrias.svg`
- `animales-preferidos.svg`
- `graduacion.svg`
- `navidad-familia.svg`

## Optimizaciones realizadas

- Todas las fotografías nuevas publicadas se reemitieron desde copias dentro de `public/images/phase-1-1d`.
- Las copias optimizadas se generaron sin metadatos EXIF/GPS mediante Sharp.
- Se generaron variantes AVIF, WebP y JPEG para portada, salas, familias, metodología y fotos de actividades.
- Se generó recorte móvil derivado de la portada original: `portada-mobile-820x1200`.
- Las certificaciones tienen PNG transparente completo y versiones WebP/PNG de 320 y 520 px para visualización.
- Se agregó logo oficial optimizado desde `Antecedentes/Marca/SEMILLITA_06_LOGO_REFERENCIA.jpeg`.

## Comparación de peso o carga

- `revision-fase-1-1c-dist.zip`: 5.083.089 bytes.
- Nuevos assets generados en `public/images/phase-1-1d`: 12.650.060 bytes.
- Peso transferido esperado por viewport se reduce usando AVIF y carga diferida:
  - portada desktop AVIF 1280: 238.856 bytes.
  - portada móvil AVIF 820x1200: 219.453 bytes.
  - salas AVIF: 23.754 a 67.221 bytes por variante.
  - actividades AVIF: 20.015 a 126.029 bytes por variante.
  - certificaciones WebP de visualización: 22.650 a 42.074 bytes.

La comparación final de `dist` no pudo cerrarse porque el build quedó bloqueado por el entorno.

## Pruebas ejecutadas

- Lectura completa de `Antecedentes/Diseno/Parametros_UI.docx`.
- Inventario visual y dimensional de `Antecedentes/Fotografías`.
- Astro/TypeScript mediante `AstroCheck` local:
  - 14 archivos revisados.
  - 0 errores.
  - 0 warnings.
  - 0 hints.
- Verificación estática de fuente:
  - Home conserva 1 H1.
  - 1 aparición de la frase oficial en fuente.
  - 4 niveles.
  - 5 jornadas.
  - 14 actividades.
  - 14 descripciones de actividades.
  - 2 certificaciones.
  - `noindex,nofollow` presente.
  - Sin `<form>`, `<iframe>`, scripts externos ni analítica en fuente.
  - Menú móvil y menús desktop tienen lógica de cierre.
  - Jornadas usa `<table>`, `<thead>`, `<tbody>`, `scope="col"` y `scope="row"`.
  - Recursos referenciados directamente en fuente existen.

## Problemas pendientes

- `sala5` y `sala6` no existen en `Antecedentes/Fotografías`; por instrucción se usaron solo `sala1` a `sala4`.
- `npm` no está disponible en PATH y `node.exe` de WindowsApps no puede ejecutarse desde PowerShell.
- `astro.build()` desde el Node REPL intenta crear `C:\Users\papo2\AppData\Roaming\astro\Config`, lo que el sandbox bloquea.
- La solicitud de ejecutar el build local fuera del sandbox fue rechazada por límite de uso del entorno.
- Por lo anterior, `dist` no quedó actualizado y no se creó `revision-fase-1-1d-dist.zip`.
- No se pudo realizar revisión visual automatizada con navegador sobre la versión compilada.
- Las copias antiguas no referenciadas en `public/images/private-review`, `public/images/certifications` y `public/images/brand/semillita-logo-temporal.jpeg` siguen físicamente presentes porque el intento de borrado fue bloqueado por el entorno. El fuente ya no las referencia.
- También siguen presentes las variantes descartadas `public/images/phase-1-1d/hero/portada-mobile-720x1200.*`; el fuente usa `portada-mobile-820x1200.*`.

## Detalles abandonados por la política de tres intentos

### Build y dist

1. `npm run check` falló porque `npm` no está disponible.
2. `astro.build()` programático falló por escritura bloqueada en `%AppData%`.
3. `node .\scripts\astro-command.mjs build` fuera del sandbox fue rechazado por límite del entorno.

Impacto: no hay `dist` actualizado ni zip de revisión 1.1D.

### WOFF2

1. `fontTools` está instalado, pero falta el módulo Brotli necesario para WOFF2.
2. No existe binario local `ttf2woff2` ni `brotli`.
3. No se encontró paquete local de conversión WOFF2 en `node_modules`.

Impacto: las fuentes TTF y sus licencias OFL se conservan como en 1.1C. Queda pendiente convertir a WOFF2 en un entorno con Brotli disponible.

### Limpieza física de `public`

1. Se verificó que el fuente no referencia las copias antiguas.
2. Se preparó un borrado seguro con rutas resueltas dentro del workspace.
3. La ejecución fue bloqueada por límite del entorno.

Impacto: un build futuro seguirá copiando archivos antiguos no referenciados si no se limpia `public`.
