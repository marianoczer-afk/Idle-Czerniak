# Estabilización de Pesca

## Diagnóstico y correcciones

- **CSS como texto:** había dos fragmentos fuera de `<style>`, seguidos por cierres huérfanos. El primero repetía una regla de `overflow-anchor` ya definida; se eliminó el duplicado. Al segundo le faltaba la apertura de su bloque: se restauró `<style id="e1108-fishing-layout">`. No se oculta texto con JavaScript o CSS.
- **Cambio de fase:** la geometría final de E1.11.19 era estable, pero se medían el recorrido y el dock mientras el DOM estaba incompleto. Eso podía reducir temporalmente la altura del documento y limitar el scroll del navegador. Ahora el render difiere esas mediciones hasta terminar y consulta la visibilidad de la zona sin forzar layout. Se mantienen los tamaños finales: 272 px en escritorio y 295 px en móvil. No se agregaron llamadas de scroll.
- **Lateral:** en Pesca se presentan su habilidad y caña. Se ocultan los atributos y habilidades de combate; vuelven al salir de la pestaña. El resumen móvil también usa información de pesca.
- **Misterio:** la función que dibuja el HUD no introduce imágenes de la especie durante burbujas o captura. Se retiraron dos escritores posteriores que volvían a insertar ese arte, además del parche final que solo lo escondía. La ilustración y el nombre aparecen al capturar. La regla final de imágenes del HUD usa `contain` en lugar de `cover`.
- **Tienda:** un render de filas por ID sustituye la combinación de tarjetas heredadas. Conserva arte, cinco estadísticas, requisitos reales, precio y las acciones existentes de compra/equipamiento. Las filas miden aproximadamente 81 px en escritorio; el diseño móvil acomoda el botón debajo. Mantiene abiertos los desplegables elegidos durante compras y renders.
- **Categorías:** Inicio 1–24, Mid game 25–59 y Late game 60–100 son recomendaciones, no requisitos nuevos. Esmeralda y Nácar se presentan en Mid game y Astral en Late game. Comprar conserva las reglas existentes: oro, sin nivel mínimo. Las cañas de misión obtenidas se incluyen según el nivel de su misión. No se añadieron cañas.
- **Nivel máximo:** Pesca se limita a nivel 100. La XP existente y futura sigue almacenada; no se trunca. Al alcanzar el máximo, el HUD deja de prometer nivel 101. No se cambió la curva de otras habilidades.
- **Detener burbujas:** el listener efectivo ahora cancela el pez pendiente y su temporizador. El anterior listener de limpieza no recibía el evento porque otro manejador lo detenía antes. Esto evita quedar esperando al volver a lanzar la caña.
- **Pruebas antiguas:** la fixture de navegación no contenía clase, raza ni habilidad de armas, exigidas por la capa posterior de presentación de XP. Se completó la fixture; no se cambiaron sus aserciones ni las recompensas de navegación.

Se conservaron las claves de localStorage, las bases IndexedDB, el formato v7, los identificadores de inventario y misiones, las tablas de contenido y las ilustraciones. La comparación de las 116 cadenas de imágenes embebidas con la fuente original dio identidad exacta. La limpieza es localizada: todavía existen capas históricas fuera del alcance de esta estabilización.

## Azar real

No hay una rotación forzada ni memoria de las especies anteriores. Cada picada hace un sorteo ponderado independiente entre las especies de la zona cuyo requisito de Pesca se cumple. La calidad se sortea por separado al ganar.

Para una especie rara, el peso es `rarity × (1 + suerte / 20)`. Para las demás:

```text
max(0.12, 1 / (1 + (nivel - requisito) / 4)^0.4 / dificultad^2.3)
```

Los pesos se normalizan por su suma. Por eso `rarity: 0.012` **no significa 1,2 % final**. La fuente recibida ya multiplicaba el peso del atún por `0.42` en `data-e1122-fishing-fixes`; se conservó exactamente ese factor en la distribución consolidada. No se hizo otro rebalanceo.

Ejemplo calculado: Costa de las Brumas, Pesca 30, Caña reforzada.

| Especie | Probabilidad por picada |
| --- | ---: |
| Salmón | 28,900 % |
| Pez espada | 20,194 % |
| Pez fantasma | 2,976 % |
| Lubina | 33,989 % |
| Atún gigante | 10,964 % |
| Mantarraya legendaria | 2,976 % |

«Atún gigante» es el nombre de la especie, independiente de la calidad «Grande». Con esta caña y nivel, Trofeos es 14 %, un multiplicador de `1.14` sobre los umbrales acumulados:

| Calidad | Probabilidad al capturar | Valor de venta |
| --- | ---: | ---: |
| Normal | 61,240 % | ×1 |
| Grande | 25,650 % | ×2 |
| Enorme | 11,058 % | ×5 |
| Legendario | 2,052 % | ×12 |

Cinco picadas consecutivas de atún tienen probabilidad aproximada de `0,001584 %` para ese escenario y un bloque de cinco intentos fijado de antemano. Cinco que además resulten Grandes tendrían `0,000001759 %`, suponiendo capturarlos todos y mantener zona, nivel y caña. Estas cifras no permiten reconstruir una partida anterior: faltan esas condiciones y el historial de intentos. Además, las capturas exitosas están condicionadas por la dificultad y el control del jugador; su distribución no tiene por qué coincidir con la de picadas. No se encontró un fallo del selector que explique por sí solo aquella racha.

## Validación reproducible

`npm test` ejecuta Chromium real en escritorio (1366 px) y móvil (390 px), con almacenamiento aislado:

- Límites HTML y ausencia de CSS en nodos de texto del body.
- Lateral contextual, misterio sin imágenes de la especie, entrada de mantener/soltar y revelación posterior.
- Igualdad de posición, altura, altura del documento, dock y scroll entre burbujas y barra; controles dentro del escenario.
- Filas compactas, compra/equipamiento, categorías y conservación de desplegables. Se simula un catálogo de 100 cañas solo en memoria de prueba.
- Guardado v7 en localStorage e IndexedDB, recarga y conservación de inventario, variantes, XP, propiedad, misiones, logros y orden personal.
- Distribución ponderada exacta, extremos y puntos interiores del acumulado; 1.200.000 sorteos con semilla en 60 escenarios de zona/nivel/caña.
- Umbrales de calidad y cadena completa de premios: Grande → Normal → Enorme → Normal → Legendario → Normal, sin reutilizar la calidad anterior ni duplicar capturas.
- Detener durante burbujas y volver a lanzar.
- Las suites existentes de personajes (15), navegación (15), aislamiento DEV (16), progresión (15) y laboratorio (8): 69 comprobaciones.

La prueba funcional de recompensa termina una sesión con éxito controlado para comprobar contabilidad y presentación; no mide la dificultad humana de conseguirla. No se afirma haber probado una partida prolongada ni todos los navegadores.

## Seguimiento: acceso a la tienda y colección

La tienda seguía existiendo debajo del diario de Pesca y cerrada al tener una caña. Ahora hay una sola tienda de cañas al principio de la pestaña **Tienda**, abierta inicialmente, y un botón **Tienda de cañas** en la barra superior del minijuego. Conserva categorías, precios, propiedad y equipamiento, sin duplicar el catálogo al cambiar de pestaña.

En la colección, las imágenes tenían un mínimo de 150 px dentro de fichas de unos 186 px y el texto quedaba al costado. Las fichas ahora sitúan el arte arriba y el texto abajo, con ancho disponible y salto de línea. No se oculta ni recorta texto para resolver el desborde.

Se agregaron comprobaciones de colección en 1366, 1024 y 390 px con tres misiones completadas y tres de cinco especies descubiertas, navegación entre Pesca y Tienda, y arranque del HTML generado por el botón de descarga. Se volvieron a ejecutar las pruebas de fases, recompensas y guardados.

## Estable 03: identificar la descarga y hacer visibles las cañas

El botón Descargar exporta el documento actualmente abierto; no consulta ni instala versiones nuevas. Los encabezados anteriores conservaban rótulos viejos, por lo que dos archivos distintos parecían la misma versión. El título, encabezado y botones de esta entrega indican **Estable 03**, y el HTML exportado conserva ese identificador. Se probó pulsando el botón real y arrancando su archivo en un contexto limpio.

La tienda utiliza un único nodo: en Pesca aparece abierta inmediatamente después del minijuego y antes de los encargos; al seleccionar Tienda se mueve al comienzo de esa pestaña. Esto mantiene acceso en ambos sitios sin duplicar propiedad, botones ni catálogo. Se verificó una compra desde Pesca con tres cañas de misión obtenidas.

El HUD en espera y durante burbujas/captura, y las especies sin descubrir de la colección, usan una silueta gris genérica con interrogación. No depende de la especie seleccionada. Se comprobó su centrado horizontal/vertical y que sea idéntica para peces distintos en 1366 y 390 px. Las ilustraciones originales aparecen después de capturar y permanecen sin cambios.

Resultado: 15 pruebas de navegador aprobadas, incluidas las 69 comprobaciones heredadas.

## Estable 04: protagonismo del equipo y recompensas claras

Las ilustraciones de la tienda pasan de un marco de 145 px a aproximadamente 305 px en escritorio de 1366 px, manteniendo imagen completa y filas de unos 100 px de altura. Los datos quedan a la derecha. Las cañas de compra llevan etiqueta dorada «Compra»; las de misión llevan etiqueta «Misión» y borde lateral violeta, sin cubrir el arte. Se conservaron todos los recursos gráficos.

Las categorías visibles son **Aprendiz**, **Especialista** y **Maestría**. Son agrupaciones de catálogo: no son niveles de caña ni requisitos de compra/equipamiento. Las compras siguen siendo por oro y las recompensas por encargos, con sus reglas existentes.

La valoración de 1 a 10 estrellas es informativa y fija para cada caña. Combina control (35 %), resiliencia (25 %), atracción (15 %), suerte (15 %) y trofeos de base (10 %), normalizados respecto a las referencias existentes 49/22/28/27/27. La presentación redondea `1 + 9 × puntuación` y limita el resultado entre 1 y 10. No usa la bonificación de trofeos obtenida por el nivel del personaje: subir Pesca no sube las estrellas de la caña. No implica que una caña sea la mejor para todos los peces; las especialidades siguen visibles en sus cinco atributos. Ninguna estadística, probabilidad, dificultad o recompensa cambió por esta valoración.

Los encargos completados muestran su recompensa exacta y cómo se aplica. **El naturalista de la laguna** concede **Instinto de pescador, +5 % permanente a la XP de Pesca**; no entrega una caña. La mejora activa también figura en el lateral de Pesca. La misión del arrecife identifica la Caña Coralina y la del abismo describe sus +8 px permanentes de control. Los encargos anteriores completados nombran sus cañas de premio. La pantalla no vuelve a conceder recompensas ni modifica partidas al mostrar esta información.

Se agregaron pruebas en escritorio y móvil para el ancho del arte, procedencia, estrellas accesibles e independientes del nivel, categorías sin niveles y recompensas XP/caña/control. El PDF mencionado para una revisión posterior de balance no estaba adjunto a esta entrega; el balance se conservó.

## Estable 05: primer balance inspirado en el PDF

Se incorporan capacidad en kg para las 12 cañas, pesos de las 41 especies existentes, control proporcional al recorrido y resiliencia aplicada al pez en ambos caminos de inicio. Se habilita el desafío del río para reclamar la Caña del Coleccionista existente, se añaden récords de peso sin migrar inventarios anteriores y el pez del HUD permite volver por clic o teclado a la vista de XP y minijuego sin reiniciar la sesión.

Los cambios y sus límites se detallan en [BALANCE_PESCA.md](BALANCE_PESCA.md). Los números son una primera iteración propia: no se copiaron las economías del PDF ni se considera cerrado el balance de juego.

## Estable 06

Movimiento proporcional al recorrido, cobertura inicial menor, captura más larga según especie, Atracción aplicada a los toques de preparación y botón «Picar». Arte de cañas más ancho y marcos llenos en tienda/HUD. 27 pruebas aprobadas en Chromium; el balance de sensación requiere partidas humanas. Detalles y fórmulas en BALANCE_PESCA.md.

## Estable 07

Burbuja de picada de 76 px en escritorio y 70 px en móvil (antes 46/48), con reflejo acuático, halo más suave, aviso «¡Pique!» e indicación «TOCÁ». Se conserva el balance de Estable 06: mismos toques, tiempos y física. Posiciones acotadas para no tapar título ni contador. Verificación visual en Chromium y geometría extrema a 1366/390 px, sin desplazamiento entre fases.

## Estable 08

90 cañas totales (12 anteriores + 60 compras + 18 desafíos nuevos), especialidades con compromisos y catálogo filtrable. Diez diseños de familia y seis peces destacados con arte nuevo embebido, conservando todas las imágenes originales. Viewports que muestran la caña completa. Se conserva el catálogo anterior hasta completar la reconstrucción para no reducir transitoriamente el recorrido de scroll. Detalles en CATALOGO_CANAS.md.

## Estable 09

El visor del chat muestra el HTML como texto; el usuario confirmó que ocurría en esa vista previa. El HTML entregado y el miembro index.html del ZIP de Estable 08 son documentos válidos y se mantienen las entregas HTML/ZIP. La prueba de descarga usa el botón real, guarda sus bytes y los vuelve a abrir con Chromium desde una entrega local aislada, bloqueando otras peticiones. La política del Chromium del entorno bloquea file://; no se afirma haber probado esa modalidad de apertura.

El historial de completados anterior solo incluía el Viejo Pescador y las dos misiones E171. Las recompensas E187 (XP permanente, Coralina y control del Abismo) se seguían insertando como encargos de zona. Ahora un registro único y de solo lectura reconoce los 25 encargos posibles: tres antiguos, tres E187, Coleccionista y 18 desafíos nuevos. Presenta zona, recompensa y aplicación del premio; los terminados dejan de figurar como activos. El estado abierto del historial se conserva durante el render.

Para partidas antiguas, poseer la Coralina acredita su encargo aunque falte la bandera histórica. Se aplica el mismo criterio al render y a los dos controladores de entrega, para impedir una entrega duplicada. El historial no inventa otras mejoras ni consume peces ni reparte premios.

Los siete PDF nuevos se usan como referencia de diseño; ver REFERENCIAS_FISCH.md. En esta versión no se añaden sistemas de objetos ni se modifica el azar o el balance de captura.

Validación final Estable 09: 35 pruebas aprobadas en Chromium, incluidas tres nuevas sobre historial completo, entrega única de Coralina y compatibilidad de su propiedad histórica. Se comprobó el historial visualmente. HTML y ZIP contienen exactamente el código probado y todas las imágenes de Estable 08.

## Estable 10

- Catálogo cerrado inicialmente y al cambiar de zona; los encargos y completados aparecen antes de la tienda. Se recuerda la apertura dentro de la misma zona, sin desplazamientos automáticos entre fases.
- Las 18 misiones de cañas nuevas aparecen como encargos en sus tres zonas (Río, Glaciar y Santuario). Las filas de todas las cañas de misión muestran zona, objetivos y requisitos; «Ver encargo» lleva al lugar accesible y «Reclamar» aparece al cumplir el desafío. Los requisitos de nivel corresponden a habilidad/zona, no a niveles de la caña.
- Filtros por obtención, propiedad, pendientes, presupuesto y zona; orden por precio, control, resiliencia, atracción, suerte, trofeos o capacidad. «Mis cañas» limpia búsqueda/zona y muestra las obtenidas. Por defecto, las propias y la equipada van primero en cada categoría; el selector del HUD también pone primero las propias y la equipada.
- Control amarillo de captura de 76 px de alto y ancho completo dentro del escenario existente; se retira el texto redundante de mouse/táctil/espacio. No cambia la altura de las fases.
- Lateral con desplazamiento propio y botón de cambio de personaje accesible arriba, independiente del largo del catálogo.
- Movimiento y captura de cuatro especies del arrecife ajustados mediante perfiles separados de las probabilidades. Ver BALANCE_PESCA.md. No se alteran precios, estadísticas de cañas, XP, premios, rangos de peso ni las ilustraciones.

Verificación Estable 10: 39 pruebas completas aprobadas en Chromium; comprobaciones dirigidas adicionales para cancelación de captura al cambiar de personaje y presentación de requisitos ya acreditados. Se revisó visualmente a 1366 y 390 px, y se verificaron idénticas las 118 imágenes embebidas.

## Estable 11

Se eliminó la espera fija de resultado (1,6 s al ganar y 1 s al perder). Las capas de premios conservan sus reglas, pero ahora completan sus cambios antes de una única reconstrucción y un único guardado. Se retiró el render obsoleto del catálogo que se generaba para reemplazarlo inmediatamente por el actual. En Chromium móvil emulado con CPU ×4, tres capturas controladas pasaron de aproximadamente 1,9–2,5 s a 176–209 ms. No es una medición en un teléfono físico.

El resultado anterior se limpia al empezar otro intento y al perder. El HUD muestra el progreso de la fase actual; la XP de la última captura aparece en un aviso independiente que se desvanece y caduca. Finalizar dos veces no duplica recompensas.

El lateral mantiene su desplazamiento independiente con la barra oculta. Se retiran los dos títulos redundantes de Pesca, manteniendo su contenido abierto. La caña del HUD conserva la proporción completa de su ilustración; el nombre ocupa una franja separada, sin degradado encima del extremo.

Validación: 43 pruebas aprobadas en Chromium, escritorio y móvil emulado, incluyendo guardados v7, descarga autónoma, fases sin salto, recompensa única, escape sin premio, aviso de XP, geometría de ilustraciones y desplazamiento lateral.

## Estable 12

- Misiones: objetivos de cantidad, especies y peso mínimo explicados por separado, con progreso y marcas de cumplimiento; se explicita que todos son necesarios y cuentan las capturas previas de esa zona. Las entregas tradicionales aclaran que requieren inventario, aceptan cualquier tamaño y consumen los peces. No cambian sus condiciones ni premios.
- Catálogo reducido de 90 a 50 ofertas para partidas nuevas. Se conservan los IDs, índices y estadísticas históricos y todo equipo ya adquirido; las 40 variantes retiradas permanecen en la colección de su propietario. Ver CATALOGO_CANAS.md.
- HUD compacto en una fila, sin tarjeta redundante de zona. El nombre sigue separado de la caña, que conserva su encuadre completo. Se eliminan reglas antiguas del HUD que imponían dimensiones grandes y una segunda fila. La barra grande de XP permanece accesible al volver a Pesca.
- El panel derecho muestra explícitamente la última captura, su ilustración, peso/calidad, XP y oro al vender. Ya no muestra una incógnita ni confunde ese resultado con el intento activo. Se guarda un registro informativo en `state.ui.lastFishingCatch`; no acredita recompensas. Se mantiene al iniciar otro intento, perder o recargar y pertenece al personaje activo. No modifica el formato v7 ni las claves existentes.

Verificación Estable 12: los 45 casos de Chromium aprobados (44 en la ejecución general y descarga autónoma repetida tras actualizar su expectativa de versión a 12). Se comprobó el HUD a 1366 y 390 px y la visibilidad de XP en ventanas de 635/720 px de alto. Las 118 imágenes embebidas son idénticas a Estable 11. Las pruebas usan perfiles aislados y no acceden a partidas del jugador.

## Estable 13

Se recupera la tarjeta ilustrada de zona y el acceso al selector, ocultados al compactar Estable 12. El HUD conserva su altura compacta (máximo de 120 px en las pruebas), la XP, la caña con su selector y la última captura persistente. En móvil, el paisaje ocupa una columna pequeña junto a la caña. Se ajustan las reglas existentes, sin añadir otro bloque de parches. No cambian misiones, catálogo, balance, ilustraciones ni guardados.

Verificación: 11 casos distintos aprobados en dos ejecuciones dirigidas de Chromium: fases sin desplazamiento, descarga autónoma, regreso a XP, HUD a 1366/390 px y ventanas bajas, selección real de zona y caña, misiones y conservación de última captura. Revisión visual de escritorio y móvil emulado.

## Estable 14

El recuadro del último pez iguala las dimensiones del paisaje de zona: 104 × 102 px en escritorio y 48 × 72 px en móvil. Se recupera la barra de progreso de captura en el HUD, con porcentaje actualizado por el render de la física y etiqueta independiente de los datos de la última captura. Fuera de una captura activa vuelve a cero y explica si está preparando, esperando picada o sin captura en curso; no reutiliza el 100 % anterior. Incluye atributos accesibles de progreso. Se mantiene la altura compacta y no cambian física, recompensas, catálogo ni guardados.

Validación: 10 pruebas dirigidas aprobadas en Chromium, incluyendo escritorio/móvil, dimensiones iguales, progreso al 47 %, pérdida sin nueva recompensa, reinicio a cero, última captura persistente, fases sin salto, selectores, XP visible y descarga autónoma. Revisión visual de móvil y escritorio emulados.

## Estable 15

La caña utiliza la altura completa del HUD y la experiencia pasa al bloque derecho, junto a la última captura y su progreso. El arte conserva su proporción y encuadre: en escritorio ocupa más del 85 % del ancho del recuadro y al menos 300 px de ancho efectivo en la prueba de 1366 px. El HUD sigue por debajo de 120 px de alto. El elemento original de XP se mueve entre Pesca y Combate, sin duplicar IDs ni confundir ambas experiencias.

Revisión estática de todos los bloques JavaScript y CSS. Se consolidan las reglas del HUD de Pesca en `fishing-hud-css`: de 241 reglas/834 declaraciones a 54 reglas/268 declaraciones, incluyendo el cambio móvil y movimiento reducido. Se retiran selectores antiguos de los bloques anteriores conservando sus reglas de tienda, colección, minijuego y Combate.

Se elimina el actualizador duplicado de XP y se retiran los cálculos antiguos en la tarjeta de zona y su menú. Se conserva el cálculo de progresión que respeta el máximo de 100. La caña del HUD tiene un único render con caché por equipo; no se reconstruye desde los actualizadores de ilustraciones de página. Se retiran los renderizadores de resultado anteriores, reemplazados por el panel de última captura, y se conservan la barra en vivo y su accesibilidad. Las tarjetas laterales reutilizan su DOM cuando XP, equipo, atributos y mejoras no cambiaron. Las imágenes de zona dejan de reasignar el mismo recurso en cada actualización.

La limpieza reduce aproximadamente 33 KB de fuente. Las 118 imágenes originales permanecen idénticas y siguen representando la mayor parte del archivo autónomo. No se agregan dependencias al juego. Las capas históricas de mecánicas y premios se conservan; la consolidación realizada corresponde a presentación y actualizaciones redundantes.

Validación: 51 pruebas completas aprobadas en Chromium. Incluyen guardados v7, azar, balance, misiones, premios únicos, descarga autónoma, fases sin desplazamiento, dimensiones del HUD, caña completa, XP a la derecha, reutilización del arte/estadísticas y retorno correcto a Combate sin duplicar la barra. Revisión visual en escritorio y móvil emulado.
