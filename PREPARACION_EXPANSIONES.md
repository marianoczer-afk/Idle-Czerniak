# Pesca preparada para expansiones — Estable 21

Trabajo sobre Estable 20: ajustes visuales solicitados y cambios puntuales para crecer, sin auditoría general ni reestructuración de motores.

## Datos e identificadores

- Zonas: `E165_ZONES` sigue siendo la fuente de IDs, nombres, requisitos y especies de cada zona. `e221ZoneOptions` genera los selectores de Diario y Tienda desde esa fuente. Atlas, colección y selector de zonas también leen los datos reales.
- Una zona puede incluir `image` como recurso embebido opcional. `e221ZoneImage` lo utiliza en Atlas, selector y paisaje del HUD; los recursos anteriores conservan sus mapas actuales. No se cambia el tamaño de ninguna imagen del HUD.
- Especies: `E16_FISH` y sus datos mecánicos existentes siguen siendo la fuente. Diario, precios base, descubrimientos, filtros y colecciones no contienen cantidades fijas ni listas paralelas de especies. Agregar contenido requiere definir sus datos reales de peso y mecánica; las interfaces no inventan esos valores.
- Cañas: `e221Rods` reúne una sola vez por consulta los catálogos existentes, deduplica por ID y comparte el resultado entre Tienda y selector. Las cañas poseídas retiradas siguen disponibles.
- La curación histórica de ofertas se limita a sus IDs y variantes antiguos. Una familia, especialidad o caña nueva no queda oculta por no existir en aquella selección. No se añaden objetos al catálogo real en esta versión.
- Procedencia: una caña puede aportar `zone`; se conservan las asociaciones anteriores de familias, encargos y cañas históricas. No se inventan NPCs.
- Los encargos y maestrías conservan los modelos, condiciones, recompensas y claves guardadas existentes. Los nuevos datos deben respetar esos contratos; las interfaces los recorren, sin volver a escribir listas de pantallas.

Los IDs existentes no cambian. No se introduce migración, nuevo esquema v7 ni reemplazo de campos históricos.

## Coste de las interfaces

La recomendación conserva los mismos frentes Pareto, prioridad de propiedad, equipamiento y desempates. Ahora calcula un grafo de dominancia con coste cuadrático en vez de volver a comparar repetidamente cada capa. La prueba compara el resultado con el algoritmo anterior usando el catálogo y 160 cañas sintéticas. Mientras un selector permanece abierto, las búsquedas reutilizan el orden; se invalida cuando cambian ordenamiento, nivel, caña o propiedad.

Se mantiene el selector acotado y se limita la altura de los listados desplegados de Atlas y grupos de Tienda mediante CSS, sin un límite de cantidad de contenido. Las ilustraciones de las listas usan carga diferida y decodificación asíncrona donde corresponde. No se cambian las tarjetas ni sus estadísticas comparativas.

## Dirección visual y efectos

Un único recurso gráfico embebido contiene seis ilustraciones originales: atlas náutico, diario de cuero, caja de aparejos, bestiario, escena de pesca y flotador con anzuelo. Se usan pequeños recortes CSS en las cabeceras existentes; no hay nuevas tarjetas panorámicas ni dependencias de red. Las 118 ilustraciones embebidas anteriores permanecen intactas.

Atlas, Diario y Tienda cerrados miden **46 px** y tienen alineación idéntica en escritorio y móvil. El botón de lanzar conserva su medida anterior, aproximadamente **153,08 × 44 px**, y su comportamiento. La instrucción del minijuego usa texto semibold sin emoji; la barra y su física no cambian. La cabecera principal dice “Pesca · Nivel X”; el HUD conserva “Nv X”.

XP Drop: 1,7 segundos, tramo completamente visible de más de 0,8 segundos, verde claro suave y tipografía ligeramente menor que el contador. Ganancias consecutivas se acumulan sin reiniciar el texto visible; la siguiente ganancia agrupada conserva su propia duración.

Level Up: flecha SVG dorada temporal junto al nivel, brillo de barra y texto sin marco ni estrella durante dos segundos. La celebración se centra debajo de una barra de XP. En móvil utiliza la barra principal cuando es visible y el HUD no tiene espacio libre, evitando cubrir la última captura; si esa barra no está visible, se ajusta únicamente el efecto superpuesto al espacio disponible. La colocación se cachea hasta que cambien geometría o contenido relevante. Movimiento reducido sigue respetado.

La hoja autoritativa de geometría del HUD permanece idéntica. Las regresiones comparan exactamente sus rectángulos con el fixture anterior: **118 px de altura en escritorio y móvil**, mismas secciones, ilustraciones y barra de XP. Todos los efectos temporales se dibujan fuera del layout, en el portal existente.

## Récord histórico y captura nueva

Se recorrió captura → categoría → peso → persistencia → carga → Diario. La prueba reproduce un salmón con récord histórico de **7,61 kg sin categoría**, captura realmente un nuevo Grande más liviano y comprueba que su casillero Grande se registra sin reemplazar el peso absoluto. Luego recarga y exporta/importa JSON para volver a comprobar los mismos datos y su presentación. No se inventa una categoría para el histórico ni se rellenan categorías nunca documentadas. El flujo de Estable 20 ya registraba ese caso; se añadió la regresión completa y no se reescribió una mecánica que funcionaba.

## Verificación

- `npm run audit`: 60 scripts válidos y 66 bloques de estilo con límites correctos.
- Suite completa: **94/94 pruebas aprobadas** en Chromium, con escritorio y viewport móvil.
- Revalidación focalizada después del último ajuste de visibilidad futura: 8 pruebas aprobadas, incluyendo HUD, cabeceras, efectos y expansión sintética.
- Los datos de expansión solo se agregan en contextos de prueba aislados: el juego entregado no suma zonas, especies, misiones ni cañas.
- Se mantienen pruebas de guardados v7, cinco personajes, IndexedDB/localStorage, exportación/importación, probabilidades, balance, minijuego, filtros, Atlas y Diario. No se afirma haber probado un teléfono físico ni GitHub Pages.
