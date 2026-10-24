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

## Fuentes vigentes de Estable 28

El catálogo visual vigente es `arte/produccion-estable28.json`; `production-art.cjs`, `art:prepare` y `art:gallery` usan esa versión. La metadata y los originales de 27 permanecen archivados. `scripts/import-presentation28.py` reconstruye el lote desde los PNG originales conservados, sin generar imágenes ni recortarlas destructivamente. No ejecutarlo para el build cotidiano: basta `npm run build`. Los SVG individuales son viewports recortados explícitamente a su celda; comparten 15 atlas WebP a resolución original y calidad 90.

`src/js/fishing/trophies/134-trophies.js` calcula los reconocimientos a partir de los registros existentes y mantiene los filtros en memoria por personaje (`WeakMap`). No añade bucles de animación ni observadores. `135-presentation.css` solo afecta Pesca; no cambia la geometría del HUD. La hoja canónica `117-fishing-hud-css.css` sigue idéntica. Los cinco encargos complementarios están en `E228_REGIONAL_QUESTS`, junto al catálogo de expansión; usan el mismo reclamo protegido y conceden equipo existente sin equiparlo ni compensarlo con oro.

`node scripts/review-progression28.cjs` produce simulaciones aisladas. `tests/trophies28.test.cjs` compara medidas reales de HUD contra el HTML del commit 27, en 1366 y 390 px; prueba filtros, navegación, insignias y reclamos únicos. No usa perfiles de usuario ni partidas reales. Ver `PROGRESION_28.md` y `ESTABLE_28.md` para criterios, límites y resultados.

## Estable 29

Metadata artística vigente: `arte/produccion-estable29.json`; las versiones anteriores quedan archivadas. Las tres cabeceras nuevas comparten una imagen. `136-polish29.js` integra los componentes al final del ciclo de página y prepara las composiciones SVG del HUD a su tamaño real; `137-polish29.css` no cambia las dimensiones del HUD. El Diario agrega `category` al estado de vista en memoria, no al guardado. `tests/polish29.test.cjs` cubre la nueva interacción y reclamos; `scripts/capture-polish29.cjs` produce evidencia antes/después contra Estable 28.

La política de premios de oro de encargos cambia en el handler de `130-expansion.js`, sin reescribir `state.gold` al cargar ni migrar flags. Los campos históricos del catálogo se conservan como referencia, pero no se usan para conceder oro en nuevos reclamos. Consultar `ESTABLE_29.md` para el alcance y los límites del arte histórico y filtros. Las seis muestras quedan exclusivamente en `arte/muestras29/`; no ingresan en el build del juego.

## Estable 30: presentación y transparencia

El catálogo vigente de recortes está en `arte/produccion-estable30.json`; `npm run art:prepare` regenera los SVG y sus marcos. Después ejecutar `npm run build`, `node scripts/export-art-inventory.cjs`, `npm run art:gallery` y `node scripts/build-art-manifest.cjs`. Los recursos originales anteriores se conservan. Las 19 hojas añadidas tienen PNG original RGBA y WebP de ejecución a 512 × 768, calidad 85, documentados por recurso en `assets/manifest.json`. Los recortes son coordenadas SVG, no modificaciones destructivas del original. `arte/transparencia-estable30.json` registra la comprobación del canal alfa. No regenerar esos recursos al cambiar lógica o CSS.

La composición del HUD está en `138-presentation30.js`, su geometría canónica en `117-fishing-hud-css.css` y el acabado en `139-presentation30.css`. La suite comprueba 118 px, ausencia de desbordes y objetivos/reclamos. Los requisitos y recompensas siguen en sus catálogos, nunca en la presentación. `node scripts/capture-presentation30.cjs` compara contra el commit de Estable 29 usando perfiles aislados.

## Estable 31: recursos y captura

`arte/produccion-estable31.json` es el catálogo artístico activo. `npm run art:prepare` conserva recortes independientes y comparte 40 imágenes en el HTML. Las versiones corregidas de peces y cañas se reutilizan en todas las vistas; el escenario se define una sola vez como patrón SVG. Los originales anteriores siguen archivados. `140-world31.js` contiene presentación y cachés limitadas a un render; `140-regional31.js`, los encargos aditivos; `052-e190-polish.js`, el movimiento y tensión de captura. No modificar `117-fishing-hud-css.css` para ajustar ilustraciones: el HUD mantiene 118 px.

Ejecutar `node scripts/simulate-fishing31.cjs index.html /tmp/balance31.json` para comparar cañas con un controlador de reacción retardada. `tests/world31.test.cjs` prueba además las 50 especies, máxima cobertura/resiliencia, maestrías históricas y premios únicos. `node scripts/measure-finish31.cjs` mide el cierre de captura con CPU ralentizada. Capturas: `capture-presentation31.cjs`, `capture-details31.cjs` y `capture-world31.cjs`; usan perfiles aislados. Preparar el ZIP con `python3 scripts/package-release.py`.
