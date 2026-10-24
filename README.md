# Argentum Idle Online

La versión completa actual es **Estable 35**, guardada en [`index.html`](index.html). El juego incluye todas sus ilustraciones y funciona sin compilación.

Estable 35 incorpora fondos por zona, una caña más nítida en el HUD, nueve encargos con mejoras permanentes pequeñas, filtros de Trofeos unificados y ocho ilustraciones pulidas. El pez hace giros y amagues durante los cruces. Conserva el HUD de 118 px, los guardados v7 y las recompensas anteriores. [Cambios](ESTABLE_35.md).

GitHub Pages publica `main`: las novedades de esta rama aparecerán allí después de incorporarlas. El HTML y ZIP de esta rama ya contienen Estable 35.

## Jugar como una página web

La dirección de GitHub Pages para este repositorio es:

**https://marianoczer-afk.github.io/Idle-Czerniak/**

La dirección estará disponible cuando el propietario active GitHub Pages. Si aún no está activado:

1. Abrí [Settings → Pages](https://github.com/marianoczer-afk/Idle-Czerniak/settings/pages).
2. En **Build and deployment → Source**, elegí **Deploy from a branch**.
3. En **Branch**, seleccioná **main** y **/ (root)**. Presioná **Save**.
4. Esperá a que termine la publicación. Podés seguirla en [Actions](https://github.com/marianoczer-afk/Idle-Czerniak/actions).
5. Volvé a **Settings → Pages** y hacé clic en **Visit site**, o abrí la dirección anterior. Abrí el engranaje de Configuración: debe indicar **Estable 35**.

Después de esa activación, las actualizaciones de `index.html` subidas a `main` se publican automáticamente.

## Descargar desde GitHub

- **Solo el juego:** abrí [`index.html` en GitHub](index.html) y hacé clic en **Download raw file**, el botón con flecha hacia abajo de la barra del archivo. Guardalo como `index.html` y abrilo con Chrome o Edge. Si GitHub avisa que el archivo es demasiado grande para mostrarlo, la descarga sigue disponible.
- **ZIP solo del juego:** abrí [`argentum-idle-estable35.zip`](descargas/argentum-idle-estable35.zip) y hacé clic en **Download raw file**. Contiene únicamente el `index.html` completo.
- **Repositorio completo:** en la pestaña **Code**, hacé clic en el botón verde **Code → Download ZIP**. Extraé el ZIP y abrí `index.html` en Chrome o Edge.

La vista de código de GitHub y el visor de archivos del chat muestran el contenido del HTML; para jugar usá GitHub Pages o abrí el archivo descargado con el navegador.

## Llevar una partida a GitHub Pages

Los guardados pertenecen al navegador y al origen donde jugás. Para pasar del archivo local a la página de GitHub: en el juego anterior usá **Exportar JSON**; después, en el juego de GitHub Pages, usá **Importar JSON**. Conservá el JSON como respaldo. No se reinician ni se modifican partidas al publicar el archivo.

## Desarrollo local

El juego sigue siendo autónomo: HTML, CSS, JavaScript e ilustraciones están en `index.html`. No necesita compilación ni servicios externos.

Para servirlo localmente, desde este directorio:

```sh
python3 -m http.server 8000
```

Los guardados pertenecen al navegador y al origen donde se juega. Conservá el mismo origen para seguir usando tus partidas; el servidor de pruebas utiliza perfiles temporales separados.

## Pruebas de estabilidad

Requiere Node.js 20 o posterior y Chromium:

```sh
npm ci
npx playwright install chromium  # Si no hay Chromium instalado en el sistema
npm test
```

El runner usa `/usr/bin/chromium` si existe. También acepta `CHROMIUM_PATH=/ruta/al/navegador`. Las pruebas levantan su propio servidor y usan contextos nuevos: no acceden al perfil del jugador.

Ver [ESTABILIZACION.md](ESTABILIZACION.md) para el diagnóstico, los cambios y el análisis de probabilidades.

El catálogo de Estable 08, las especialidades, los desafíos y el encuadre del arte se describen en [CATALOGO_CANAS.md](CATALOGO_CANAS.md).

Las ideas seleccionadas de los PDF aportados, priorizando una experiencia simple, se anotan en [REFERENCIAS_FISCH.md](REFERENCIAS_FISCH.md).

## Auditoría técnica de Estable 19

Correcciones, mediciones y límites de la revisión en [AUDITORIA_TECNICA.md](AUDITORIA_TECNICA.md). Ejecutá `npm run audit` para verificar la sintaxis de todos los scripts y `npm test` para las pruebas de navegador. El juego sigue siendo un único `index.html`; estas herramientas no son dependencias de ejecución.

## Pulido de Diario, Atlas y filtros

Estable 20 conserva las dimensiones de Estable 19 del HUD fijo. Detalles de los filtros, recuperación de récords y verificación en [PULIDO_INTERFAZ.md](PULIDO_INTERFAZ.md).

## Preparación para expansiones y arte compacto

Estable 21 comparte el catálogo de tienda y selector, reconoce contenido nuevo desde los datos y conserva el HUD. Contratos de datos, cambios visuales y pruebas en [PREPARACION_EXPANSIONES.md](PREPARACION_EXPANSIONES.md).

## Navegación y obtención de cañas

Estable 22 conserva el HUD y mejora el scroll del Atlas y la Tienda, el orden del Diario y los accesos a compras y encargos desde el selector. Criterio de dificultad y pruebas en [NAVEGACION_PESCA.md](NAVEGACION_PESCA.md).

## Arte y contenedores — Estable 23

Cabeceras alineadas y completas; zona del HUD más ancha, nombre de caña superpuesto y fondo de última captura integrado. El HUD mantiene 118 px y conserva las dimensiones de la sección derecha y del combate. El juego sigue siendo un solo `index.html`.

- [Inventario artístico completo](AUDITORIA_ARTISTICA.md): 41 especies y 90 IDs de cañas, recursos compartidos y prioridades.
- [Distribución de encargos y propuesta de progresión](PROPUESTA_PROGRESION.md): análisis de las 10 zonas y 25 encargos; propuestas sin implementar.
- [Muestra artística para revisar](arte/muestras.html): seis propuestas separadas del juego, con un HUD de prueba que utiliza su CSS real. Descargá el ZIP, extraelo y abrí `arte/muestras.html`.
- [Verificación de la entrega](ARTE_ETAPA_A.md).

## Ajuste breve — Estable 24

Barras de scroll ocultas en selector de zonas y listas de cañas, desplazamiento nativo conservado y continuidad hacia la página. Se elimina el acceso duplicado junto a los controles de Pesca; la Tienda sigue disponible en su pestaña y desplegable. «¡NUEVO RÉCORD!» dura dos segundos al superar el récord absoluto previo de peso de una especie durante una captura exitosa; no se reproduce al cargar ni por empates o récords de categoría. La primera captura establece la referencia. No ocupa espacio en el HUD.

Se reutilizan el inventario por IDs y la organización de `arte/` de Estable 23. El inventario es una fotografía del catálogo, no una nueva fuente de datos del juego. Las futuras fuentes se asociarán a esos IDs, conservando los maestros separados y el empaquetado autónomo; no se generan ni sustituyen imágenes en esta entrega. Sin cambios de balance, misiones o guardado v7.

Validación de Estable 24: 18 pruebas dirigidas aprobadas en Chromium, con escritorio y ancho móvil; sintaxis válida. La hoja de geometría del HUD permanece idéntica a Estable 23. No se repite la suite completa ni las auditorías artísticas/técnicas en esta entrega acotada.

## Ajuste móvil — Estable 25

Se reutiliza un único formateador numérico para los pesos y las comparaciones de cañas, en lugar de reconstruirlo para cada cifra durante la captura. Medición en Chromium a 390 px, CPU ×4 y misma secuencia aleatoria: ocho capturas por versión; mediana de cierre 355 → 233 ms. Es una medición de laboratorio, no del teléfono del jugador, y no elimina el tiempo normal de espera de la siguiente picada.

La zona del HUD móvil pasa de 72 a 102 px de alto para igualar la caña; el HUD completo mantiene 118 px. «Nuevo récord» es un dato dorado de la última captura, no un efecto flotante. Persiste al recargar y tras un intento perdido; una captura exitosa posterior lo sustituye. Solo se añade el booleano opcional `newAbsoluteRecord` a `ui.lastFishingCatch`; los guardados v7 anteriores funcionan sin ese campo y no se infieren récords históricos inexistentes.

Colección muestra ilustraciones a todo el ancho de su ficha y nombres secundarios; las pistas y recuentos se conservan en el texto de consulta. Diario reduce la ficha a nombre y una línea compacta de capturas/peso; conserva categoría en la descripción accesible y todos los detalles al abrir la especie. No se generan imágenes ni se cambia el balance.

Verificación de Estable 25: 23 pruebas dirigidas aprobadas, incluyendo capturas, comparaciones de cañas, azar, combate/XP, cinco personajes v7, exportación/importación, recarga, geometría del HUD y revisión de Colección/Diario en escritorio y móvil. El indicador persistente también se verificó con una importación JSON real y tras un intento perdido. Las ilustraciones embebidas se conservan sin cambios.

## Fuentes separadas — Estable 26

El HTML completo sigue en la raíz. Las fuentes editables y los recursos están separados; `npm run build` reconstruye el juego offline. Ver [instrucciones de desarrollo](DESARROLLO.md), [verificación de esta entrega](ESTABLE_26.md), [expansión propuesta](EXPANSION_PESCA_26.md) y [manifiesto artístico](arte/manifest-produccion.json). No se agrega contenido ni se modifica balance.

## Interfaz y expansión — Estable 27

Cabecera compacta y configuración central; 13 zonas, 50 especies y 32 encargos. Se conservan 50 cañas ofrecidas, 90 IDs históricos y guardados v7. HUD inferior de 118 px. Hay 116 ilustraciones integradas; los originales y las versiones anteriores se conservan. Ver [detalle y pruebas](ESTABLE_27.md) y [galería completa](arte/galeria-estable27.html).
