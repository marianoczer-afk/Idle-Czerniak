# Estable 30 · Pulido de Pesca

Base: Estable 29, commit `6d7e6cf5ea645eda24da31c14d0ffe1e799fe8af`. Juego completo en `index.html`, fuentes modulares y ZIP autónomo. Sin migración de guardado.

## Resultado

- **Colección:** insignia propia de cada zona; gris pendiente, botón «Reclamar insignia» al completar y color con brillo discreto cuando se obtiene. Estado accesible sin repetir «Colección / Obtenida». Los registros históricos de peso también habilitan la reclamación, como ya habilitaban el descubrimiento; no se entrega oro ni se repiten premios.
- **Encargos:** todos los objetivos, cantidades y barras visibles en filas horizontales, dentro del desplegable general. Arte propio, peces requeridos desaturados si se desconocen y recompensa a la derecha. Primero reclamables, después pendientes y completados. Se conservan los botones y sus manejadores reales. Las entregas indican que consumen inventario; las notas originales siguen disponibles en el título de la fila, sin párrafos redundantes.
- **Atlas:** se corrigió la regla general que imponía `position:relative` al botón Ir y el orden de capas que permitía a la última línea interceptarlo. Ahora queda abajo a la derecha, sin agregar una fila. Medallas con transparencia, más reconocibles, y «¡Maestría conquistada!». No se cambian estrellas ni condiciones.
- **Trofeos:** 63 recursos exclusivos: 37 insignias de encargo, 13 colecciones y las 13 maestrías regionales existentes separadas del fondo. Filtros conservados; detalle con objetivos reales y recompensas acreditadas. Se consultan fechas explícitas si están registradas, sin inventarlas ni escribirlas al cargar.
- **Diario:** acabado discreto por categoría de ejemplar registrada (Común, Grande, Enorme, Legendario), independiente de la rareza de especie. Respeta el filtro seleccionado. Bordes/reflejos estáticos, sin imágenes por combinación ni animaciones continuas añadidas.
- **Minijuegos:** agua ilustrada compartida en burbujas y captura, marcos, brillos y XP. El botón Tirar la caña aprovecha todo el fondo. No se alteran tamaños de blancos, física, tiempos, entradas ni probabilidades.
- **Panel izquierdo:** fondo más visible, caña equipada ilustrada, seis estadísticas conservadas y explicaciones en un desplegable compacto. Se elimina la separación superior vacía específica de Pesca.

## HUD: causa y corrección

Las ilustraciones pintadas tenían su propio fondo rectangular. Ajustarlas enteras producía bandas; expandirlas cortaba extremos. La composición de Estable 29 volvía a superponer ese rectángulo, pese al fondo simulado. Se eliminó esa composición de tiras/máscaras y el clon difuminado del pez. Los primeros recortes uniformes tampoco servían: las filas de los atlas no tienen alturas iguales. Se revisaron límites por objeto antes de generar sus marcos SVG.

Ahora se usa un primer plano RGBA con transparencia real sobre el agua ilustrada compartida, con ajuste proporcional `meet`. Hay variantes para las 50 cañas activas y los 50 peces; los originales del catálogo se conservan. Las 40 cañas retiradas que pudiera poseer una partida siguen usando su arte histórico, sin sustituirlo por otra caña.

Altura fija: **118 px**. Zona y caña: **102 px**. En escritorio de 1366 px: zona 148 px, caña aproximadamente 513 px, pez 156 × 102 px. En móvil de 390 px: zona 68 × 102 px, caña aproximadamente 83 × 102 px y pez 64 × 79 px, con XP encima del bloque derecho. El ancho de la caña se adapta a la pantalla; las siluetas y nombres completos se conservan. Se comprobaron también 360 px y nombres largos con Nuevo récord. La nueva geometría de referencia está en `tests/fixtures/hud-estable30.json`; los XP Drops no la modifican.

[Capturas reales y comparación antes/después](arte/verificacion/estable30/index.html) · [Galería de recursos](arte/galeria-estable30.html).

## Arte y rendimiento

50 insignias nuevas (37 encargos + 13 colecciones), 13 medallas existentes con fondo separado y 100 variantes transparentes de HUD. No se sustituyó masivamente el catálogo pintado de peces ni cañas ni se cambió su estilo general. Los 19 PNG originales nuevos suman 53.179.405 bytes; sus WebP de ejecución a 512 × 768 suman 3.515.376 bytes. Cada hoja se incorpora una sola vez y se reutiliza con símbolos SVG; no hay peticiones externas. El HTML pasa de 15.488.998 a 20.245.958 bytes por incorporar esos recursos; el ZIP pesa 14.970.079 bytes (tamaño y hashes en `descargas/estable30.json`).

Marcos y pruebas alfa: `arte/produccion-estable30.json` y `arte/transparencia-estable30.json`. SHA-256 por original y variante en `assets/manifest.json`. El HUD mantiene caché por ID y dimensiones; se quitan filtros de desenfoque/máscaras de la composición anterior. No se añaden observadores, temporizadores ni bucles por cuadro para decorar las pantallas.

## Criterio de «Más raros primero»

Orden descendente por prestigio del catálogo:

`4 × nivel de zona + categoría + 5 × cantidad de objetivos + min(30, suma(log2(1 + requisito)))`

Categoría: encargo 0, colección 45, maestría 90. Los requisitos provienen de los objetivos reales y nunca del progreso actual del jugador. Empates: obtenido primero y luego ID estable. Es un orden de progresión/reconocimiento, **no una tasa de obtención global**. No modifica ni consulta las probabilidades de pesca.

## Compatibilidad y verificación

Se compararon los inventarios de ejecución de Estable 29 y 30: mismos 50 peces, 13 zonas, 50 cañas ofrecidas y 40 históricas, estadísticas a niveles 1/100, precios, desbloqueos, 37 encargos y recompensas. Solo se añaden metadatos de presentación a los objetivos. No se modificaron motores de persistencia ni formatos v7.

**Resultado final: 142 pruebas aprobadas, 0 fallos** (`npm test`, Chromium, 196 s). `build:check` y verificación del ZIP correctos.

Las pruebas usan perfiles de navegador aislados: inicialización, Pesca y Combate, física/controles y fases sin desplazamiento, RNG, equipamiento, filtros, reclamos únicos, récords/categorías, XP Drops/Level Up, IndexedDB/localStorage, exportación/importación JSON real de cinco personajes y recarga. Incluyen descubrimiento histórico solo por pesos y conservación de campos desconocidos. El ZIP se verifica por CRC y se compara byte a byte con el HTML de raíz.

Comandos: `npm test`, `npm run build:check`, `node scripts/capture-presentation30.cjs`, `node scripts/capture-details30.cjs`, `python3 scripts/package-release.py`.

## Límites de revisión

Las comprobaciones móviles se ejecutaron con Chromium a 360 y 390 px; no representan una prueba en un teléfono físico ni en Safari. El catálogo histórico retirado conserva sus ilustraciones antiguas. En pantallas estrechas la caña necesariamente dispone de menos ancho; no se agrandó el HUD ni se ocultaron datos. Las insignias y sus recortes quedan disponibles en la galería para revisión artística. Si no había fecha histórica de un premio, se muestra «Fecha no registrada».
