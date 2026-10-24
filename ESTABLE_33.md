# Estable 33

Base: Estable 32 (`96d7e5a`). Correcciones localizadas, sin regenerar imágenes ni revisar sistemas ajenos.

- **Trofeos:** abre con Obtenidos, todas las zonas/tipos y más raros primero. Los filtros siguen siendo editables.
- **Detalle de medalla:** se coloca debajo de su fila, se cierra al repetir la selección y se sustituye al elegir otra. Ilustración de 64 px, nombre, zona, requisitos y estado. Sin fecha, párrafos repetidos ni botones de navegación. Se recoloca al cambiar el ancho.
- **Diario:** reflejos estáticos diferentes para escamas/aletas, bagre, calamar, caparazón/pinzas, mantarrayas y cuerpos alargados. Una máscara alfa compartida elimina el borde semitransparente del efecto. No se aplica desenfoque ni filtro de color al animal. Tarjetas e imágenes conservan sus dimensiones.
- **Captura:** recupera cambios de rumbo, amagues y zigzags locales del comportamiento anterior a Estable 31, conservando aceleración limitada y el indicador de impulso. Alterna desplazamientos largos y movimientos cortos; no es una oscilación sinusoidal. Control conserva su cobertura; Resiliencia modera velocidad y ritmo. Las fórmulas de progreso, XP, peso, precios y premios no se alargan ni modifican.

La categoría del ejemplar se sortea una sola vez al comenzar el movimiento y se reutiliza al premiar: Grande, Enorme y Legendario aumentan la exigencia del movimiento. Se conserva la función de probabilidades existente y no se revela la especie antes de capturarla. El estado del intento no se agrega a los guardados.

## Verificación dirigida

- Trofeos, detalle por fila, apertura/cierre, cambio de selección y filtros: escritorio 1366 px y móvil 390 px.
- Tres anatomías × cuatro categorías en ambos tamaños; sin cambios de dimensiones. Prueba alfa del bagre: 732 píxeles de efecto y **0 fuera del animal**.
- Movimiento representativo con distintas cañas, categorías y anchos de pista. Comprobación adicional de las 50 especies con equipo avanzado y posiciones fijas con las cañas de mayor control y resiliencia: todas capturables, ninguna captura automática. No son tasas de éxito de jugadores reales.
- Una sola selección de categoría y una sola captura premiada; exportación/importación JSON real v7 y recarga, conservando equipo, XP, inventario, premios y pesos históricos.
- Regresiones puntuales de descarga HTML autónoma, canal de calidades y Resiliencia. HUD: **118 px**.

No se ejecutó la batería general de sistemas no modificados. Navegador: Chromium en escritorio y móvil simulado; no teléfono físico ni Safari.

[Capturas](arte/verificacion/estable33/index.html) · [Resultados](arte/verificacion/estable33/pruebas.txt) · [Descarga verificable](descargas/estable33.json).

Reproducir las pruebas de esta entrega: `npm run test:polish33`. Build autónomo: `npm run build`; ZIP: `python3 scripts/package-release.py`.
