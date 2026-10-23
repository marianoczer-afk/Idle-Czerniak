# Progresión de Pesca · Estable 28

Base: Estable 27 (`4c2724e`). Se conservan 13 zonas, 50 especies, 50 ofertas y los 90 identificadores históricos de cañas. Los 32 encargos existentes conservan objetivos y premios. Se agregan cinco vías alternativas a equipo ya existente; total: 37 encargos. No se cambia RNG, XP, dificultad del minijuego, precios ni estadísticas.

## Recorrido hasta nivel 100

| Zona | Acceso | Especies | Encargos | Colección: capturas medias / P90 |
|---|---:|---:|---:|---:|
| Muelle del pueblo | 1 | 5 | 1 | 52.5 / 104 |
| Río del Bosque | 8 | 6 | 8 | 37.5 / 74 |
| Costa de las Brumas | 18 | 6 | 1 | 54.1 / 103 |
| Laguna Esmeralda | 22 | 5 | 1 | 24 / 44 |
| Arrecife de Coral | 32 | 5 | 1 | 22.5 / 47 |
| Fosa de las Sombras | 43 | 5 | 1 | 43.7 / 82 |
| Manglares Susurrantes | 52 | 4 | 3 | 15.2 / 31 |
| Lago del Glaciar | 62 | 4 | 6 | 16.6 / 33 |
| Bahía Volcánica | 73 | 4 | 3 | 20.9 / 44 |
| Santuario Celestial | 85 | 4 | 6 | 29.3 / 61 |
| Ruinas Sumergidas | 88 | 4 | 2 | 16.6 / 34 |
| Cavernas de Cristal | 94 | 4 | 2 | 19.1 / 36 |
| Abismo Primordial | 99 | 4 | 2 | 48.3 / 105 |

Las especies compartidas no se cuentan como especies nuevas. Acceso de zona no significa que todas sus especies estén disponibles: el Atlas/colección conserva cada requisito individual. Santuario mantiene objetivos propios hasta 98; Ruinas añade metas 88–92, Cristal 94–97 y Primordial 99–100. El Titán ammonita de nivel 100 sigue siendo un objetivo de colección, no un bloqueo para reclamar las nuevas cañas.

## Cinco caminos de equipo

| Zona / encargo | Objetivos locales | Caña existente | Capturas esperadas / P90 desde cero |
|---|---|---|---:|
| Manglares Susurrantes · El pulso de las raíces | 6 Pez arquero; 4 Anguila de raíces | Espina del Manglar · Cauce Indomable | 22.9 / 32 |
| Bahía Volcánica · Templar la corriente | 6 Mero de obsidiana; 4 Pez escorpión; récord local 90 kg | Forja del Eclipse · Destello | 23.8 / 35 |
| Ruinas Sumergidas · Ancla del archivero | 6 Nautilo de bronce; 1 Congrio del archivo | Forja del Eclipse · Ancla de Titanes | 24.1 / 36 |
| Cavernas de Cristal · Afinación prismática | 8 Tetra prismático; 4 Ajolote de cuarzo | Bóveda Celestial · Pulso Certero | 22.6 / 34 |
| Abismo Primordial · Memoria de las mareas | 10 Isópodo fósil; 3 Quimera de ámbar; récord local 240 kg | Bóveda Celestial · Relicario | 32.3 / 48 |

Manglar premia resiliencia (39 a nivel 100); Volcán, atracción (38); Ruinas, capacidad (3.000 kg) con suerte/resiliencia/trofeos superiores a Astral; Cristal, control (64); Primordial, trofeos (45). Son especialidades verificables, no cañas nuevas con diferencias cosméticas. La compra original sigue disponible y no exige nivel de caña. La recompensa no equipa automáticamente. Quien ya tenga la caña recibe solamente la insignia, sin oro ni duplicados.

## Alcance de las estimaciones

3.000 simulaciones reproducibles por zona, semilla 280099. Se usan pesos relativos reales normalizados, nivel 100, suerte 0 y capacidad suficiente. El peso usa el intervalo uniforme actual. Todas las capturas simuladas tienen éxito; no se simulan entradas humanas, fallos, XP ni viajes. Se informa cantidad de capturas, no una promesa de duración. Como referencia de planificación, si una captura exitosa completa insume 12–20 s, multiplicar las capturas medias por ese intervalo; repetir con el tiempo observado del jugador para estimar su sesión. Las duraciones no fueron medidas en un teléfono físico.

Reproducir: `node scripts/review-progression28.cjs`. Datos completos: `arte/verificacion/estable28/progresion.json`. No se usaron las probabilidades de Fisch como si fueran las de Argentum.

## Decisiones y límites de balance

Río conserva ocho encargos y sus seis Custodios históricos: quitarlos, trasladarlos o bajar su poder invalidaría progreso y no es parte de esta entrega. Las zonas avanzadas reciben alternativas a equipo con ventajas reales. Santuario y Glaciar ya tienen seis encargos cada uno y no reciben más listas redundantes. Zonas intermedias mantienen colección, medalla y su objetivo existente; no todas necesitan igual cantidad de misiones.

Persiste una peculiaridad económica histórica: Astral tiene 3.000 kg de capacidad por bastante menos oro que varias cañas avanzadas. Eso vuelve poco útil premiar otra caña solo por capacidad. Los equipos tardíos se justifican por control, resiliencia, atracción o trofeos además de capacidad. No se corrigió esa economía bajando equipo que los jugadores ya poseen. Tampoco se promete una curva de horas hasta 100: exige telemetría de fallos y tiempos reales, ausente en los guardados.

## Rareza visible y maestría

Referencia estable: nivel 100, suerte 0, capacidad suficiente y la zona más favorable de cada especie; no representa la probabilidad actual del jugador. Orden por probabilidad descendente para fácil→difícil, con acceso como desempate. Bandas: Frecuente ≥25%; Poco común ≥12%; Rara ≥6%; Muy rara ≥2,5%; Excepcional ≥1%; Mítica <1%. El catálogo actual no tiene especies por debajo del 1% en esa referencia; no se inventó una etiqueta Mítica por el nombre del pez. Calidad Común/Grande/Enorme/Legendario sigue siendo independiente.

Las colecciones y el Diario comparten esta referencia. Se quita la estrella decorativa de Pez fantasma. Las tres estrellas del Atlas mantienen sus condiciones y máscaras históricas. Los cinco encargos nuevos son complementarios: no revocan medallas. La colección pendiente entrega solo su insignia visual; las banderas históricas y el oro ya cobrado no se modifican. Los encargos económicos anteriores mantienen su oro.

Las cantidades locales usan `fishingWeights.byZone[zone].species[id]`. Si una partida antigua no registró ese dato, no puede atribuirse una captura global a una zona arbitrariamente: ese objetivo mostrará solo las capturas locales verificables. No se reescribe el historial.
