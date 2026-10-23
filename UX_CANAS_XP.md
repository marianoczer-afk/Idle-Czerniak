# Selector, comparaciones y experiencia · Estable 17

Cambios de presentación sobre Estable 16. No se modifican precios, propiedad, condiciones de equipamiento/compra, fórmulas, probabilidades, misiones ni formato v7.

## Atributos revisados

- Atracción: espera efectiva hasta la picada (`e161NextBite`) y número de toques (`e195ShakeCount`).
- Suerte: pesos de especies elegibles (`e161FishDistribution`). No garantiza una especie ni reemplaza las restricciones de habilidad/capacidad.
- Control: proporción de barra (`e190CaptureWidth`); la presentación convierte el control interno a porcentaje mediante `e190ControlPercent`.
- Resiliencia: distancia y frecuencia del movimiento del pez (`e190MotionProfile`).
- Trofeos: distribución de calidad y ejemplares (`e186LuckPercent`), incluida la bonificación real por habilidad y su límite.
- Capacidad: kg máximos y acceso a especies (`e190Capacity`, `e190CanLift`, `e190SampleWeight`).

Las comparaciones utilizan `e1101Stats`, compartido con el juego. Las mejoras permanentes del personaje, como XP adicional y control global en px, no se convierten artificialmente en atributos diferentes de cada caña. El funcionamiento efectivo actual de los toques depende de atracción; no se usa un antiguo texto descriptivo como si fuera una bonificación especial vigente.

## Recomendadas

Primero van las cañas poseídas; las no obtenidas continúan visibles más abajo. Hoy las poseídas no tienen una restricción adicional de nivel para equiparlas.

Dentro de cada grupo se calculan capas de Pareto sobre los seis atributos reales. Una caña domina a otra si no es peor en ninguno y mejora al menos uno: la dominada queda en una capa posterior. Las alternativas especializadas que intercambian atributos permanecen juntas en una capa y conservan el orden estable del catálogo. No se inventa una puntuación ponderada ni se presenta una especialidad como ganadora universal.

La equipada se coloca primero dentro de su capa. Así sirve de referencia cerca de las primeras opciones cuando es competitiva, sin adelantarla artificialmente a una alternativa que la supera en todos los atributos. Reabrir el selector recalcula propiedad, equipo y estadísticas actuales. Los ordenamientos explícitos por atributo o nivel se aplican al catálogo visible completo; la prioridad de propiedad corresponde a Recomendadas.

El selector tiene búsqueda por nombre sin acentos, siete ordenamientos explícitos más Recomendadas y cierre con X/Escape. No conserva el encabezado grande ni la explicación anterior. Los nombres e ilustraciones se mantienen y la barra de herramientas se adapta a dos filas en móvil.

## Nivel requerido: datos reales

El campo histórico `rod.req` agrupa muchas cañas, pero ya no impone compra o equipamiento. No se usa como requisito real.

En esta versión solo existen cuatro cañas con un requisito explícito de habilidad en el controlador de su entrega: Viejo Pescador (6), Guardarríos (12), Brumas (24) y Coralina (32). El orden por nivel usa esos requisitos de obtención; no introduce restricciones al equipo ya ganado. Las compras por oro, Coleccionista y las nuevas familias no reciben niveles inventados. Los niveles de acceso a zonas tampoco se presentan como niveles propios de una caña.

Los elementos sin requisito explícito van al final tanto en ascendente como en descendente, con orden estable. La tienda mantiene sus categorías y filtros: el orden se aplica dentro de cada categoría. El selector emergente ordena la lista completa.

## Comparación automática

Un solo formateador sirve a selector y tienda. Cada atributo incluye valor efectivo y diferencia respecto a la equipada: ▲ verde apagado, ▼ terracota y = neutro. Las diferencias de porcentajes se expresan en puntos porcentuales (pp), las de capacidad en kg. El control compara porcentajes mostrados, no unidades internas. El signo textual evita depender solo del color. El equipo actual conserva la indicación Equipada y todas sus diferencias son iguales a cero.

## XP y nivel: eventos reales, presentación temporal

Se registran las cantidades realmente concedidas por `gainCharacterXP`, `sklXp` y el impacto de arma de `playerSwing`. Se preservan cantidades y valores de retorno. No se observan diferencias entre instantáneas de guardados para inventar ganancias.

Los premios del mismo tipo dentro de un frame se suman, por ejemplo captura más mejora de XP de Laguna. Los avisos cercanos de menos de 160 ms se agrupan y hay como máximo un XP Drop y un aviso de nivel por habilidad. El XP Drop dura 850 ms; el aviso de nivel final alcanzado y su brillo, 1800 ms. Pesca respeta el máximo visual de nivel 100, sin alterar la XP que ya concedía el juego.

Solo se usa una barra visible de la habilidad: Pesca principal, HUD o lateral como alternativas; personaje en HUD de combate/lateral; armas y las cinco habilidades existentes en sus tarjetas. No se dibuja un efecto de una habilidad en una barra de otra. Al no haber una barra visible, no se acumulan efectos para reproducirlos después.

Los elementos están en una capa fija sin interacción, a la izquierda del contador para el XP Drop y junto a la barra para el nivel, con estrella y brillo. No reservan espacio ni cambian dimensiones. Las posiciones se actualizan si un render sustituye el DOM, y se eliminan al terminar o cambiar de personaje/vista sin una barra visible. El aviso genérico de nivel anterior se omite cuando el nuevo efecto visible ya lo comunica, conservando avisos de desbloqueos y el historial original.

Se excluyen carga, importación, estados que no pertenecen al personaje activo, cálculo offline y simulaciones. Los efectos se limpian de los clones usados para descargar HTML. `prefers-reduced-motion` desactiva animaciones/desplazamiento, manteniendo un mensaje estático breve y su caducidad. No hay sonidos ni confirmaciones.
