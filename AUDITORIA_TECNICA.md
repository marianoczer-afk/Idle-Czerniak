# Auditoría técnica — Estable 19

## Alcance

Revisión estática de los 59 scripts y 64 bloques de estilo completos, inventario de eventos y temporizadores, persistencia normal/DEV, y pruebas de integración en Chromium. Se utiliza el HTML real con sus ilustraciones embebidas. No se requieren compilación, librerías ni recursos externos para jugar.

## Problemas comprobados y correcciones

- **Sesiones de pesca huérfanas:** cambiar a DEV dejaba `e16Session` y `e161Fishing` activos; importar o borrar el personaje activo tampoco limpiaba todas las actividades temporales. Se reutiliza la cancelación existente antes de separar el estado activo, después de las confirmaciones y respaldos correspondientes. Se cancelan RAF, espera, burbujas y efectos de XP. Cancelar una importación mantiene el intento actual. La normalización de guardados sigue siendo una operación separada: decodificar otro personaje no cancela al que se está jugando.
- **Cola de guardado bloqueada por abortos de IndexedDB:** `idbPut` atendía `complete` y `error`, pero no `abort`. Una transacción abortada sin un evento de error podía dejar su promesa pendiente e impedir los guardados posteriores. Se rechaza también en `abort`, permitiendo la alternativa localStorage y el siguiente trabajo de la cola. Prueba con una transacción real abortada deliberadamente.
- **Descarga parcial obsoleta:** el botón de “versión estable anterior” quitaba scripts de progresión que otras partes actuales necesitan. Ya no se produce esa combinación incompleta: ambos accesos entregan el mismo `index.html` completo. El botón secundario indica “Descargar copia completa”. También se excluyen menús flotantes y efectos temporales del documento exportado.
- **XP tardía casi invisible:** una ganancia recibida cerca del final de un XP Drop se agregaba al texto que estaba por desaparecer. Se agrupan ganancias inmediatas y se mantiene, como máximo, una siguiente ganancia acumulada por habilidad. Esa siguiente animación recibe su duración completa, sin reiniciar la anterior ni modificar la XP real. Se liberan efectos y referencias al abandonar el personaje o esconder la página.
- **Referencias históricas incorrectas de cañas:** dos decoradores consultaban un identificador inexistente protegido con `typeof` y usaban un fallback. Ahora consultan las cañas de misión reales; no se cambian sus ilustraciones ni estadísticas.

## Optimizaciones y limpieza segura

- Inventario unificado: los accesos actuales llaman al mismo renderer y evitan reconstrucciones si oro, objetos, orden y personaje no cambiaron. Los botones conservan foco e identidad durante actualizaciones sin cambios; ventas y reordenamiento siguen usando sus manejadores originales.
- Medición aislada: **20 llamadas consecutivas a `updateInv()` sin cambios producían 400 mutaciones; ahora producen 0**. La regresión automatizada comprueba 40 actualizaciones sin mutaciones y después verifica una venta y un cambio de orden.
- El registro de combate y el listado base de objetos evitan asignar HTML idéntico.
- El observador que decora el selector de zonas observa inserciones directas en `body`; ya no recorre la página ante cada actualización interna de texto, barra o inventario. Los menús se construyen completos antes de insertarse.
- Se elimina la construcción del Diario de texto que inmediatamente era reemplazado por el álbum ilustrado. Además, el álbum respeta la transacción de finalización: una captura reconstruía el Diario **7 veces**; ahora lo hace **1 vez**, después de registrar peso y categoría. Se verifica que la tarjeta final refleja el registro definitivo.
- Se elimina un listener de teclado sustituido por el manejador vigente en captura, además del código de objetivos situado después de un `return` incondicional, sus controles sin productores y su registro de ganancias sin consumidores. Las preferencias históricas guardadas no se borran.
- Se retiran únicamente las reglas de la animación verde sin llamadas desde Estable 18. No se cambia la cascada vigente del minijuego ni la altura de sus fases.

## Compatibilidad y límites

No se introduce migración ni se cambia el formato v7. `migrateState`, `safeCharacter`, `decodeRoster`, los récords de captura y las condiciones del Atlas conservan sus definiciones. Se verificaron cinco personajes mediante descarga real de JSON, importación, escritura, recarga y comparación de IDs, oro, XP, propiedad y selección de cañas, inventario, récords, recompensas y campos históricos adicionales. Los anclajes de reloj de pociones llenas se actualizan al renderizar, como antes; no son pérdida de progreso.

También se probó el fallback a localStorage tras abortar IndexedDB, la escritura posterior en ambos almacenes y el fallback a IndexedDB ante una cuota localStorage simulada. Se mantienen las pruebas de migración v1–v6, aislamiento DEV y progreso offline. Estas pruebas usan perfiles aislados: no acceden a partidas del usuario.

La comparación estática con Estable 18 confirmó **71 definiciones protegidas idénticas**, incluidas tablas de peces/cañas, fórmulas y condiciones de progreso. Las **118 cadenas de ilustraciones embebidas permanecen idénticas**, con sus multiplicidades. No hay nuevos precios, requisitos, categorías, premios ni ajustes de balance.

Se conservan las capas históricas que todavía se llaman entre sí: eliminarlas por su apariencia podría cambiar el orden de resolución, sorteos o recompensas. No se intenta una reescritura general. Las pruebas de móvil usan tamaños de viewport de Chromium; no equivalen a una sesión en un teléfono físico ni a una prueba de duración de varias horas. No se afirma haber comprobado la publicación de GitHub Pages.

## Verificación reproducible

- `npm run audit`: compila sintácticamente cada script y el conjunto de scripts; comprueba límites de etiquetas y metadatos, sin ejecutar el juego ni acceder a guardados.
- `npm test`: suite de integración con Chromium. Incluye inicialización, Pesca, fases sin salto, capturas y escapes, Combate, habilidades, cañas y estadísticas, tienda/filtros/ordenamientos, Atlas, Diario/récords, colecciones ocultas, XP y nivel, persistencia, importación/exportación, fallos inyectados y descargas autónomas.
- Durante esta auditoría se analizaron además todos los scripts con Acorn/ESLint y todos los estilos con CSS Tree, usando herramientas temporales externas al repositorio. Sin errores de sintaxis, código inalcanzable restante ni identificadores no definidos detectados por esa configuración. Las advertencias de símbolos no utilizados no se trataron como autorización para eliminar funcionalidades.

Resultado final: **78/78 pruebas de integración aprobadas**, además de las 69 comprobaciones puras internas incluidas en la suite. `npm run audit` aprobó. La comprobación adicional de Combate mediante sus botones a 1366 y 390 px verificó iniciar, lanzar Dardo con consumo de MP y ganancia de Magia, acertar un golpe con XP de Armas, detener y guardar; sin errores de ejecución observados.
