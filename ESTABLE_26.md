# Estable 26 · entrega técnica

Base: Estable 25, `404c184`. No se implementan especies, zonas, cañas, encargos ni cambios de balance. No se modifica el esquema v7 ni su lógica.

## Cambios comprobados

- Separación reversible de los 129 bloques originales, 22 fragmentos de catálogo y 117 imágenes únicas. La primera reconstrucción fue idéntica al HTML original, incluido SHA-256. Luego se aplicaron exclusivamente versión, formato de tres imágenes y CSS de selectores.
- Fuentes y originales individuales; compilación ligera, determinista, autocontenida, con hashes, comprobación de artefacto actualizado y caché de Base64. Las descargas existentes continúan leyendo el documento completo, no las fuentes.
- Tres PNG pasan a WebP sin pérdida: comparación exacta RGBA, mismas dimensiones y transparencia. No hay nuevos dibujos, recortes, cambio de resolución ni sustitución de ilustraciones.
- Menú HUD de zonas: el elemento real es `.e1120Menu[data-type=zone]`; en Estable 25 ya computaba `scrollbar-width:none` en este Chromium. Se conserva esa evidencia en `zonas-antes.png`; no se inventa una reproducción del defecto blanco de Windows.
- Filtros de zonas: son `<select data-rod-zone>` y `<select data-journal-zone>`, cuyo desplegable nativo usa controles del sistema. Las reglas anteriores para `.e1120Menu` o `.rodRows` no alcanzaban ese popup. Se usa `appearance:base-select` y `::picker(select)` en Chromium compatible para estilizar el popup real, conservando semántica nativa/teclado. Se ocultó también la barra del selector de cañas. Atlas/Tienda mantienen desplazamiento y `overscroll-behavior:auto`.
- En navegadores sin `base-select` se conserva el selector nativo con esquema oscuro; no se promete ocultar un popup del sistema que ese navegador no permite estilizar. No se usa un widget casero ni listeners nuevos. El scroll principal sigue visible.

## Tamaños medidos

| Medida | Antes | Después |
|---|---:|---:|
| HTML distribuible | 13.769.036 bytes | 10.618.382 bytes |
| Recursos únicos usados por el juego, decodificados | 9.886.629 bytes | 7.522.958 bytes |
| Archivos originales + variantes runtime conservadas en desarrollo | — | 15.930.371 bytes |

El HTML baja **22,88%**, 3.150.654 bytes. La carpeta de desarrollo conserva originales deliberadamente; no se descarga para jugar. Cinco reconstrucciones con caché midieron 118, 78, 78, 82 y 75 ms en esta máquina; no son una promesa de tiempo en otros equipos. Se deduplica almacenamiento por contenido y se reutiliza el atlas actual; no se generaron miniaturas redundantes.

## Validación

- Sintaxis: 62 scripts válidos, 67 estilos equilibrados, HTML autocontenido.
- Integridad: comparación de los 62 scripts contra las huellas de Estable 25, normalizando únicamente versión y URI de imagen; mismos scripts de lógica. Hoja del HUD idéntica a la base.
- Build: reproducibilidad, correspondencia exacta con `index.html`, catálogos presentes, hashes de originales/runtime, referencias del manifiesto válidas, ausencia de tokens y dependencias de fuentes externas.
- Chromium de escritorio 1366×900 y móvil simulado 390×900: selectores desplegados, teclado hasta última opción, filtros, barras internas ocultas, rueda y continuidad al documento. HUD fijo **118 px** en ambos tamaños, además de las regresiones geométricas existentes. No se probó un teléfono físico ni Chromium Windows.
- Suite funcional: Pesca, minijuego, estadísticas/equipamiento, tienda/filtros, Atlas, colecciones/Diario, récords, XP/subidas, combate y persistencia v7; carga, cinco personajes, exportación/importación y HTML descargado en contextos aislados. Resultado final al pie.
- Apertura directa desde disco: **bloqueada por política del Chromium administrado**, `ERR_BLOCKED_BY_ADMINISTRATOR`. Se conserva la distribución autocontenida y se prueba el HTML descargado mediante HTTP, pero no se afirma una prueba file:// que no pudo ejecutarse. No se tocaron partidas del usuario.

Evidencia: [`zonas-desktop.png`](arte/verificacion/estable26/zonas-desktop.png), [`filtro-desktop.png`](arte/verificacion/estable26/filtro-desktop.png) y capturas anteriores en la misma carpeta. Las capturas finales muestran los desplegables abiertos sin franja blanca; las propiedades computadas también se verifican por prueba.

## Planificación preparada

[`EXPANSION_PESCA_26.md`](EXPANSION_PESCA_26.md): tres destinos opcionales 88/94/99, nueve especies propias, tres compartidas, equipo actual suficiente, cero cañas nuevas, objetivos y premios orientativos. Mantiene Santuario 85 y especies hasta 98. Reutiliza los cuatro encargos intermedios propuestos anteriormente. Principal/complementario y acreditación aditiva de hitos quedan definidos como diseño compatible, sin migrar guardados ni alterar estrellas ahora.

[`arte/manifest-produccion.json`](arte/manifest-produccion.json): 138 entradas de producción, usos, dimensiones basadas en componentes medidos, estado, briefs específicos y vínculos a recursos compartidos. [`DESARROLLO.md`](DESARROLLO.md) explica build, descargas, herramientas opcionales y límites.

Resultado final: **118/118 pruebas aprobadas, cero fallos**, `npm test` (187 s); auditoría de sintaxis y comprobación de build aprobadas. Evidencia y datos de planificación quedan en Git junto con el HTML distribuible. La política que bloquea file:// es la única limitación de apertura local de esta verificación.
