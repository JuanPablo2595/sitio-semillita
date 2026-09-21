# Prototipo local Semillita - Fase 1.1C

Prototipo visual local y privado de la home de **Sala Cuna y Jardín Infantil Semillita**.

Esta versión reproduce con mayor fidelidad la estructura, proporciones, ritmo y comportamiento responsive de `jardinhuellas.cl`, usando únicamente logo, colores, textos, fotografías, certificaciones y datos propios de Semillita. No copia código, textos, fotografías ni ilustraciones de la referencia.

## Cómo abrirlo nuevamente

1. En PowerShell, entra a esta carpeta:

   ```powershell
   cd "C:\Users\papo2\OneDrive\Escritorio\Web Semillita\Output\sitio-web"
   ```

2. Abre el prototipo compilado:

   ```powershell
   .\abrir-prototipo.ps1
   ```

3. Abre en el navegador:

   ```text
   http://127.0.0.1:4321
   ```

Si PowerShell bloquea scripts locales, usa:

```powershell
powershell -ExecutionPolicy Bypass -File .\abrir-prototipo.ps1
```

## Comandos útiles

Si Node.js y npm están disponibles en el sistema:

```powershell
npm run check
npm run build
npm run preview
```

En este entorno de Codex, `npm` no estaba disponible en PATH y `node.exe` respondió con acceso denegado desde PowerShell. La verificación de Fase 1.1C se ejecutó con las APIs locales de Astro desde el Node REPL integrado de Codex:

- `@astrojs/language-server` para el equivalente de `astro check`.
- `astro.build()` para el equivalente de `astro build`, con telemetría desactivada en memoria para no escribir fuera de `Output`.

## Edición rápida

- Datos, textos, enlaces y selección de imágenes: `src/data/site.ts`.
- Página principal: `src/pages/index.astro`.
- Header, portada y footer: `src/components`.
- Estilos generales: `src/styles/global.css`.
- Fuentes locales: `public/fonts`.
- Fotografías seleccionadas: `public/images/private-review`.
- Certificaciones: `public/images/certifications`.
- Ilustraciones originales Fase 1.1C: `public/images/illustrations`.

## Contenido Fase 1.1C

- Portada de pantalla completa con fotografía propia, tarjeta lateral verde y dos acciones: WhatsApp y llamada.
- Navegación sticky con agrupación en "Nosotros", acceso a "Niveles", "Nuestro jardín", "Actividades" y contacto por WhatsApp.
- Bloques ilustrados grandes para Sobre nosotros, Nuestro jardín y Actividades.
- Certificaciones públicas con RBD N.° 42.440-2 y dos imágenes grandes.
- Misión, Visión, Metodología, Equipo educativo y Nuestras familias como secciones alternadas.
- Niveles en carrusel local con 4 tarjetas e ilustraciones SVG propias.
- Jornadas en un único panel oscuro con 5 filas.
- Principios educativos en composición gráfica orgánica.
- Actividades oficiales en 14 acordeones, sin fotografías.
- Contacto sin formulario, sin bots, sin analítica y sin scripts externos.
- Footer simplificado y botón flotante "Volver al inicio".

## Alcance

- Sin Git configurado.
- Sin GitHub.
- Sin hosting, DNS ni deploy.
- Sin CMS.
- Sin analítica.
- Sin formularios.
- Sin bots ni respuestas automáticas.
- Prototipo local y privado con `noindex,nofollow`.
- Fuentes Gloria Hallelujah y Quattrocento Sans servidas localmente.
