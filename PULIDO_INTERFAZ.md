# Pulido de interfaz — Estable 20

Cambios sobre Estable 19 (`903d3ad`), sin repetir la auditoría general ni cambiar las reglas del juego.

## HUD y XP

El bloque `fishing-hud-css` permanece idéntico al de Estable 19. El texto flotante copia familia, tamaño y peso tipográfico del contador; usa verde apagado, sin sombra, y una animación de un segundo con cuatro píxeles de desplazamiento vertical. Sigue siendo un elemento superpuesto fuera del layout. El contador, la barra, el Level Up y la XP real no se modifican.

`tests/fixtures/hud-estable19.json` contiene mediciones tomadas del archivo anterior antes de editarlo. Se comparan exactamente 13 rectángulos por viewport (1366×900 y 390×900): HUD, contenedores, zona, caña, pez, datos, contador y barras. Se comprueban reposo, efecto flotante y captura. **Altura: 118 px antes y después en ambos tamaños.** Para aislar el efecto del layout, la prueba de superposición mantiene constantes los números del modelo; las regresiones existentes prueban por separado las ganancias reales y las subidas de nivel.

## Diario y récords

Se conservan las tarjetas ilustradas y la ficha debajo de la fila seleccionada. Búsqueda sin distinción de tildes, filtro por zonas reales y siete ordenamientos combinables. El valor económico usado es el **precio base de un ejemplar Común por unidad**, indicado en las opciones y el tooltip; no cambia precios. Las especies sin peso registrado quedan al final en ambos ordenamientos de peso. Si una selección queda fuera del filtro, se cierra su ficha. Las preferencias de filtros son temporales y separadas por personaje.

La franja muestra capturas, especies y las cuatro categorías. Comunes = total menos Grandes, Enormes y Legendarios, a partir de los contadores de capturas existentes; no se cuentan récords como si fueran capturas.

Los datos históricos `bySpecies.best` y `bestKg` son independientes: tener un Legendario no demuestra que el récord de peso pertenezca a esa categoría. Se mantiene esa distinción. La lectura puede recuperar marcas solamente desde:

- Récords por categoría ya guardados.
- Categoría explícita del récord absoluto.
- Última captura con especie, peso y categoría reales registrados juntos.

No se generan pesos ni se asigna categoría a un récord antiguo solo por su tamaño. La ficha explica cuando el récord absoluto conserva un peso histórico sin categoría. Se reconcilia un récord absoluto menor que un récord por categoría demostrado, sin perder el mayor peso. La lectura no escribe ni migra datos; la próxima captura conserva las marcas fiables en los mismos campos compatibles ya existentes.

## Atlas

Una sola ficha se inserta inmediatamente después de la zona seleccionada; repetir el clic la cierra. Se mantienen búsqueda, filtros, detalles de insignias y condiciones originales de las tres estrellas. Imagen existente a fondo completo, degradado de contraste y requisitos compactos. No hay scroll programático nuevo. Se conserva la aclaración del descubrimiento compartido en el tooltip y el crédito histórico de colecciones.

## Tienda y selector

“Mis cañas” es un interruptor independiente que se combina con búsqueda, origen, zona y orden. No restablece otros filtros. Su estado se conserva al volver a renderizar y se refleja con `aria-pressed`. El título indica total del catálogo y cantidad poseída; ya no repite la caña equipada. Encabezados sin emojis decorativos; ilustraciones y comparaciones existentes intactas.

Existen requisitos reales de **habilidad de Pesca 6, 12, 24 y 32** para obtener respectivamente las cañas del Viejo Pescador, Guardarríos, Brumas y Coralina mediante sus encargos. No son niveles de las cañas ni nuevos requisitos para equiparlas. Se conservan sus reglas y el ordenamiento se identifica como **“Pesca del encargo”**. Los valores `req` de las familias nuevas siguen siendo agrupaciones visuales, sin convertirse en restricciones de compra.

“Custodio del Río” es una **familia de cañas** en los datos existentes, no una zona ni un NPC definido. El selector conserva nombres e IDs y añade etiquetas de zona y obtención. Su tooltip identifica la familia y el encargo real; no se inventan NPCs ni zonas para objetos sin información.

El juego sigue distribuido como un solo `index.html`. No cambian IndexedDB, localStorage, guardado v7, probabilidades, física, experiencia, requisitos, premios ni las 118 ilustraciones embebidas originales.

Verificación: `npm run audit` aprobó la sintaxis de los 59 scripts y los límites de 65 bloques de estilo. La suite completa aprobó 87 pruebas en Chromium; los últimos ajustes de foco y herramientas del Atlas se volvieron a verificar junto con la comparación exacta del HUD en ambos tamaños. Las pruebas incluyen los flujos anteriores de Pesca/Combate, ganancias de XP y Level Up, récords, filtros, tiendas, Atlas, guardado v7, cinco personajes, fallos de almacenamiento y exportación/importación. Móvil se comprobó mediante viewport emulado, no en un teléfono físico.
