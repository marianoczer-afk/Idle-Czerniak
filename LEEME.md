# Argentum · versión unificada 41

Abrí **index.html** con el navegador que usabas para jugar. Sigue siendo un HTML autocontenido: no requiere GitHub, instalación ni servidor.

Las cuatro secciones son **Pesca**, **Entrenamiento**, **Arenas** y **Equipo y sala**. Comparten personaje y oro. Las partidas siguen guardadas por el navegador; el HTML no contiene tu partida personal.

## Pesca y encargos

La burbuja aparece automáticamente al entrar a la pesca. Explotala para comenzar la captura. Atracción acorta la espera entre burbujas.

El HUD inferior recupera las ilustraciones horizontales anteriores de las cañas, la zona, la última captura y la XP. Para cambiar de caña podés usar su selector en el HUD o abrir la tienda. La preparación se pausa mientras elegís y las burbujas vuelven al cerrar. Durante una captura activa hay que terminarla antes de cambiar el equipo.

Cada captura nueva se vende automáticamente y entrega un comprobante de esa especie para los encargos. Ese comprobante se consume al entregar y no se puede revender. Las colecciones y los récords conservan sus capturas históricas.

Los peces guardados de versiones anteriores siguen disponibles. En el engranaje de configuración está **Vender peces guardados**: convierte esas reservas en oro y comprobantes, una sola vez.

**Temple** es el nuevo atributo de cañas que ayuda a reducir la pérdida fuera de la barra. Una caña inicial puede intentar especies físicamente compatibles, pero los peces avanzados penalizan mucho más una caña con poco manejo y temple. No hay una prohibición artificial por zona.

## Entrenamiento y combate

Se integraron los cinco minijuegos originales de Argentum Souls: Fuerza, Defensa, Precisión, Esquiva y Crítico. Se conservó su curva de XP y la progresión por combos. La sala y las estaciones mejoran las recompensas.

Las cien arenas conservan cuatro enemigos por arena. Los ataques ahora alternan entre tu turno y el rival. Hay velocidades ×1, ×2 y ×3. Ganar habilita **Siguiente arena**; repetir una arena no vuelve a conceder su primer premio.

Las compras de equipo, estaciones y sala usan el mismo oro que obtenés pescando. Sus precios se ajustaron al nuevo contexto económico.

En esta versión los peces pagan entre un 15% y un 40% más según su nivel. Equipo y estaciones cuestan un 25% menos que en la versión 40, y las mejoras de sala aproximadamente un 33% menos. No se modifican el oro ya guardado ni la XP.

El entrenamiento tiene una cabecera más compacta y una sala ilustrada con el acabado pintado de las zonas de pesca. El equipo muestra tres etapas visuales: inicial (0–4), reforjado (5–9) y avanzado (10+). Lo usado pertenece al comienzo; las mejoras se ven más cuidadas y elaboradas. Se reservó la estética de realeza para una progresión futura.

El primer fallo que rompe un combo da el destello rojo; los fallos siguientes no lo repiten hasta que vuelvas a acertar. Se retiró la interrupción de tres fallos. Esquiva acelera más con el combo y su patada mantiene articulaciones de longitud constante. Los avisos de nivel se muestran como icono y aumento en la cabecera de la escena, fuera de las trayectorias de las manzanas.

Se pueden reclamar las recompensas de encargos, incluida Faro de las Tinieblas, mientras espera una burbuja. Una captura en curso sigue necesitando terminar antes de reclamar.

Si tenés un JSON exportado de Argentum Souls, el engranaje permite **Importar progreso Argentum Souls**. Se combinan skills, equipo, estaciones y arenas conservando los valores más avanzados. Reimportar el mismo progreso no vuelve a sumar sus monedas. No se accede automáticamente a partidas de otros sitios o archivos.

## Archivos

- `index.html`: juego actual; es el único archivo necesario para jugar.
- `src/`: fuentes del juego actual, incluidos los módulos de entrenamiento en `src/souls/`.
- `assets/embedded/`: recursos extraídos del HTML; se vuelven a embeber al compilar.
- `scripts/`: compilación reproducible de esta entrega.
- `tests/`: verificaciones de compilación y navegador. Sus salidas van a `test-results/`, sin versionar.
- `docs/`: arquitectura y guía para revisar rendimiento con Claude.

La carpeta local original conserva `Entrenamiento/`, `respaldos/` y todos los TXT para Claude. En GitHub las versiones anteriores quedan accesibles en el historial.

Esta es la primera versión unificada para probar. El balance se contrastó con simulaciones y comprobaciones funcionales; necesita partidas reales para afinar sensaciones y duración.
