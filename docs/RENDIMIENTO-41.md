# Rendimiento — Estable 41, revisión 1

Se retiró la decoración por MutationObserver de body y soulsApp. Las imágenes se declaran una vez por documento en hojas compartidas; los paneles construyen directamente sus iconos. Entrenamiento conserva sus nodos de texto cuando no cambia el valor, cachea controles y evita reconstruir la lista de skills cuando sus datos no cambian.

## Medición

Edge headless, viewport 1366×768, CPU limitada a 4×, calentamiento de 2 segundos y muestras de 8 segundos, contextos aislados nuevos. El FPS corresponde a la cadencia requestAnimationFrame del documento principal. Entrenamiento quedó activo sin automatizar aciertos: esta es una prueba sintética de carga, no una promesa de FPS en el equipo del jugador. Pesca se midió esperando la burbuja; no se midieron FPS durante captura activa ni arenas.

| Escenario | FPS antes | FPS después | Hilo ocupado antes / 8 s | Después / 8 s |
| --- | ---: | ---: | ---: | ---: |
| pesca | 59.8 | 59.8 | 0.49 s | 0.54 s |
| defensa | 44.1 | 58.0 | 7.96 s | 2.99 s |
| esquiva | 47.2 | 59.8 | 7.98 s | 2.80 s |

Se usa la segunda muestra inicial y el promedio de las dos muestras finales. La primera tanda inicial coincidió parcialmente con una compilación Node y se excluye. Las muestras finales se ejecutaron sin otra suite o compilación concurrente. Un intento preliminar con variables CSS demasiado grandes no pasó la comprobación de imágenes; se descartó. Las cifras de esta tabla corresponden exclusivamente a la solución final con hojas de estilo compartidas y sprites visibles.

En entrenamiento desaparecen los aproximadamente 350–380 recorridos del decorador por muestra y los 110.543.090 caracteres de imágenes repetidas en atributos style. Las imágenes siguen embebidas una vez en las reglas CSS; no se eliminaron ilustraciones ni se convirtió su tamaño en una supuesta medida de memoria real. El HTML sigue pesando aproximadamente 58 MB.

Los modelos de combate y entrenamiento, física de captura, precios, XP y serialización no se modificaron. El SHA de src/release.json se actualizó expresamente a la revisión optimizada; importedSha256 conserva la identificación de la importación original.

## Reproducir

La validación final `node tests/full.cjs` pasó: dos pruebas de compilación, 25 comprobaciones del HUD/cañas, 24 de entrenamiento/encargos, las pruebas de identidad de nodos y sprites compartidos, y 32 de integración con compras, arenas, personajes, importación y persistencia. No hubo errores de ejecución. Se ejecutó con NODE_PATH apuntando al Playwright instalado y PLAYWRIGHT_CHANNEL=msedge porque npm no está disponible en el PATH del entorno.

Instalar las dependencias y Chromium, o usar Edge con PLAYWRIGHT_CHANNEL=msedge. Ejecutar npm run build, npm run test:full y npm run perf. Para comparar, conservar un index.html anterior y proporcionar su ruta en PERF_BASELINE_HTML antes de ejecutar node tests/compare-performance.cjs. PERF_HTML permite medir una entrega concreta y el argumento del script nombra el informe. Los resultados se escriben en test-results, sin tocar partidas del jugador.

Datos seleccionados y muestras: [rendimiento-41.json](rendimiento-41.json). Las mediciones no prueban que se hayan resuelto todos los tirones; conviene probar la partida real y medir capturas y arenas si persisten.
