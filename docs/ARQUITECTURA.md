# Mapa vigente de Argentum Idle Online

Este mapa describe Estable 35 sobre la arquitectura consolidada de Pesca. Los prefijos numéricos son históricos; el orden efectivo es `src/blocks.json` y sus marcadores en `src/template.html`. Son scripts clásicos globales, no módulos aislados. Un `const previous = fn` retiene la implementación anterior aunque `fn` vuelva a asignarse.

## Compilación y distribución

- `scripts/build.cjs`: expande 143 bloques (70 JS / 73 CSS), incluye catálogos en su lugar, valida sintaxis, inserta biblioteca SVG y recursos autenticados. La concatenación conserva ámbitos y orden; no minifica ni procesa píxeles.
- `scripts/production-art.cjs`: metadata vigente = `arte/produccion-estable31.json` + `arte/produccion-estable34.json` (incluye el atlas pulido de Estable 35). `library()` solo construye SVG. `prepare()` escribe encuadres y `src/catalogs/133-art-frames.js`; no es parte del build habitual.
- `assets/manifest.json`: fuentes y variantes runtime, hashes. `index.html`: salida autocontenida offline, nunca fuente de edición. `.build-cache/`: URI por contenido, no subir.

## Dónde trabajar

| Sistema | Entradas relevantes | Dependencias / advertencias |
|---|---|---|
| Estado, roster, v7, IndexedDB/localStorage, import/export, combate | `src/js/core/005-core.js`, `src/js/layout/006-hybrid-upgrade.js` | Núcleo compartido. Buscar función concreta; no leer ni reescribir todo por un ajuste de Pesca. Las migraciones se extienden en 130. |
| Captura, física, dificultad, Control/Resiliencia | `src/js/fishing/minigame/052-e190-polish.js` | `e190FishingStep` y `e16Animate` activos aquí; perfiles en 142. No cambiar fórmulas por una mejora visual. |
| Inicio, sesión y burbujas | `018-e161-fishing.js`, `062-e195-fishing.js`, `064-e196-fishing.js` en minigame | `e195OriginalStart` retiene el inicio previo. No confundir una captura de función con código muerto. |
| Espera y selección | `src/js/fishing/minigame/075-e1103-progression.js` | Distribuciones y `e161NextBite` finales; la espera todavía llama una cadena histórica. |
| Cierre y registros | `src/js/fishing/minigame/087-e1111-catch-result.js` | Transacción con `fishingFinishDepth`; llama 8 predecesores para premios/registro, luego render y persistencia. |
| Peso, categorías y récords | `src/js/fishing/collection/122-e218-journal.js`, `src/js/fishing/142-progression32.js` | No fabricar récords por categoría a partir del absoluto. |
| Página Pesca | `src/js/fishing/page/render.js`, `base.js`, `zone-and-quests.js`, `collection-and-controls.js`, `artwork.js` | Una sola implementación de `e16Page`. El ciclo explícito conserva snapshots, profundidad, orden de fases y limpieza de cachés. Los bloques con nombre aíslan variables y salidas anticipadas; no llaman predecesores. Cinco fases sobrescritas por la presentación final fueron retiradas. |
| Tienda/selector | `src/js/fishing/shop/115-e1121-rod-shop.js`, `119-e217-rod-ux.js` | Catálogo/datos en 110 y catálogos asociados; comparar/equipar también depende de funciones históricas. |
| Atlas/encargos | `src/js/fishing/atlas/114-e216-atlas.js`, `src/js/fishing/expansion/130-expansion.js` | Definiciones se agregan y presentan en 136/138/140; progreso y premios no deben trasladarse a CSS/presentación. |
| Trofeos | `src/js/fishing/trophies/134-trophies.js` | Estado de vista en memoria y detalles seleccionados; no duplicar premios. |
| Diario/colección | `src/js/fishing/collection/122-e218-journal.js`, `src/js/fishing/collection/056-e192-collection.js`, `136-polish29.js`, `138-presentation30.js`, `140-world31.js` | Lecturas históricas y decoración no son intercambiables. |
| Arte HUD y entidades | `src/js/fishing/art/133-production-art.js`, `136-polish29.js`, `138-presentation30.js`, `140-world31.js` | 140 elige arte responsive; los fallbacks previos siguen capturados. Para encuadre editar metadata artística, no binarios a ciegas. La ejecución de los pasos de página y HUD ahora está centralizada en page/render y hud/update. |
| HUD y geometría | `src/js/fishing/hud/update.js`, `src/css/fishing/hud/117-fishing-hud-css.css` | Un único `e188UpdateHud`, sin envoltorios. El orden de arte, caña, menús, XP, zona y última captura está explícito. Callbacks privados de menú/XP conservan sus cierres en 099/100. CSS de 118px idéntico; acabado en 137/139/141/143. |
| Especies regionales y crédito v7 | `src/catalogs/130-regional34.js`, insertado en `src/js/fishing/expansion/130-expansion.js` | Crédito histórico congelado separado de capturas reales. No quitar IDs viejos ni volver a acreditar en cada carga. |
| Perfiles y mejoras permanentes | `src/js/fishing/142-progression32.js` y catálogos 142 | Mezcla estadísticas, registros, recompensas derivadas y presentación; candidato a separación posterior con pruebas. |

Las rutas abreviadas 136–142 corresponden a `src/js/fishing/`. Para nombres exactos usar `rg --files src`. Los catálogos son includes en el ámbito original; no ejecutarlos ni importarlos como módulos ES.

## Encontrar la implementación activa

1. Buscar `function nombre`, `nombre=function` y alias `const previo=nombre` en `src/`.
2. Consultar el orden de bloques e includes. Las declaraciones de función se elevan dentro de cada script; callbacks/listeners pueden ejecutarse después.
3. Seguir cada alias y sus llamadas; no basta tomar la última coincidencia textual.
4. Usar `npm run architecture:inventory` si hace falta rastrear otro sistema. El JSON guardado bajo `docs/auditoria-arquitectura/` describe la auditoría anterior a la consolidación; no es la arquitectura vigente de página/HUD. Es inventario sintáctico, no prueba de código muerto.
5. Para consolidar, comparar trazas por fase, estado persistido y DOM antes/después. `runtime.json` documenta las rutas observadas en esta auditoría, no todas las rutas posibles.

No existe dependencia de los ZIP, capturas o notas históricas para ejecutar el juego. Los archivos históricos que permanecen en `src/blocks.json` sí forman parte del runtime. Mantener esta distinción.

## Validación de cambios de presentación

`npm run test:render` compara contra `85355b4` la estructura de controles del minijuego, atributos, estado persistible y altura del HUD en todas las zonas y cinco fases, a 1366/390px. Normaliza seriales SVG y segundos de espera, y excluye únicamente los fondos de zona cuya sustitución se pidió en Estable 35. El nuevo aspecto, encargos y arte se verifican en `tests/fishing-experience.test.cjs`. Necesita el historial Git de la base (también lo requieren otras pruebas históricas).

`tests/fixtures/gameplay-estable34.json` autentica el AST de los motores, listeners y temporizadores, y los bytes de catálogos/CSS/plantilla/manifiesto. Excluye solo los cuerpos de render movidos y sus alias/bindings; la equivalencia de esos cuerpos se comprueba en navegador. Actualizar ese contrato requiere que un cambio de mecánica/datos forme parte del alcance; no regenerarlo para esconder un fallo.

`npm test` incluye automáticamente los archivos `tests/*.test.cjs`, con concurrencia 2 para limitar navegadores simultáneos. `test:fast` verifica compilación, recursos, contrato de lógica y arquitectura sin Chromium; `test:smoke` cubre captura y v7 sin capturas de pantalla. Elegir casos con `--test-name-pattern` para cambios locales y ejecutar integración completa para cambios transversales.
