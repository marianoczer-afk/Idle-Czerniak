# Auditoría de arquitectura y tiempo de trabajo — Estable 34

Fecha: 24 de octubre de 2026. Base: `f8461b8`, sobre `59e988e` (Estable 33). Rama de trabajo: `audit/architecture-workflow`. No se publicó en `main`.

## Conclusión

**No hay evidencia de que compilar explique esperas de 40–60 minutos.** El build completo verifica un HTML de 25,91 MB en 0,40–0,64 segundos en esta máquina. La suite actual de Pesca tarda 13,96 segundos. Sí hay una deuda arquitectónica demostrada: 41 implementaciones encadenadas para reconstruir Pesca, 9 para actualizar el HUD, responsabilidades mezcladas y pruebas históricas incompatibles con cambios ya aceptados. Esto aumenta los archivos que hay que rastrear y la incertidumbre de cada modificación.

No dispongo de una traza temporal del agente de las entregas de 40–60 minutos: no puedo asignar porcentajes de esa demora a razonamiento, generación artística, herramientas remotas, repetición de pruebas o comunicación. La relación entre deuda y tiempo de análisis es una hipótesis sólida, no una medición de horas ahorradas. Las métricas siguientes miden este checkout y este entorno, no un teléfono físico.

## 1. Compilación y orden real

`scripts/build.cjs` lee `src/template.html` y `src/blocks.json`. Hay **143 bloques: 70 scripts y 73 estilos**; 170 archivos alcanzables contando includes. Cada bloque sustituye su marcador en la plantilla. Los catálogos se insertan textualmente en el punto `/* @include ... */`. Se valida cada script y también la combinación para detectar declaraciones globales incompatibles. La ejecución y cascada finales siguen el documento HTML: los marcadores se mantienen en el orden del manifiesto actual.

Los scripts son clásicos: comparten globals y retienen funciones antiguas mediante alias. No hay aislamiento ES modules, tree shaking ni carga diferida. El último archivo de lógica de Pesca es `142-progression32.js`, que ya incorpora ajustes posteriores; no existe un módulo separado por cada número de versión visible.

La biblioteca SVG se deriva de **produccion-estable31 + adiciones de estable34**, no de todos los JSON históricos. `library()` valida 342 encuadres y produce símbolos que comparten 44 láminas. El build inserta **136 recursos únicos**, con 137 referencias, y lee 18.805.452 bytes runtime. No abre todos los PNG originales ni convierte píxeles. La caché evita recodificar Base64, aunque mantiene lectura y hashes de recursos, por integridad.

Los originales, catálogos artísticos antiguos, ZIP y capturas archivadas no se cargan automáticamente en el build. Parte del arte antiguo sí está referenciado por código activo de fallback y por otros sistemas: no se puede borrar por fecha o por ser anterior a 31.

Evidencia: [inventario ordenado](auditoria-arquitectura/inventario.json), [perfil de build](auditoria-arquitectura/profile.log), `scripts/build.cjs`, `scripts/production-art.cjs`.

## 2. Redefiniciones: qué está activo y qué no está demostrado muerto

Inventario AST de declaraciones/asignaciones explícitas, seguido de trazas en Chromium sobre una copia instrumentada **en memoria**, sin editar el juego:

| Función | Sitios sintácticos | Ruta observada actual | Interpretación |
|---|---:|---|---|
| `e16Page` | 42 | 41 cuerpos en una llamada normal, desde 140 → 136 → 134 → 130 → … → 018 | 40 envoltorios siguen ejecutándose sobre el renderer de 018. El cuerpo original de 016 no apareció. |
| `e16Finish` | 10 | 9 cuerpos: 087 → 049 → 047 → 043 → 041 → 039 → 035 → 021 → 018 | Hay premios/estadísticas en predecesores. No sustituirlo por el último wrapper aislado. |
| `e188UpdateHud` | 9 | 136 → 102 → 100 → 099 → 097 → 080 → 060 → 050 → 049 | Las 9 implementaciones siguen activas. |
| `e16Paint` | 5 | 102 → 050 → 021 → 018 | El cuerpo vertical de 016 no apareció; 021 corrige geometría antes de pintar. |
| `e161NextBite` | 8 | 8 cuerpos durante el cierre/inicio siguiente | La espera final de 075 aún pasa por temporizadores previos antes de sustituirlos. |
| `migrateState` | 3 | Dos capas en 130 + núcleo 005 | Ambas migraciones aditivas siguen necesarias: maestría y crédito regional. |
| `e194RodArt`, `e189FishSVG` | 7 y 9 | Con IDs conocidos, solamente el cuerpo de 140 | Los anteriores quedan como fallbacks capturados; la traza de IDs conocidos no demuestra que puedan eliminarse. |
| `renderGame` | 19 | Inventario estático, no se instrumentó la cadena completa | No afirmar 18 wrappers activos solo por contar alias. |

También hay 7 sitios de `selectWorkspaceTab`, 7 de `updateLive`, y varias extensiones de inventario/combate. El inventario puede incluir nombres locales repetidos: no es una lista de borrado automático.

Dependencias verificadas: `e195OriginalStart` captura el inicio previo y se invoca al terminar las burbujas; `e163Paint` conserva el pintor horizontal; `e227PreviousFishArt`/`e231OldFishArt` son fallbacks; `fishingFinishDepth` impide renderizados intermedios y premios duplicados. Quitar estos alias sin reemplazo rompe funcionalidad.

Candidatos de limpieza, **no eliminados**: el cuerpo base de página/pintura/cierre de 016 fue sustituido sin aparecer en las trazas; `e1117RodOld` solo tiene su declaración en las fuentes actuales. El archivo 016 conserva catálogo, utilidades y handlers útiles; 095 contiene más comportamiento que ese alias. La ausencia en una ruta no autoriza eliminar archivos completos. Antes de retirar cuerpos, comprobar referencias dinámicas, arranque, DEV, cambio de personaje y fallbacks, además de las rutas ya observadas.

Durante un cierre ganado hubo 7 entradas al wrapper externo de página, pero solo una llegó al renderer base: **no son siete reconstrucciones completas**. Los guards actuales funcionan. Tampoco equivale un wrapper a un listener duplicado; esta auditoría no encontró una prueba que justifique borrar listeners en bloque.

Evidencia completa por llamada: [runtime.json](auditoria-arquitectura/runtime.json). Es una captura con un personaje aislado de prueba, no un grafo exhaustivo de todas las rutas.

## 3. CSS y responsabilidades

Chromium encontró el mismo selector del panel de minijuego repetido 11 veces, `#page_fishing .e192Sprite` 10 veces y `#page_fishing .fishTank` 7 veces. Este último conserva una evolución real: tanque vertical de 100×300, luego 112×300, después horizontal de hasta 520×94, regla móvil de 80 y posterior altura 76. Repetir selector no basta para declararlo erróneo: importan especificidad, contexto responsive y orden.

Es deuda activa porque el renderer inicial genera estructuras que otras capas mueven, decoran y sustituyen. Ejemplo concreto: 018 crea DOM de tienda/controles; 077 mueve resumen a un desplegable; 080 añade UI; 082 mueve el botón fuera del minijuego; 084 quita cancelación redundante; 115 reemplaza la tienda; 136/138 reconstruyen encargos. El costo de mantener ese recorrido es mayor que el costo de parsear sus archivos.

No consolidé CSS de Pesca en esta entrega: requiere comparar estilos computados y fases, especialmente la estabilidad vertical y el HUD de 118px. Los snapshots vigentes de 34 conservan esa altura en 1366/390px. La mediana de diez llamadas sin instrumentación a `e16Page()` fue **35,85ms** en escritorio de este entorno; mide llamada síncrona, no pintura completa ni fluidez en móvil. Es un candidato a mejorar respuesta del juego, no explicación directa de 40 minutos de trabajo de Codex.

Archivos relevantes por tamaño: núcleo `005-core.js` **99.215 bytes** (persistencia, roster, combate, inventario, UI, listeners, arranque); DEV `010-dev-progression.js` **27.987**, `013-progression-lab.js` **23.263**; base Pesca 016 **16.704**; Trofeos 134 **15.729**; suite `stability.test.cjs` **159.487**. El catálogo de marcos 133 tiene **37.058 bytes**, pero es generado, no lógica que deba estudiarse para cambiar filtros. `142-progression32.js` mezcla perfiles de captura, registros/categorías, premios derivados y presentación. No son tamaños extremos por sí solos; el acoplamiento es el problema más relevante.

Evidencia: [tamaños](auditoria-arquitectura/sizes.json), [CSSOM y medición sin instrumentación](auditoria-arquitectura/css-runtime.json).

## 4. Mediciones y separación de causas

| Categoría | Medición real | Qué permite concluir |
|---|---|---|
| Compilación | Sin caché URI: 0,635s; con caché: 0,601 / 0,402 / 0,605s. Procesos Node nuevos, caché del sistema operativo no controlada. | No es cuello de botella de minutos. No se justifica un bundler nuevo. |
| Arte en build | Perfil: metadata 0,69ms, biblioteca 4,26ms, expansión/parseo 82,75ms, recursos 87,35ms, validación combinada 35,26ms; total interno 356,40ms. | Validar/incrustar imágenes cuesta poco aquí. No atribuir a generación de imágenes, que no forma parte del build. |
| Optimizador opcional | Antes 4,300s y reconvertía tres PNG ya optimizados; después 0,060s y omite los tres autenticados, misma entrada de recursos en copia temporal. | Mejora comprobada, limitada a cuando se invoca esa herramienta. No explica 40–60min. |
| Pruebas actuales de Pesca | 8/8, 13,96s, incluye capturas Chromium. | Una pasada dirigida cuesta segundos. Repetir muchas pasadas suma, pero no se midió su frecuencia histórica. |
| Suite general histórica | Corrida serial limitada a 180s: 86 casos aprobados y 20 fallidos emitidos antes del límite; no terminó. | No hay duración total medida ni aprobación global. Rehacerla por cada ajuste pequeño genera costo e incertidumbre. La configuración serial de esta medición no es el paralelismo predeterminado de `npm test`. |
| Muestra de fallos históricos | 8 fallos reproducidos en 14,21s. | Hash congelado anterior a cambios aceptados; dos expectativas `Estable 33` cuando el juego dice 34; cinco expectativas de máscaras/overlays sustituidos por ilustración real. Estos fallos no se arreglan reintroduciendo overlays. Los otros fallos de la corrida parcial requieren triage; no se presumen todos obsoletos. |
| Nuevos comandos | `test:fast` 0,866s, 4/4; `test:smoke` 3,994s, 2/2; `test:assets` 0,767s, 4/4. Incluye arranque npm. | Hay una vía corta verificada, manteniendo disponible la suite completa y sus fallos. |
| Contexto/archivos | `src`: 173 archivos, 749.482 bytes; JS 507.795, CSS 127.418, catálogos 77.960. `assets`: 603 archivos / 225,25MB; `arte`: 407 / 113,96MB; descargas: 16 / 110,61MB. | Para lógica se puede trabajar con fuentes pequeñas. No hace falta procesar binarios/ZIP. No se midieron tokens internos ni tiempo de lectura/razonamiento de Codex. |

No se cronometró generación artística remota ni capturas por separado del resto de cada prueba. Atribuirles la demora histórica sería especulación. Tampoco se midió duración de clone/checkout, ni una corrida completa con el paralelismo por defecto.

El primer intento de Chromium dentro del sandbox fue rechazado por `listen EPERM`; se repitió con permiso para servidor local. No se contabiliza ese fallo ambiental como fallo del juego. Las corridas con capturas usaron `/tmp/argentum-audit/bench`, con salida artística separada para no sobrescribir las evidencias publicadas.

## 5. Plan priorizado, listo para implementar

| Prioridad / estado | Archivo o función, problema y evidencia | Cambio exacto | Beneficio esperado | Riesgo / esfuerzo | Pruebas necesarias |
|---|---|---|---|---|---|
| P0 **aplicado** | `DESARROLLO.md` alternaba instrucciones de catálogos 27/28/29/30/31/34; fuentes generadas y descargas entraban en búsquedas generales. | Documentación vigente corta, historial conservado en archivo separado, mapa de sistemas, AGENTS y `.rgignore` con escapes explícitos. | Menos búsquedas/contexto irrelevante y menos regeneraciones por instrucciones obsoletas. Ahorro de tiempo del agente aún no medido. | Bajo / pequeño. | Verificar rutas, fuentes y HTML idénticos. |
| P0 **aplicado** | `package.json`, suites mezcladas de 25–34; medición serial supera 180s y expectativas caducas. | Añadir `test:fast`, `test:smoke`, `test:assets`, `test:full`. `npm test` sigue ejecutando integración completa; no se ocultan fallos. | Comprobación inicial <1s y smoke ~4s; reservar validación amplia para alcance adecuado. | Bajo / pequeño. | 4 casos rápidos, 2 de captura/v7, 4 del optimizador. Ejecutados. |
| P0 **aplicado** | `scripts/optimize-assets.py` ignoraba variantes verificadas sin campo `compression` y las recomprimía. | Reutilizar solo si fuente/runtime coinciden con hashes y `pixelEquality===true`; archivo inexistente/corrupto se reconstruye. No reescribir manifiesto sin conversiones. | 4,30s → 0,060s en las tres imágenes candidatas actuales. | Bajo / pequeño. | Caché válida, runtime ausente/corrupto, fuente cambiada; cuatro fixtures aisladas aprobadas. |
| P0 **aplicado** | Build sin desglose, redefiniciones difíciles de ubicar. | Perfil opcional de fases/cantidades y generador AST de orden, includes y alias. Salida offline idéntica. | Localizar costos y dependencias sin releer 26MB. | Bajo / pequeño. | Perfil produce mismo HTML; inventario sigue manifiesto e incluye crédito34. Aprobadas. |
| P1 pendiente, **alto impacto** | `tests/build`, `expansion27`, `progression32`, `polish33`, `stability`: ejemplos de fallos descritos arriba. | Clasificar cada fallo contra cambios aceptados; sustituir expectativas de versión literal por metadata vigente; validar frame pintado O fallback según categoría. Mantener aserciones de progreso/premios. Retirar comparación de hashes por versión solo al reemplazarla por contratos conductuales equivalentes. | Suite de integración confiable, menos tiempo persiguiendo falsos positivos. | Medio / mediano. No basta actualizar snapshots a ciegas. | Ejecutar cada caso corregido y la integración completa sin timeout; conservar casos de v7, premios únicos, móvil y combate. |
| P1 pendiente, **alto impacto** | `e16Page`: 41 cuerpos; 018 + 077/078/080/082/084 y 115 cambian el mismo DOM. | Primero agregar caracterización de DOM/estado/scroll para espera, burbuja, captura, escape y éxito. Luego mover **solo la composición de toolbar/panel** a una función única, suprimiendo exactamente las mutaciones equivalentes de esas capas. Mantener demás helpers/listeners de cada archivo. Un sistema por commit. | Cambiar controles/layout sin rastrear 40 capas; menos DOM transitorio. Magnitud de ahorro no medida. | Medio-alto / mediano. | Comparar DOM final, estilos computados, tamaño/posición entre fases, input táctil, selector/tienda, HUD118 y guardados. |
| P2 pendiente | `e188UpdateHud`: 9 implementaciones; 049/050/060/080/097/099/100/102/136. | Separar un modelo de lectura del HUD, crear estructura una vez y una actualización de valores/arte; reemplazar wrappers uno a uno por llamadas explícitas. No modificar 117 ni el layout. | Menos puntos que entender para tocar el HUD y menos actualizaciones repetidas. | Alto / mediano. | Capturas/medidas escritorio y móvil, XP Drops/level-up, última captura/récord, navegación y progreso en vivo. |
| P2 pendiente | `e16Finish` y `e161NextBite`: 9 y 8 cuerpos, con persistencia/temporizadores y premio histórico. | Antes de tocar, caracterizar ganancia/pérdida y side effects; después consolidar cierre y scheduler en fases explícitas (premiar, registrar, actualizar, programar, guardar), respetando guards y fórmulas byte-equivalentes. | Menos incertidumbre y dependencias para depurar fin de captura. | Alto / grande relativo. **No aplicar como limpieza superficial.** | Premio único en todas categorías/zonas, escape sin premio, no reentrada, cancelar/cambiar personaje, cola persistente, v7 import/export e IDs históricos. |
| P2 pendiente | CSS histórico: mismos selectores con 11/10/7 apariciones. | Consolidar únicamente reglas del panel ya caracterizado por JS, preservando especificidad/media queries/variables; no juntar todas las hojas de una vez. | Hoja efectiva legible; menos regresiones entre fases. | Medio-alto / mediano. | Comparación de estilos computados por fase y ancho, scroll y HUD118. |
| P3 pendiente | `005-core.js` 99KB y 142 mezcla dominios. | Extraer primero funciones puras de perfiles/lecturas a includes de igual ámbito y misma posición. Mantener API e IDs. Posponer módulos ES y migraciones de persistencia. | Menos contexto para cambios localizados. | Medio / mediano; núcleo persistente alto riesgo. | Comparación determinista de retornos con fixtures y pruebas del dominio afectado. |
| P3 candidato condicionado | Cuerpos base sustituidos de 016 y alias `e1117RodOld`. | Retirar solo tras demostrar ausencia de referencias/callbacks/DEV; no retirar archivos ni arte de fallback por antigüedad. | Menos ruido, ahorro de ejecución probablemente mínimo. | Medio / pequeño para alias, mayor para cuerpos. | Búsqueda/AST, trazas de arranque y DEV, todos los casos de captura y fallback. |

No recomiendo ahora introducir Vite/Webpack, cachear hashes por mtime (debilita la verificación), convertir todo a ES modules ni comprimir arte para acelerar Codex: no están respaldados por el cuello de botella medido. `art:prepare` reescribe 342 viewports al invocarse, pero no se llama desde build; ejecutarlo selectivamente basta por ahora. Capturas optativas y servidor/browser compartidos entre suites pueden evaluarse después de corregir contratos históricos; compartir estado entre casos indiscriminadamente arriesga ocultar contaminación.

## 6. Cambios preparados y verificación de límites

Se aplicaron solamente herramientas/documentación y la caché del optimizador. **Ningún archivo de `src/`, imagen, manifiesto de recursos, guardado ni `index.html` fue modificado.** El HTML generado sigue en 25.910.428 bytes, SHA-256:

`a421edea9d4d2e61100ade402f43fe1b1cade573cb3af66cff6c89f9d475623e`

Esto demuestra equivalencia exacta de la distribución offline y preservación de las mecánicas/balance de esta entrega. El smoke test también ejecutó captura, persistencia, exportación/importación v7 y recarga conservando inventario, récords, recompensas, equipo, habilidad/XP y oro, además del crédito histórico congelado. No afirma que se hayan probado todos los guardados reales existentes ni un móvil físico.

La suite actual de Pesca pasó 8/8; las pruebas nuevas y rápidas pasaron. **La suite histórica no está verde ni completa**. Los fallos se conservaron documentados y no se modificó el juego para satisfacer expectativas de versiones anteriores. No se hizo una nueva publicación de juego ni ZIP porque la distribución no cambió.

Recursos disponibles: fuentes completas, arte original/runtime, Node24, Playwright1.58.2, Acorn8.15.0, Chromium y Pillow. No falta un ZIP para compilar/probar. Para atribuir las demoras históricas con precisión falta una cronología de herramientas/agente de esas sesiones (duración de llamadas, generación artística, repeticiones y períodos sin herramientas); para certificar fluidez móvil falta probar en dispositivos físicos. No se necesita ninguno de esos recursos para aplicar las mejoras seguras ya preparadas.

Los JSON/logs vinculados son evidencia, no un kit que el usuario deba ejecutar. Reproducción opcional: `npm run build:profile`, `npm run test:fast`, `npm run test:smoke`, `npm run test:assets`, `npm run architecture:inventory`; las trazas portables están en `auditoria-arquitectura/metodo-runtime.cjs` y `metodo-css-runtime.cjs`. Producen un HTML instrumentado solo en memoria y usan un personaje aislado. Las mediciones son muestras locales, no benchmarks universales.
