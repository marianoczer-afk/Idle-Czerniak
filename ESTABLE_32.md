# Estable 32 · Ejemplares, manejo y recompensas

Base: Estable 31 (`76e9844`). Se conservan 13 zonas, 50 especies y 50 cañas activas (90 IDs históricos), ilustraciones existentes, HUD de 118 px y guardados v7. No se agregan sistemas ni contenido gráfico pesado.

## Correcciones del Diario

La categoría filtraba las especies y la ilustración, pero el texto y los ordenamientos conservaban cifras generales. Ahora general muestra total/récord absoluto; cada categoría muestra solo su récord y contador verificado. Los pesos desconocidos dicen «Sin récord registrado»; los contadores desconocidos, «Cantidad sin registrar». Los contadores parciales se identifican como capturas registradas desde Estable 32. El resumen tampoco atribuye todo el historial a Común cuando faltan contadores.

Los contadores históricos explícitos se adoptan sin sobrescribir el registro original. Las nuevas capturas agregan `categoryCounts` y `categoryCountBaseline` dentro del registro de peso existente. La línea de base conserva cuántas capturas anteriores carecen de clasificación; no reparte esas capturas entre categorías. Se preservan los campos desconocidos de los registros históricos. Cuando hay dos contadores generales parciales, la lectura conserva el mayor; no altera los datos guardados. No hay migración destructiva ni cambios al esquema v7.

## Apariencia de ejemplares

Común conserva el animal normal; Grande tiene pequeños reflejos; Enorme agrega reflejos plateados/azulados; Legendario presenta reflejos dorados y destellos localizados. Capas SVG estáticas recortadas por el alfa del propio animal, sin filtros generales, animación permanente ni imágenes nuevas. [Ejemplos reales de las cuatro categorías](arte/verificacion/estable32/index.html).

## Balance aplicado

Control define la cobertura; Resiliencia reduce el ritmo y la aceleración del animal sin encoger su recorrido. La exigencia aumenta con especie, región y carga (peso/capacidad real), y disminuye con el manejo del equipo. El nivel aporta una ayuda pequeña y acotada. No hay teletransportes ni capturas automáticas con la barra quieta.

- Aporte de Control: `control / 500` de la pista (antes `/400`); todas las comparativas y descripciones se actualizan. Los valores internos de los atributos no se cambian.
- Cobertura: `clamp(0.15 + control/500 + min(0.012,(nivel-1)/8250) - (dificultad-1)*0.018 - demanda*0.045, 0.075, 0.30)`. Mínimo visible de 16 px.
- `demanda = (nivel requerido de especie - 1)/99`. El nivel requerido sigue perteneciendo al personaje, nunca a la caña.
- Resiliencia: `distancia = 1 - resiliencia*0.5`, `intervalo = 1 + resiliencia*2`, donde resiliencia está normalizada a 0–0.6. El intervalo interviene con potencia 0.65.
- Manejo: `0.65*control/64 + 0.35*resiliencia/60`. Déficit: `max(0,0.20+0.90*demanda-manejo)`.
- Carga: peso muestreado dividido por capacidad, limitado a 0–1. Aumenta esfuerzo y exigencia, sin cambiar el muestreo de pesos ni sus límites.
- Progreso ganado se divide por `1+0.85*déficit+0.35*carga`; pérdida se multiplica por `1+0.65*déficit+0.25*carga`.
- Velocidad del animal limitada a 0.38 pistas/s; impulso anunciado por el indicador existente. Se conserva la velocidad y aceleración de entrada del jugador.
- Pulso del abismo conserva +8 px en la referencia de 520 px; en móvil escala proporcionalmente y deja de ser una ventaja desmedida por tener una pista más corta.

No cambian las probabilidades de especies/calidades, XP, precios, capacidad, inventario ni recompensas de oro. Tampoco se baja ningún atributo histórico de caña. Hay diferencias útiles: mayor control facilita corregir posición; mayor resiliencia ofrece más tiempo para reaccionar; mayor capacidad reduce la carga relativa y permite pesos que una caña pequeña no puede levantar.

### Simulación representativa

Controlador idéntico para cada equipo, decisiones cada 100 ms y retraso de observación de 150 ms, 20 semillas. Son comparaciones mecánicas, **no porcentajes de éxito de jugadores reales**. Los fracasos rápidos no se interpretan como capturas rápidas.

| Especie | Equipo | Estable 31 | Estable 32 |
|---|---|---:|---:|
| Pez arquero | Bambú del Remanso | 20/20 · 7,05 s | 0/20 · sin capturas |
| Pez arquero | Rama Coralina | 20/20 · 7,05 s | 20/20 · 7,86 s |
| Pez arquero | Raíz Indómita | 20/20 · 7,05 s | 20/20 · 7,22 s |
| Pez arquero | Mandato del Firmamento | 20/20 · 7,15 s | 20/20 · 7,05 s |
| Tarpón plateado | Bambú del Remanso | 20/20 · 7,88 s | 0/20 · sin capturas |
| Tarpón plateado | Rama Coralina | 20/20 · 7,72 s | 20/20 · 9,83 s |
| Tarpón plateado | Raíz Indómita | 20/20 · 7,72 s | 20/20 · 8,45 s |
| Tarpón plateado | Mandato del Firmamento | 20/20 · 7,79 s | 20/20 · 7,82 s |
| Ajolote de cuarzo | Bambú del Remanso | 11/20 · 37,65 s | 0/20 · sin capturas |
| Ajolote de cuarzo | Rama Coralina | 20/20 · 10,5 s | 0/20 · sin capturas |
| Ajolote de cuarzo | Raíz Indómita | 20/20 · 10,44 s | 0/20 · sin capturas |
| Ajolote de cuarzo | Mandato del Firmamento | 20/20 · 10,32 s | 20/20 · 18,8 s |

La verificación ampliada recorre todas las especies con seguimiento ideal y compara equipo inferior, apropiado y avanzado, niveles de entrada/100 y pistas de 520/200 px. Incluye intentos estáticos. Resultados y parámetros en `arte/verificacion/estable32/balance-completo.json`. El seguimiento experto puede superar equipo inferior cuando su capacidad permite el ejemplar; el retraso de reacción hace visible el coste de ese equipo. El Ajolote de cuarzo con equipo avanzado tarda aproximadamente 19 s en el controlador con retraso; no se forzó que una caña inicial sea cómoda a nivel 96.

## Cañas: nombres anteriores y nuevos

Se revisaron las 50 activas; 47 cambian de nombre. IDs, inventario y equipo seleccionado permanecen iguales. Las 40 retiradas conservan su identidad histórica. La búsqueda acepta también los nombres anteriores, sin mostrarlos como prefijos en las tarjetas.

| ID estable | Antes | Ahora |
|---|---|---|
| `e161_rod_bamboo` | Caña de bambú | Bambú del Remanso |
| `e161_rod_fiber` | Caña de fibra | Hilo de Plata |
| `e161_rod_steel` | Caña reforzada | Acero del Barquero |
| `e192_rod_laguna` | Caña Esmeralda | Vara Esmeralda |
| `e192_rod_coral` | Caña de Nácar | Aguja de Nácar |
| `e208_rod_junco_cauce` | Junco Dorado · Cauce Indomable | Raíz Serena |
| `e208_rod_junco_destello` | Junco Dorado · Destello | Chispa del Estanque |
| `e208_rod_sauce_pulso` | Sauce Ancestral · Pulso Certero | Veta del Sauce |
| `e208_rod_sauce_fortuna` | Sauce Ancestral · Faro de Fortuna | Ojo del Martín Pescador |
| `e208_rod_marea_cauce` | Marea Errante · Cauce Indomable | Timón de la Niebla |
| `e208_rod_marea_titan` | Marea Errante · Ancla de Titanes | Quilla de Bronce |
| `e208_rod_nenufar_fortuna` | Nenúfar Real · Faro de Fortuna | Susurro de Nenúfar |
| `e208_rod_nenufar_reliquia` | Nenúfar Real · Relicario | Relicario de Jade |
| `e208_rod_coral_pulso` | Corona Coralina · Pulso Certero | Aguja del Atolón |
| `e208_rod_coral_cauce` | Corona Coralina · Cauce Indomable | Abrazo del Coral |
| `e208_rod_fosa_pulso` | Juramento Abisal · Pulso Certero | Compás de la Fosa |
| `e208_rod_fosa_titan` | Juramento Abisal · Ancla de Titanes | Ancla del Silencio |
| `e208_rod_mangle_cauce` | Espina del Manglar · Cauce Indomable | Raíz Indómita |
| `e208_rod_mangle_fortuna` | Espina del Manglar · Faro de Fortuna | Lucerna del Manglar |
| `e208_rod_escarcha_pulso` | Aurora Glacial · Pulso Certero | Aguja de la Aurora |
| `e208_rod_escarcha_cauce` | Aurora Glacial · Cauce Indomable | Abrazo de Escarcha |
| `e208_rod_obsidiana_destello` | Forja del Eclipse · Destello | Ascua del Eclipse |
| `e208_rod_obsidiana_titan` | Forja del Eclipse · Ancla de Titanes | Yunque de Obsidiana |
| `e208_rod_celeste_pulso` | Bóveda Celestial · Pulso Certero | Meridiano Celestial |
| `e208_rod_celeste_reliquia` | Bóveda Celestial · Relicario | Astrolabio de las Mareas |
| `e208_rod_custodio_pulso` | Custodio del Río · Pulso Certero | Custodio del Río |
| `e208_rod_custodio_cauce` | Custodio del Río · Cauce Indomable | Trenza de Corrientes |
| `e208_rod_custodio_destello` | Custodio del Río · Destello | Centella del Junquillo |
| `e208_rod_custodio_fortuna` | Custodio del Río · Faro de Fortuna | Ojo de Ámbar |
| `e208_rod_custodio_titan` | Custodio del Río · Ancla de Titanes | Ancla de los Juncos |
| `e208_rod_custodio_reliquia` | Custodio del Río · Relicario | Memoria del Roble |
| `e208_rod_boreal_pulso` | Pacto Boreal · Pulso Certero | Aguja del Invierno |
| `e208_rod_boreal_cauce` | Pacto Boreal · Cauce Indomable | Pacto Boreal |
| `e208_rod_boreal_destello` | Pacto Boreal · Destello | Aliento de la Aurora |
| `e208_rod_boreal_fortuna` | Pacto Boreal · Faro de Fortuna | Lucero del Deshielo |
| `e208_rod_boreal_titan` | Pacto Boreal · Ancla de Titanes | Colmillo del Glaciar |
| `e208_rod_boreal_reliquia` | Pacto Boreal · Relicario | Corona de Cristal Helado |
| `e208_rod_eterno_pulso` | Legado de las Mareas · Pulso Certero | Mandato del Firmamento |
| `e208_rod_eterno_cauce` | Legado de las Mareas · Cauce Indomable | Juramento del Horizonte |
| `e208_rod_eterno_destello` | Legado de las Mareas · Destello | Albor de las Mareas |
| `e208_rod_eterno_fortuna` | Legado de las Mareas · Faro de Fortuna | Oráculo de las Estrellas |
| `e208_rod_eterno_titan` | Legado de las Mareas · Ancla de Titanes | Balanza del Leviatán |
| `e208_rod_eterno_reliquia` | Legado de las Mareas · Relicario | Legado de las Mareas |
| `e171_rod_rio` | Caña del Guardarríos | Guardarríos |
| `e171_rod_costa` | Caña de las Brumas | Vigía de las Brumas |
| `e18_rod_trofeo` | Caña del Coleccionista | Tesoro del Coleccionista |
| `e187_rod_coral` | Caña Coralina | Rama Coralina |

## Recompensas y progresión

Se corrige el rótulo «Insignia» en los nueve encargos regionales que realmente entregan una caña. Todas las recompensas de caña ahora se identifican con «Caña · nombre». Las 20 recompensas sin caña tienen un nombre de insignia propio; no sustituyen el equipamiento por una insignia. Se conservan las 52 ilustraciones distintas de encargos y las medallas exclusivas ya integradas.

Tres insignias conservan su premio visual y agregan una mejora regional pequeña:

| Encargo | Insignia | Mejora |
|---|---|---|
| Puentes entre raíces | Nudo de las Raíces | Paso entre raíces: +2 puntos de Resiliencia, solo Manglares Susurrantes |
| La memoria de la forja | Sello de la Forja | Temple de ceniza: +0,4 puntos porcentuales de barra, solo Bahía Volcánica |
| Los primeros estratos | Huella del Primer Océano | Memoria primordial: +2 puntos de Resiliencia, solo Abismo Primordial |

Estas mejoras se derivan de la bandera de reclamo existente; no incrementan atributos guardados al cargar, no necesitan una bandera duplicada y no se acumulan entre regiones. Los encargos ya reclamados reciben el efecto correspondiente sin repetir objetivos. Se conservan Instinto de pescador (+5% XP) y Pulso del abismo.

Los 18 encargos de familias ahora exigen explícitamente la habilidad de Pesca del personaje que ya figuraba en su franja: Río 18, Boreal 65 y Mareas 90. Así las cañas gratuitas del Río no se obtienen con solo unas capturas a nivel 8. No se revocan cañas poseídas ni se bloquea equiparlas. Las compras por oro siguen sin requisito de nivel. Estrellas, objetivos de capturas/peso y premios históricos permanecen.

## Optimización y verificación

**156 casos distintos aprobados:** batería completa de 155 pruebas sin fallos, seguida por una revalidación de 12 casos sobre la compilación final que incluye un caso histórico adicional. Se prueban capturas reales de las cuatro categorías, recarga, exportación/importación v7, Combate, filtros, equipo, recompensas y progresión. El registro conserva ambos resultados sin sumar repeticiones.

- Una sola lectura de récords por tarjeta al filtrar/ordenar, reutilizada para texto y apariencia: 100 → 50 lecturas con 50 especies.
- Un único listener de apertura del Diario, aunque se regenere varias veces: tras ocho regeneraciones, 9 → 1 listeners. Evita cierres que conservan listas antiguas.
- Bonificaciones regionales indexadas, sin reconstruir listas ni objetos en cada consulta de estadísticas.
- Perfil de carga calculado una vez al iniciar la captura; no hay consultas del DOM en la simulación ni un RAF adicional.
- Variantes gráficas estáticas reutilizan las mismas imágenes. El HTML crece menos de 0,1% respecto de Estable 31.

Medición orientativa a 390 px con CPU ×4: cierre síncrono mediano 130,7 ms antes y 131,55 ms después. No equivale a una medición en un teléfono físico.

HTML: 23,896,998 bytes. ZIP: 17,711,331 bytes; se verifica CRC y coincidencia byte a byte con `index.html`.

[Pruebas](arte/verificacion/estable32/pruebas.txt) · [Capturas y variantes](arte/verificacion/estable32/index.html) · [Descargas verificables](descargas/estable32.json). Pruebas de navegador en Chromium, escritorio y móviles simulados de 390/360 px; no dispositivo físico ni Safari.
