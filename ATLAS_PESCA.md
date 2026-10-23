# Atlas de Pesca · Estable 16

Primera versión de presentación y maestría, sin encargos nuevos ni cambios de condiciones, premios, probabilidades o formato v7. El Atlas no reparte oro, XP ni cañas: su medalla es un reconocimiento visual calculado.

## Inventario real

Hay 10 zonas, 41 especies distintas y 25 encargos. Algunas especies viven en más de una zona. Los premios de colección existentes no se cuentan como encargos adicionales.

| Zona | Especies de su colección | Encargos | Umbral de primera estrella |
| --- | ---: | ---: | ---: |
| Muelle del pueblo | 5 | 1 | 3 |
| Río del Bosque | 6 | 8 | 3 |
| Costa de las Brumas | 6 | 1 | 3 |
| Laguna Esmeralda | 5 | 1 | 3 |
| Arrecife de Coral | 5 | 1 | 3 |
| Fosa de las Sombras | 5 | 1 | 3 |
| Manglares Susurrantes | 4 | 0 | 2 |
| Lago del Glaciar | 4 | 6 | 2 |
| Bahía Volcánica | 4 | 0 | 2 |
| Santuario Celestial | 4 | 6 | 2 |

Los 25 encargos son tres entregas originales, tres entregas de la expansión E187, Coleccionista y 18 desafíos de caña.

## Tres hitos independientes

1. Descubrir la mitad de las especies de la colección, redondeando hacia arriba.
2. Completar todos los encargos actuales de esa zona. No existe una marca histórica que separe «principales» y «secundarios»: esta versión los incluye a todos y muestra el denominador real. En Manglar y Bahía Volcánica, que no tienen encargos, el hito se acredita con la primera especie descubierta; la ficha explica expresamente la excepción.
3. Completar su colección de especies.

La medalla requiere los tres hitos. No se confunde con las insignias individuales, que representan recompensas ya obtenidas. Tener ocho encargos en Río no agrega estrellas ni reemplaza la colección.

## Compatibilidad y evidencia

Los descubrimientos usan el registro global de especies (`ui.e18Fishing.bySpecies`), los registros de peso por especie y peces todavía presentes en el inventario. Una insignia de colección ya reclamada (`ui.e191Achievements`) acredita los hitos de descubrimiento y colección, incluso si faltan contadores históricos. No se inventan entradas de especies para rellenarlos: la ficha indica que existe una acreditación anterior.

Las cañas ya poseídas y las banderas de mejoras E187 acreditan los encargos como antes. Poseer Coralina acredita su entrega histórica aunque no exista su bandera. No se entregan premios otra vez ni se consumen peces al consultar el Atlas.

No puede comprobarse dónde se capturó cada especie antigua: la colección original guarda descubrimientos globales y hay especies compartidas. El Atlas conserva ese criterio y lo explica en cada ficha. Los registros recientes por zona sirven para los objetivos de peso/cantidad existentes. Una partida antigua sin ningún contador, pez conservado ni insignia no permite reconstruir especies vendidas; no se supone ese progreso.

Filtros, ficha seleccionada, insignia abierta y encargos desplegados son estado temporal por personaje (`WeakMap`). No se añade ningún campo ni se cambia la versión del guardado.

## Interfaz

El Atlas aparece después de los encargos activos y antes de la tienda. Sus diez filas tienen búsqueda sin acentos y filtros Todas/Pendientes/Completas. Solo se genera la ficha completa de la zona seleccionada, con su paisaje existente, condiciones, progreso y recompensas.

Cada insignia tiene nombre, objetivos y recompensa en su descripción al pasar el mouse; el botón abre los mismos detalles en escritorio, teclado y móvil. Las filas de encargos activos muestran objetivos completados, progreso y recompensa; al desplegarlas conservan los controles y detalles originales.

## Balance observado

Los seis desafíos de una familia usan el mismo historial de su zona. El conjunto de seis puede quedar listo, antes de reclamarlos individualmente, al cumplir simultáneamente:

| Familia | Capturas acumuladas | Especies distintas | Récord mínimo que cubre los seis |
| --- | ---: | ---: | ---: |
| Custodio del Río | 30 | 3 | 6 kg |
| Pacto Boreal | 30 | 3 | 225 kg |
| Legado de las Mareas | 30 | 3 | 1080 kg |

Esto explica que varios desbloqueos aparezcan juntos. Los otros encargos del Río siguen teniendo sus propios requisitos, como entregas de inventario y Coleccionista. No se ha medido una tasa humana de éxito ni un tiempo esperado completo para cada premio. Se mantienen todos los valores en esta entrega; cualquier revisión de dificultad deberá evaluar conjuntamente disponibilidad por especie, habilidad, capacidad y ritmo de capturas. Los PDF de Fisch son referencias de especialización y colección, no una garantía del balance de Argentum ni una fuente de valores para copiar automáticamente; ver REFERENCIAS_FISCH.md.
