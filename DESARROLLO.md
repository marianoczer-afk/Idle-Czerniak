# Fuentes y distribución · Estable 27

## Jugar / descargar

`index.html` en la raíz es **el juego completo generado**, con CSS, scripts e imágenes incorporados. No necesita Node, servidor ni recursos externos para funcionar. No abrir `src/template.html`: contiene marcadores de desarrollo deliberadamente incompletos. Las descargas desde dentro del juego siguen exportando el documento completo cargado; no leen la plantilla.

La copia anterior continúa disponible en Git en el commit `404c184`. Antes de cambiar el HTML se reconstruyó exactamente: 13.769.036 bytes, SHA-256 `05a1674bf411cf4aca2a555ceeaeda12f335ad9ead40069e6ff4e0f678d970dc`. No se descartó la versión previa sin comprobar equivalencia.

## Editar y compilar

```sh
npm ci
npm run build
npm run build:check
npm test
```

`npm run dev` compila y sirve la raíz en http://localhost:8000. Para cada cambio posterior ejecutar `npm run build` de nuevo y recargar. Solo desarrollo requiere Node; Playwright sirve para pruebas. Acorn se usa únicamente en la importación inicial, no se incluye en el juego. La compilación usa módulos estándar de Node, sin bundler pesado.

- `src/template.html`: estructura HTML, etiquetas originales y marcadores de bloques/recursos.
- `src/blocks.json`: orden explícito de 133 bloques (65 JS, 68 CSS). **Conservar orden**: existen funciones globales extendidas por capas históricas.
- `src/js/`: sistemas actuales, herramientas DEV, interfaz, pesca, HUD, tienda, Atlas, colecciones y minijuego. La separación es progresiva: no cambia ámbitos ni reescribe motores que funcionan.
- `src/css/`: componentes/áreas, manteniendo la cascada original.
- `src/catalogs/`: 24 archivos de datos de peces, zonas, cañas, encargos, familias, especialidades y perfiles. Se insertan en su ubicación original con `/* @include ruta */`. No son módulos ES ni deben ejecutarse por separado. Los catálogos generados siguen derivándose de sus familias; no se duplican sus listas manualmente.
- `assets/originals/`: 129 recursos únicos: 117 extraídos del HTML original y 12 atlas nuevos, autenticados por SHA-256.
- `assets/runtime/`: variantes optimizadas, verificadas píxel por píxel.
- `assets/manifest.json`: ID estable por contenido, archivo original/runtime, formato, hashes, tamaños, dimensiones cuando se convierten y referencias. No renombrar IDs de entidades de juego al cambiar imágenes.
- `arte/manifest-produccion.json`: vínculo de los IDs reales de entidades con recursos compartidos, uso, estado, tamaños de exportación y brief. Los IDs de archivo por contenido pueden cambiar con una nueva ilustración; el ID de pez/caña/zona permanece estable.

El compilador valida sintaxis, hashes y marcadores pendientes, resuelve recursos una sola vez por compilación y escribe el resultado atómicamente. `.build-cache/` guarda las representaciones de imagen para evitar codificar Base64 otra vez al cambiar lógica. No subir esa caché. `build:check` detecta un HTML que no corresponde a las fuentes.

Para agregar otro minijuego: crear JS/CSS separados, registrar sus bloques en el manifiesto y sus etiquetas/marcadores en la plantilla. Mantener sus datos fuera de la presentación. No agregar peticiones a archivos de fuentes desde el HTML distribuido. La prueba `tests/build.test.cjs` verifica que la distribución esté actualizada y sea determinista.

## Preparar arte

```sh
# Opcional, solo cuando cambian imágenes PNG originales:
python3 -m pip install -r requirements-art.txt
npm run assets:optimize
npm run build
node scripts/export-art-inventory.cjs
node scripts/build-art-manifest.cjs
```

Las conversiones son WebP **sin pérdida**, con igualdad RGBA exacta, sin redimensionar, recortar ni deformar. Si la igualdad falla o el archivo no baja de tamaño, se conserva el original. No se reprocesan los WebP existentes. No se crearon variantes de tamaño sin beneficio demostrado. El juego conserva las ilustraciones actuales, incluso los recortes/textos históricos que requieren sustituir el original artístico más adelante.

El manifiesto de producción contiene las 41 especies existentes, las 50 cañas ofrecidas, las 10 zonas, los elementos de interfaz y las 9 especies / 3 zonas propuestas. Las 40 cañas históricas restantes se mantienen identificadas y jugables si se poseen. Los tamaños recomendados son resoluciones de exportación; no son cambios de tamaño de los componentes. Se basan en el HUD medido a 1366/390 px, cabeceras de 40 px y el encuadre 1,8:1 de Colección/Diario. No producir todavía el catálogo nuevo: primero aprobar `EXPANSION_PESCA_26.md`.

## Publicar

Ejecutar build, comprobación y pruebas; confirmar fuentes, manifiestos, imágenes y `index.html` juntos en Git. GitHub Pages sirve el HTML raíz ya generado: no compila la plantilla. GitHub → Code → `index.html` → **Download raw file** descarga el juego; Code → **Download ZIP** incluye fuentes y HTML. Los enlaces por commit permiten identificar exactamente la entrega.

## Límites de verificación

Chromium administrado bloquea `file://` con `ERR_BLOCKED_BY_ADMINISTRATOR`: no se pudo probar directamente la persistencia al abrir desde disco en esta máquina. La suite sí prueba el HTML completo descargado, carga, ausencia de dependencias externas y guardados v7 con perfiles aislados por HTTP. La persistencia real de archivos locales depende además de cómo el navegador asigna su origen al archivo; moverlo o cambiar de navegador no migra automáticamente partidas. Exportar JSON permite trasladarlas sin alterarlas.

## Arte y expansión de Estable 27

`src/catalogs/130-expansion.js` contiene zonas, especies, encargos y la referencia congelada de maestrías. `src/js/fishing/expansion/130-expansion.js` los integra y acredita progreso histórico mediante extensiones opcionales de v7. `src/js/ui/132-global-header.js` presenta la cabecera y mueve los controles originales. No editar el HTML generado.

`arte/produccion-estable27.json` vincula cada ilustración con atlas y encuadre. `npm run art:prepare` regenera los SVG individuales de `assets/illustrations/` y `src/catalogs/133-art-frames.js`; `npm run build` incorpora la biblioteca compartida y sus límites de clipping. `npm run art:gallery` genera la galería de revisión. Para producir otro lote, `scripts/import-production-art.py JOBS.json` acepta una lista de claves/rutas de archivos generados y usa los encuadres de producción revisados; es una herramienta de importación explícita, no una tarea del build diario. Actualizar los encuadres al cambiar una lámina.

Los atlas nuevos usan WebP calidad 90 con resolución original, no compresión sin pérdida. `assets:optimize` respeta esa decisión y no vuelve a convertirlos a un archivo más grande. Los originales completos permanecen intactos. El compilador exige los hashes runtime y no duplica cada atlas al insertar sus múltiples símbolos.

El manifiesto artístico actual contiene 50 especies, 50 cañas activas y 13 zonas reales. Las secciones anteriores que describen las conversiones sin pérdida se refieren a las tres imágenes optimizadas en Estable 26. Para el contenido efectivamente incorporado y sus diferencias respecto de la propuesta, ver `ESTABLE_27.md`.
