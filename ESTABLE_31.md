# Estable 31 · Pesca, arte y progresión

Base: Estable 30, commit `6043de08b8ee24897470b5564afa023ece0dce60`. Implementación completa; no requiere aprobar propuestas. Juego offline en un único `index.html`, fuentes modulares y ZIP autónomo.

## Cambios implementados

1. **Colección:** contenedor fijo para la insignia. Pendiente, reclamable y obtenida mantienen exactamente sus coordenadas; el botón queda a la izquierda y la marca obtenida se superpone sin desplazarla. Se elimina la flecha junto a la recompensa.
2. **Tirar la caña:** ilustración artesanal pintada de boya, agua y marco de latón. Texto legible, mismo tamaño e interacción.
3. **Tienda y selector:** usan los recortes transparentes corregidos, no las antiguas láminas pintadas. Escenario compartido y SVG que se adapta al espacio real: evita bandas y deformación. Miniaturas del selector a todo el ancho; comparaciones y estado conservados. Se retira el clon desenfocado detrás de cada fila.
4. **Diario:** reflejos pequeños verdes, azules o dorados según categoría del ejemplar. Se recortan con una máscara alfa del pez: no tiñen toda la tarjeta ni iluminan el fondo. Sin animación permanente. Peces completos y proporcionales.
5. **HUD:** mantiene sus **118 px**, distribución y dimensiones exteriores. Rareza de especie en una franja compacta reservada bajo el pez, sin taparlo; Grande/Enorme/Legendario sigue en la información de captura. Zona, caña y pez usan recursos más definidos.
6. **Minijuego:** escenario submarino estático, XP con marco acuático/dorado y señal discreta del impulso del pez. Recorrido continuo con aceleración limitada y giros suaves; no hay teletransportes ni un segundo bucle de animación.
7. **Atributos:** seis iconos ilustrados propios, en las dos columnas existentes.
8. **Zonas:** 13 paisajes pintados renovados, mayor resolución y profundidad, texto con degradado localizado. Abismo Primordial usa fósiles, ámbar y una fosa sumergida, no una costa soleada. Se conserva la presentación compacta.
9. **Encargos:** 15 complementarios nuevos; 52 en total. Cuatro vías alternativas para obtener cañas que también conservan su compra por oro. Todos los encargos anteriores, sus objetivos y recompensas permanecen iguales.

## Balance implementado

El movimiento anterior podía invertir aleatoriamente la dirección cada pocas décimas, manteniendo al pez cerca del mismo punto. La simulación previa detectó capturas de mojarra con una barra fija y cañas buenas (4/20 en el ensayo central). En el otro extremo, el controlador con retardo no podía capturar algunas especies avanzadas con cañas intermedias.

Ahora el recorrido principal barre aproximadamente ±37% de la pista con pequeñas oscilaciones adicionales según especie. La velocidad y aceleración están acotadas; un resorte amortiguado hace suaves los cambios de dirección. La señal adelantada muestra el impulso. La semilla varía el recorrido entre intentos.

- **Control:** conserva su fórmula y amplía la cobertura.
- **Resiliencia:** ralentiza el patrón y suaviza la aceleración; no comprime todo el recorrido dentro de una barra quieta.
- **Atracción, suerte, trofeos y capacidad:** conservan sus estadísticas y efectos existentes. Las cañas no adquieren niveles propios.
- **Progreso de captura:** ganancia `0,13 / (1 + 0,20 × max(0, dificultad − 1)) / (1 + 0,003 × max(0, nivel requerido − 32)) × perfil de ganancia`.
- **Pérdida:** `max(0,13; 0,10 × (0,85 + 0,14 × dificultad) × perfil de pérdida)`, reducida durante los primeros 0,9 segundos para dar margen al inicio. El mínimo evita que estacionar la barra con máxima cobertura permita ganar lentamente.
- El jugador conserva su aceleración y velocidad proporcional a la pista. Las especies avanzadas requieren más seguimiento y algo más de tiempo, sin resolver la dificultad solo con velocidad.

No se modificaron probabilidades de selección, pesos, precios, estadísticas de cañas, XP ni recompensas de capturas. El cambio de balance está en el comportamiento y la tensión del minijuego.

### Comparación reproducible

20 semillas por combinación, reacción retardada aproximadamente 150 ms y decisiones cada 100 ms. Estos son resultados de un controlador simulado, **no porcentajes de éxito de jugadores**. «—» significa que no ganó dentro de 45 s en ese ensayo.

| Pez | Caña | Nivel de Pesca | Cobertura | Éxitos antes / después | Tiempo medio antes / después |
|---|---|---:|---:|---:|---:|
| Mojarra | Caña sencilla | 1 | 16.6% | 20/20 → 20/20 | 7,36 s → 6,04 s |
| Mojarra | Caña Coralina | 1 | 28.1% | 20/20 → 20/20 | 7,33 s → 5,93 s |
| Mojarra | Caña Astral | 1 | 28.9% | 20/20 → 20/20 | 7,33 s → 5,93 s |
| Caballito de mar | Caña sencilla | 33 | 15.4% | 0/20 → 20/20 | — → 18,8 s |
| Caballito de mar | Caña Coralina | 33 | 26.9% | 20/20 → 20/20 | 10,61 s → 7,3 s |
| Caballito de mar | Caña Astral | 33 | 27.6% | 20/20 → 20/20 | 10 s → 7,3 s |
| Ajolote de cuarzo | Caña sencilla | 96 | 11.4% | 0/20 → 0/20 | — → — |
| Ajolote de cuarzo | Caña Coralina | 96 | 22.9% | 0/20 → 20/20 | — → 10,5 s |
| Ajolote de cuarzo | Caña Astral | 96 | 23.6% | 2/20 → 20/20 | 27,32 s → 10,4 s |

Una caña orientada a control puede competir con otra más cara en peces livianos: no se forzó una mejora lineal por precio. La caña avanzada también aporta capacidad, suerte y otras especializaciones. El detector adicional recorre las 50 especies con seguimiento activo y comprueba cinco posiciones fijas con las cañas de mayor cobertura y mayor resiliencia: 2.200 ensayos; resultados en `arte/verificacion/estable31/simulacion-especies.json`. Las pruebas también comprueban límites de desplazamiento por paso.

## Distribución de encargos

No se movieron ni se borraron los ocho históricos del Río. Se completaron huecos en otras regiones con observación de especies, capturas locales y récords concretos; sin añadir oro. Los nuevos son complementarios para no cambiar los requisitos ni retirar estrellas de maestría ya existentes. El progreso guardado cuenta desde el primer momento.

| Zona | Nivel | Especies | Encargos antes → ahora | Principales / complementarios | Nuevas vías de caña |
|---|---:|---:|---:|---:|---|
| Muelle del pueblo | 1 | 5 | 1 → 3 | 1 / 2 | — |
| Río del Bosque | 8 | 6 | 8 → 8 | 8 / 0 | — |
| Costa de las Brumas | 18 | 6 | 1 → 3 | 1 / 2 | Marea Errante · Cauce Indomable |
| Laguna Esmeralda | 22 | 5 | 1 → 3 | 1 / 2 | Nenúfar Real · Faro de Fortuna |
| Arrecife de Coral | 32 | 5 | 1 → 3 | 1 / 2 | Corona Coralina · Cauce Indomable |
| Fosa de las Sombras | 43 | 5 | 1 → 3 | 1 / 2 | Juramento Abisal · Ancla de Titanes |
| Manglares Susurrantes | 52 | 4 | 3 → 4 | 0 / 4 | — |
| Lago del Glaciar | 62 | 4 | 6 → 6 | 6 / 0 | — |
| Bahía Volcánica | 73 | 4 | 3 → 4 | 0 / 4 | — |
| Santuario Celestial | 85 | 4 | 6 → 6 | 6 / 0 | — |
| Ruinas Sumergidas | 88 | 4 | 2 → 3 | 1 / 2 | — |
| Cavernas de Cristal | 94 | 4 | 2 → 3 | 1 / 2 | — |
| Abismo Primordial | 99 | 4 | 2 → 3 | 1 / 2 | — |

El inventario completo, incluidas recompensas y objetivos de los 52 encargos, está en `arte/inventario-estable31.json`. Las cañas exclusivas históricas siguen vinculadas a sus encargos originales; las cuatro vías nuevas son alternativas a la compra, no cañas exclusivas nuevas. Glaciar y Santuario mantienen sus seis desafíos de caña. Las regiones finales conservan sus premios regionales anteriores y suman objetivos de récord/colección.

## Rareza y categoría: equivalencia

La etiqueta del HUD usa la misma referencia de adquisición que la colección: pesos reales normalizados a nivel 100, sin suerte y en la mejor zona disponible. No es la probabilidad personal actual ni una tasa global de jugadores.

| Nombre existente | Color |
|---|---|
| Frecuente (equivalente al Común solicitado) | Neutro |
| Poco común | Verde |
| Rara | Azul |
| Muy rara | Violeta |
| Excepcional | Ámbar |
| Mítica (extremo equivalente al Legendario de especie solicitado) | Dorado |

Común, Grande, Enorme y Legendario como **categorías del ejemplar** siguen siendo independientes; no se renombraron ni se mezclaron con la rareza.

## Compatibilidad y rendimiento

Se compararon los catálogos de ejecución: mismos 50 peces, 90 cañas (50 activas y 40 históricas), 13 zonas y 37 encargos históricos con idénticos datos de juego. Solo se añaden 15 encargos. No se cambiaron los motores de guardado ni el formato v7. Los reclamos nuevos usan el registro existente y son idempotentes; conservan inventario, oro y estrellas, incluso si la caña ya había sido comprada.

Los originales gráficos se conservan. Los recortes se editan en el manifiesto de producción y se compilan al archivo único. Se reutilizan imágenes y un patrón acuático compartido; no hay imágenes independientes por variante de ejemplar. Las cachés de definiciones y rareza duran únicamente un render síncrono, para evitar datos viejos después de reclamar, importar o cambiar personaje. No se añaden observadores ni temporizadores de decoración.

En una serie de ocho cierres de captura a 390 px con CPU ralentizada ×4, la mediana de las siete muestras calientes fue **236,8 ms frente a 265,1 ms** de Estable 30. Es una medición indicativa de Chromium, no una garantía en teléfonos físicos; el registro completo está en `rendimiento-final-captura.json`.

HTML final: **23,884,650 bytes**. ZIP: **17,706,899 bytes**. Tamaño y hashes verificables en `descargas/estable31.json`.

## Verificación y entrega

Se comprobaron los 100 recortes activos transparentes: ningún píxel opaco toca sus bordes. Evidencia con hashes y coordenadas en `arte/verificacion/estable31/encuadres-alfa.json`; reproducción: `python3 scripts/check-art-frames31.py`. Los originales anteriores permanecen archivados.

Resultado final: **147 pruebas aprobadas, 0 fallos** sobre el HTML entregado. Análisis sintáctico: 69 scripts válidos y 72 bloques de estilo balanceados.

La batería comprueba Pesca, Combate, RNG, objetivos y premios, importación/exportación JSON real de cinco personajes, IndexedDB/localStorage, recarga, récords, categorías, XP Drops/Level Up, filtros, selección y compras. Las pruebas nuevas incluyen los tres estados de insignia alineados, los iconos, máscaras de reflejos, etiqueta de rareza, HUD de 118 px a 1366/390/360 px y los 15 reclamos únicos. No se conectan a perfiles del jugador.

[Capturas reales y comparaciones](arte/verificacion/estable31/index.html) · [Galería artística](arte/galeria-estable31.html) · [Pruebas registradas](arte/verificacion/estable31/pruebas.txt).

Comandos reproducibles: `npm test`, `npm run build:check`, `node scripts/simulate-fishing31.cjs`, `node scripts/measure-finish31.cjs` y `python3 scripts/package-release.py`. El ZIP se comprueba por CRC y su HTML se compara byte a byte con el de raíz.

La verificación móvil usa Chromium con vistas de 360 y 390 px, no un dispositivo físico ni Safari. El ajuste final de dificultad sigue siendo contrastable jugando; se entregó implementado y medido, sin dejar decisiones de balance pendientes de aprobación. Las 40 cañas retiradas siguen disponibles para quien las tenga, conservando su arte histórico; los recursos unificados cubren las 50 activas.
