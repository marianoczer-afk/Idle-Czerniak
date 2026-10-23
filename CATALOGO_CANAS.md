# Catálogo e ilustraciones · Estable 12

## Alcance

50 cañas en el catálogo para una partida nueva: las 12 originales, 20 compras de las familias nuevas y 18 desafíos. Se retiraron de la oferta 40 variantes de precio cercano; las ya adquiridas siguen visibles, equipables y guardadas, por lo que una colección antigua puede tener más de 50. Se mantienen los IDs, precios y atributos de las 12 anteriores, las 41 especies, las 10 zonas y el guardado v7. No hay niveles propios de caña ni requisitos de nivel para comprar las nuevas. Los requisitos de habilidad de zonas y peces siguen vigentes.

El catálogo se define en `data-e208-catalog`, dentro de `index.html`: 13 familias con seis especialidades cada una producen los 78 IDs nuevos de forma determinista (`e208_rod_familia_especialidad`). Los `req` del catálogo solo organizan Aprendiz, Especialista y Maestría.

## Familias nuevas

| Familia | Zona de referencia | Precio base / obtención | Capacidad base |
| --- | --- | --- | --- |
| Junco Dorado | Muelle | 110 oro | 35 kg |
| Sauce Ancestral | Río | 550 oro | 100 kg |
| Marea Errante | Costa | 2.100 oro | 300 kg |
| Nenúfar Real | Laguna | 5.800 oro | 420 kg |
| Corona Coralina | Arrecife | 14.500 oro | 750 kg |
| Juramento Abisal | Fosa | 32.000 oro | 1.600 kg |
| Espina del Manglar | Manglares | 64.000 oro | 1.850 kg |
| Aurora Glacial | Glaciar | 125.000 oro | 2.200 kg |
| Forja del Eclipse | Bahía Volcánica | 230.000 oro | 2.500 kg |
| Bóveda Celestial | Santuario | 420.000 oro | 3.000 kg |
| Custodio del Río | Río | Desafíos | 500 kg |
| Pacto Boreal | Glaciar | Desafíos | 2.200 kg |
| Legado de las Mareas | Santuario | Desafíos | 3.000 kg |

Los precios y capacidades finales aplican los multiplicadores de especialidad. La capacidad se limita a 3.000 kg. Los presupuestos base de control, atracción, suerte, resiliencia y trofeos están explícitos en la tabla de datos del HTML; no se obtienen del nombre ni del índice de la caña.

## Especialidades y compromisos

| Variante | Ventaja | Compromiso | Capacidad respecto a base | Precio respecto a base |
| --- | --- | --- | ---: | ---: |
| Pulso Certero | +10 control interno (+2,5 puntos de barra) | Menos atracción, suerte y resiliencia | 80 % | 100 % |
| Cauce Indomable | +12 resiliencia | Menos control, atracción y suerte | 70 % | 110 % |
| Destello | +7 atracción | Menos control, resiliencia y suerte | 75 % | 105 % |
| Faro de Fortuna | +7 suerte | Menos control, atracción y resiliencia | 65 % | 120 % |
| Ancla de Titanes | Más capacidad | Menos control, atracción, suerte y resiliencia | 160 % | 115 % |
| Relicario | +8 trofeos | Menos control, atracción y suerte | 85 % | 125 % |

Se respetan mínimos de cero y máximos de control 64, atracción 40, suerte 43, trofeos base 45 y resiliencia 45. Las cañas nuevas permiten hasta 45 de trofeos efectivos; las anteriores conservan su tope de 35. Las estrellas se normalizan con los máximos del catálogo ampliado, sin modificar estadísticas ni añadir potencia. Las estrellas siguen siendo una orientación; el equipo más caro no es el mejor en cada atributo. La física de Estable 06/07 no cambió. Los presupuestos de esta expansión requieren más partidas para afinar precios y tiempo de obtención: las pruebas mecánicas no validan la economía a largo plazo.

## Desafíos

Las tres familias de misión usan el registro de capturas en kg existente. Cada variante requiere una combinación de capturas, especies distintas y récord de peso en su zona. Los objetivos exactos y el progreso aparecen en su fila. Los desafíos no consumen peces, no vuelven a dar XP/oro y cada caña se reclama una sola vez. Las capturas ya registradas en Estable 05–07 cuentan; no se inventan pesos para capturas anteriores a ese registro.

Las cañas de misiones anteriores también se muestran antes de conseguirlas. «Ver encargo» lleva a su zona cuando está accesible. Las nuevas recompensas no se pueden comprar mediante el controlador de compra por oro, aunque se invoque directamente.

## Arte y encuadre

Se generaron diez diseños ilustrados de familia y seis peces destacados: Leviatán, Guardián de las Mareas, Dragón Marino, Raya de la Aurora, Esturión Blanco y Mantarraya. Las variantes de una familia comparten su ilustración; no son 90 ilustraciones independientes. Las 116 imágenes embebidas anteriores se conservan en el documento, y los otros peces mantienen su arte anterior.

Las dos láminas nuevas se incluyen una sola vez en una biblioteca SVG embebida. Los símbolos tienen viewports propios y se muestran con `xMidYMid meet`: las cañas se ven completas, con mango, reel y punta. No hay enlaces a servidores de imágenes, recortes con `cover` ni deformación de las nuevas ilustraciones. La biblioteca viaja dentro del HTML descargado. Las filas son panorámicas en escritorio y pasan el arte arriba de los datos en pantallas pequeñas.

## Seguridad de renderizado

Una tienda larga podía reducir transitoriamente el alto del documento al desmontarse durante las fases de pesca. El render conserva el catálogo anterior hasta tener listo su reemplazo. No restaura scroll ni introduce scroll automático entre burbujas/captura. Las pruebas comparan posición, altura, scroll, alto de documento y HUD en ambas fases, en escritorio y móvil.

## Revisión

**32 pruebas aprobadas en Chromium**: catálogo sin IDs duplicados, presupuestos y objetivos alcanzables, compra sin nivel mínimo, bloqueo de compras de recompensas, reclamación única, recarga de nuevas propiedades/equipo, búsqueda sin tildes, filtros, referencias de arte embebidas, portabilidad del HTML exportado y revelación del arte de pez solo al capturar. Continúan las pruebas de guardado, fases, azar, control y resiliencia de versiones anteriores.

Se verifica a niveles de Pesca 1, 33 y 100 que ninguna de las 60 cañas nuevas por oro tenga todos sus atributos iguales o peores que una alternativa de igual o menor precio, con al menos un atributo estrictamente peor. La comparación incluye las compras anteriores, incluida Astral. Esta comprobación evita opciones estrictamente dominadas; no demuestra que los precios ni las seis estadísticas tengan el mismo valor práctico para cada jugador.

## Navegación desde Estable 10

La tienda inicia cerrada; las misiones y su historial aparecen primero. Las cañas de misión muestran objetivos y un acceso a su encargo cuando falta completarlo. Los desafíos nuevos se muestran también en sus zonas; usan el mismo controlador de reclamación, por lo que no duplican recompensas.

Los filtros y la ordenación permiten encontrar equipo propio, compras al alcance, misiones pendientes, zona o atributo. El catálogo y el selector del HUD priorizan las cañas obtenidas. El acceso «Mis cañas» evita recorrer las 90 filas.

## Estable 11: render e ilustración

El catálogo actual es el único que construye las filas completas: se elimina el catálogo heredado que se reemplazaba en el mismo render. No cambia el contenido de las 90 cañas. En el HUD, la ilustración usa todo el ancho con su proporción original y el nombre se presenta fuera de la imagen.

## Estable 12: selección de ofertas

Se conservan dos especialidades de compra por familia, elegidas por su función, no seis variaciones próximas de precio. `E212_OFFERS` define la selección explícita. No se cambian precios ni atributos para justificar el recorte. Los 90 IDs históricos siguen definidos, con índices estables, para preservar las partidas; el render incluye las retiradas solamente cuando pertenecen al personaje.

| Familia | Especialidades ofrecidas |
| --- | --- |
| Junco | Resiliencia, atracción |
| Sauce | Control, suerte |
| Marea | Resiliencia, capacidad |
| Nenúfar | Suerte, trofeos |
| Coral | Control, resiliencia |
| Fosa | Control, capacidad |
| Manglar | Resiliencia, suerte |
| Escarcha | Control, resiliencia |
| Obsidiana | Atracción, capacidad |
| Celeste | Control, trofeos |

Las 18 recompensas de desafíos permanecen. Cada misión muestra tres objetivos separados, progreso y marca individual de cumplimiento. Se distingue entre desafíos históricos (no consumen peces) y entregas de inventario (consumen peces, cualquier tamaño cuenta).
