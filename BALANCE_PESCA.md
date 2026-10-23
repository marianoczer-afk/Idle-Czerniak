# Pesca · primer balance de peso, control y resiliencia (Estable 06)

## Referencia y alcance

Referencia: el PDF aportado «Cañas de pescar - Wiki oficial de pesca», páginas 1–2, procedente de https://fischipedia.org/wiki/Fishing_Rods. Se usan sus conceptos de especialización: control determina el ancho de la barra, resiliencia afecta distancia y frecuencia del movimiento del pez, capacidad limita sus kg y suerte afecta rareza, separadamente del peso. No se copiaron precios, cañas ni escalas extremas de Fisch. Es una primera iteración propia de Argentum, no un balance final validado con partidas humanas prolongadas.

Se asignaron rangos de peso a las **41 especies existentes**, en las **10 zonas existentes**. No se agregaron peces, zonas, ilustraciones ni cañas. Se habilitó un desafío para obtener una caña del catálogo que ya existía sin un botón funcional para reclamarla.

## Capacidad y especialización

Las cañas no tienen niveles: se compran con oro o se consiguen por encargos. Los requisitos de habilidad de peces y zonas existentes continúan vigentes.

| Caña | Capacidad | Control añadido a la barra | Resiliencia |
| --- | ---: | ---: | ---: |
| Sencilla | 25 kg | 0 % | 0 % |
| Bambú | 60 kg | 3 % | 28 % |
| Fibra | 180 kg | 5,5 % | 5 % |
| Reforzada | 400 kg | 8 % | 8 % |
| Viejo Pescador | 90 kg | 7,5 % | 7 % |
| Guardarríos | 240 kg | 9 % | 32 % |
| Brumas | 650 kg | 11 % | 12 % |
| Coleccionista | 320 kg | 8,75 % | 10 % |
| Coralina | 550 kg | 11,5 % | 16 % |
| Esmeralda | 350 kg | 9,5 % | 11 % |
| Nácar | 900 kg | 10,75 % | 16 % |
| Astral | 3000 kg | 12,25 % | 22 % |

Bambú y Guardarríos ganan especialización en resiliencia. Su menor capacidad y otros atributos mantienen diferencias frente a equipo más caro. Astral puede acceder a todos los rangos de peso actuales, pero no es la caña con más resiliencia. Los demás valores de velocidad, suerte, trofeos, precios y recompensas existentes se conservaron.

## Peso físico

Cada especie tiene un rango propio. Ejemplos:

| Especie | Rango |
| --- | ---: |
| Mojarra | 0,10–0,65 kg |
| Bagre | 1–6 kg |
| Lucio | 2–14 kg |
| Atún gigante | 35–160 kg |
| Mantarraya legendaria | 55–320 kg |
| Cría de leviatán | 180–900 kg |
| Guardián de las mareas | 600–2400 kg |

Una especie solo entra en el sorteo si su peso mínimo cabe en la caña. El peso del ejemplar se sortea uniformemente, con dos decimales, entre su mínimo y el menor de su máximo y la capacidad del equipo. Por ejemplo, el bambú puede capturar atunes de 35–60 kg; ejemplares de 160 kg necesitan otra caña. No hay una segunda tirada de rotura de línea después de ganar el minijuego.

Se mantienen los pesos relativos de rareza del selector anterior, incluido el factor preexistente 0,42 del atún, entre las especies que siguen siendo elegibles. **La distribución final sí puede cambiar al excluir especies por capacidad.** No se fuerza rotación ni se evitan rachas. Si no queda ninguna especie elegible, el juego lo explica y deshabilita lanzar; no entrega una mojarra de otra zona como fallback.

Kg y calidad son distintos. Normal/Grande/Enorme/Legendario mantienen sus probabilidades y multiplicadores de venta anteriores. Suerte no aumenta kg. No se agregó venta por peso en esta entrega, para no cambiar también la economía al mismo tiempo.

Las capturas anteriores conservan sus cantidades, calidad y valor: no se inventan pesos retroactivos. Las nuevas registran kg, mejor peso por especie y estadísticas por zona en `state.ui.fishingWeights`, manteniendo formato v7 y claves de almacenamiento. Las cantidades de inventario siguen siendo la fuente para vender o entregar peces.

## Control y movimiento

La barra ya no depende únicamente de píxeles absolutos, que daban proporciones distintas en móvil y escritorio. Su proporción es:

```text
fracción = limitar(0,16 + control/400 + bonus_habilidad/2000
                  − (dificultad_especie − 1) × 0,025, 0,10, 0,36)
ancho = limitar(ancho_recorrido × fracción + bonus_abismo,
                mínimo 28 px, máximo 55 % del recorrido)
```

`bonus_habilidad` conserva la progresión anterior: +2 cada 3 niveles, hasta 22 unidades. El premio del abismo sigue añadiendo 8 px físicos. La barra se recalcula si cambia el ancho de pantalla durante una captura. Los valores del catálogo de control se muestran como porcentaje añadido de barra, no como antiguos px.

La resiliencia aplica:

```text
distancia_movimiento = 1 − resiliencia × 0,65
intervalo_giros = 1 + resiliencia × 1,5
```

Aquí resiliencia se expresa como fracción entre 0 y 0,60. Las especies conservan sus atributos base, pero Estable 06 usa esos atributos para movimiento proporcional al recorrido, giros más frecuentes y ráfagas. El movimiento del jugador también escala con el recorrido para conservar los tiempos de respuesta entre pantallas. La ganancia por segundo es 0,105 / (1 + max(0, dificultad − 1) × 0,18); la pérdida es 0,095 × (0,8 + dificultad × 0,30). Esto reemplaza la victoria casi inmediata de Estable 05. Se retiró un frenado de velocidad del jugador aplicado por frame y se integró la resiliencia en el inicio compartido: ahora funciona tanto con burbujas como con cañas automáticas. La física efectiva se concentra en `e190FishingStep`, con azar inyectable para pruebas.

Las estrellas siguen siendo orientativas. Ahora contemplan capacidad y resiliencia especializada: control 30 %, resiliencia 25 %, atracción 15 %, suerte 10 %, trofeos de base 10 % y capacidad 10 %. Capacidad usa una escala logarítmica para no dominar la valoración; el nivel del personaje no aumenta estrellas.

## Desafío del río

**El trofeo de las corrientes** recompensa con la Caña del Coleccionista existente. Objetivos de capturas nuevas en el Río del Bosque:

- 5 capturas.
- 3 especies distintas.
- Un récord de al menos 8 kg.

Se reclama una sola vez, no consume peces ni vuelve a entregar XP/oro por las capturas. Un antiguo trofeo extraordinario del río acredita el desafío para conservar ese progreso. La marca de legado se fija al comenzar el registro de pesos: una nueva captura de calidad Enorme no evita los tres objetivos.

## HUD y experiencia

El pez/silueta del HUD es un control accesible por clic, Enter y espacio. Solo esa acción del jugador vuelve a una vista con barra de experiencia y minijuego. No se llama al cambio de pestaña si ya se está pescando, para conservar la sesión activa. No hay scroll automático entre burbujas y captura.

La XP real se refleja en la barra principal, el lateral y el HUD; una captura reciente resalta su progreso sin modificar la geometría. Los nuevos kg se revelan al capturar, nunca durante la picada.

## Validación y límites

Las pruebas de Chromium cubren todos los rangos de peso y las 12 capacidades, barras a tres anchos de pantalla y durante un resize, aplicación de resiliencia en la ruta de burbujas, conservación de la respuesta del jugador, pool vacío y recuperación al comprar equipo, click/teclado en HUD durante una sesión, XP real, captura única, récords tras recarga y recompensa de misión sin duplicaciones. Se conservaron las comprobaciones de fases, guardados, arte y HTML descargado.

El selector se contrastó con 1.160.000 sorteos reproducibles en los escenarios con especies elegibles; dos de los 60 escenarios de la matriz quedan vacíos por capacidad y se prueban explícitamente. La simulación de física con un controlador fijo y 40 semillas por combinación mostró, como comprobación mecánica, que Guardarríos puede manejar el leviatán con más facilidad que Reforzada dentro de sus pesos permitidos. Ese controlador reacciona sin la latencia de una persona: no es una estimación de éxito para jugadores ni una validación definitiva de dificultad.

## Ajuste Estable 06: dificultad y presentación

Atracción reduce también los toques de preparación: limitar(3 + floor(max(0, dificultad − 1) × 1,5) − floor(atracción/10), 1, 5). Se elimina la decisión por nombre de caña y el salto completo de burbujas. El botón dice «Picar». No cambia el escenario entre fases ni se agrega scroll automático.

La tienda reserva 40 % de la fila para el arte en escritorio; las imágenes de cañas y del pez del HUD usan cover, llenando sus marcos sin deformarse. Esto puede recortar bordes del fondo según la proporción de cada ilustración; la colección conserva contain.

Validación: 27 pruebas de navegador aprobadas. Se añadió una simulación de seguimiento con decisiones cada 200 ms y 40 semillas, junto con controles sin entrada y botón sostenido. Exige diferencia entre Sencilla y Brumas ante morenas, peces iniciales accesibles, dificultad final aun con Astral y comportamiento comparable a distintos anchos. No es una tasa de éxito humano: sirve como regresión mecánica. El ajuste necesita validación jugando. Guardados, capacidades, catálogo, precios, XP por captura y probabilidades de aparición no se modificaron en esta entrega.

## Estable 10: comportamiento de especies del arrecife

La alternancia demasiado frecuente de dirección podía encerrar el movimiento en un tramo pequeño de una barra amplia. Se extiende la duración de las corridas para cuatro especies y se ajustan sus velocidades y tiempos de progreso, sin cambiar `E161_DIFFICULTY`, el selector ni las probabilidades de aparición. Lubina conserva su comportamiento más accesible.

| Especie | Velocidad de corrida | Duración entre decisiones de giro | Ganancia de captura | Pérdida fuera de barra |
| --- | ---: | ---: | ---: | ---: |
| Pez luna | ×1,08 | ×1,3 | ×0,96 | ×1,08 |
| Caballito de mar | ×1,26 | ×1,4 | ×0,92 | ×1,18 |
| Morena | ×1,34 | ×1,9 | ×0,86 | ×1,30 |
| Tiburón de arrecife | ×1,48 | ×2,1 | ×0,82 | ×1,40 |

Los multiplicadores se aplican a la física previa, después de conservar control y resiliencia efectivos. No hay saltos de posición ni rotura aleatoria adicional. Las otras 37 especies mantienen su física anterior. Los efectos se aplican por especie en cualquier zona donde esté disponible, de modo que el mismo pez no cambie de comportamiento por cambiar de pantalla.

Simulación de regresión, nivel 33, 40 semillas, decisiones cada 200 ms y máximo de 60 s: la morena pasó de 14/40 con Sencilla y 40/40 con Brumas a 0/40 y 34/40 en ese controlador. Con decisiones cada 80 ms, Sencilla consiguió 11/40 y Brumas 40/40. El resultado verifica diferencias y que una caña básica todavía pueda conseguirla con mejor seguimiento; no estima tasas humanas de éxito. No se pretende obligar a fallar a un jugador experto que sigue bien al pez.
